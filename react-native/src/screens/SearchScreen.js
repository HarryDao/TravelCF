import React from 'react';
import {
    ScrollView,
    View, 
    Text, 
    LayoutAnimation, 
    ActivityIndicator,
    Dimensions,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Button as ButtonElement } from 'react-native-elements';
import _ from 'lodash';
import { saveSearch, getSearch, removeSearch, removeToken } from '../services/AsyncStorage';
import { COLORS } from '../styles';
import * as actions from '../actions';
import { composeDateText, getDateInfo } from '../helpers/time';
import SearchInput from '../components/SearchInput';
import { Button } from '../components/common';
import Input from '../components/Input';
import { SCREEN_LOADING_TIME } from '../../configs/app';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const INPUTS = ['origin', 'destination', 'departDate', 'returnDate'];

const mapDates = dates => _.map(dates, date => date);
const createAirportTitle = ({ time, iata, city, country }) => {
    return `${city}, ${country} (${iata})`;
}
const createDateTitle = (input) => {
    const converted = getDateInfo(new Date(Date.UTC(input.year, input.month - 1, input.date, 0, 0, 0, 0)));
    if (!converted || !converted.year) {
        return 'Invalid';
    }

    const {
        year,
        month,
        monthString,
        date,
        dayString,
    } = converted;
    return `${composeDateText(year, month, date)} (${dayString.slice(0,3)}, ${monthString.slice(0,3)} ${date} ${year})`;
}



class SearchScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Search',
        headerRight: (
            <ButtonElement
                title='Recent'
                backgroundColor={COLORS.transparent_white}
                color={COLORS.ios_blue}
                onPress={() => navigation.navigate('recent')}
            />
        ),
        headerLeft: (
            <ButtonElement
                title='Logout'
                backgroundColor={COLORS.transparent_white}
                color={COLORS.ios_blue}
                onPress={() => {
                    Alert.alert(
                        'Logout', 
                        'Are your sure you want to logout?',
                        [
                            {
                                text: 'Cancel', 
                                style: 'cancel'
                            },
                            { text: 'Logout', onPress:() => {
                                
                                removeSearch();
                                removeToken();
                                
                                Alert.alert(
                                    'Logout!',
                                    'You have successfully logged out. Restart app to login again (If on Expo, shake your device).'
                                );
                                
                            }}
                        ],
                        { cancelable: true }
                    );
                }}
            />
        )
    });

    state = {
        activeInput: '',
        origin: '',
        destination: '',
        departDate: '',
        returnDate: '',
        isFormValid: false,
        hide: true,
        loading: false,
        originLoading: false,
        destinationLoading: false,
        departDateLoading: false,
        returnDateLoading: false,
        enableAnimation: true,
    }

    async componentWillMount() {
        const savedSearch = await getSearch();

        if (!savedSearch || !savedSearch.state || !savedSearch.props) {
            return this.onInputLoading('originLoading', (cb) => {
                this.props.fetchOrigin(cb);
            });
        }

        this.props.restoreSavedSearch(savedSearch.props);

        this.setState({ ...savedSearch.state });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.enableAnimation) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ hide: false });
        }, SCREEN_LOADING_TIME);
    }

    componentWillReceiveProps(nextProps) {
        const {
            originOptions,
            destinationOptions,
            origin,
            destination,
            departDate,
            returnDate,
        } = nextProps;

        const state = {}

        state.origin = origin && 
                        originOptions && 
                        originOptions[origin] ?
                        createAirportTitle(originOptions[origin]) : '';
        state.destination = destination && 
                            destinationOptions && 
                            destinationOptions[destination] ?
                            createAirportTitle(destinationOptions[destination]) : '';
        state.departDate = departDate ? createDateTitle(departDate) : '';
        state.returnDate = returnDate ? createDateTitle(returnDate) : '';
        state.isFormValid = this.validateForm(nextProps);

        this.setState({ ...state });
    }

    validateForm = (props) => {
        const {
            origin,
            destination,
            departDate,
            hasReturnDate,
            returnDate,            
        } = props;

        if (origin && destination && departDate) {
            if (!hasReturnDate || returnDate) {
                return true;
            }
        }

        return false;
    }

    onActiveInputChange = (newInput) => {
        let nextInput = '';

        switch(newInput) {
            case 'next':
                let currentIndex = INPUTS[this.state.activeInput];
                nextInput = INPUTS[currentIndex + 1] || '';
                break;
            default:
                nextInput = newInput;
        }

        if (nextInput === this.state.activeInput) {
            return;
        }

        this.setState({ activeInput: '' });
        setTimeout(() => {
            this.setState({ activeInput: nextInput });
        }, 200)
    }

    onInputLoading = (state, fn) => {
        this.setState({ [state]: true }, () => {
            return fn(() => {
                this.setState({ [state]: false });
            });
        });
    }

    onInputSelect = (keyProp, value) => {
        const {
            origin,
            destination,
            departDate,
            returnDate,

            setOrigin,
            fetchDestination,
            setDestination,
            fetchDepartDate,
            setDepartDate,
            fetchReturnDate,
            setReturnDate
        } = this.props;

        switch(keyProp) {
            case 'origin':
                if (value !== origin) {
                    setOrigin({ origin: value });
                    this.onInputLoading('destinationLoading', (cb) => {
                        fetchDestination({ origin: value }, cb);
                    });
                }
                break;
            case 'destination':
                if (value !== destination) {
                    setDestination({ origin, destination: value });
                    this.onInputLoading('departDateLoading', (cb) => {
                        fetchDepartDate({ origin, destination: value }, cb);
                    });
                }
                break;
            case 'departDate':
                if (!departDate || JSON.stringify(value) !== JSON.stringify(departDate)) {
                    setDepartDate({ departDate: value });
                    this.onInputLoading('returnDateLoading', (cb) => {
                        fetchReturnDate({ origin, destination, departDate: value }, cb);
                    });
                }
                break;
            case 'returnDate':
                if (!returnDate || JSON.stringify(value) !== JSON.stringify(returnDate)) {
                    setReturnDate({ returnDate: value });
                }
        }


        this.onActiveInputChange('next');

    }


    onFormSubmit = async () => {
        try {
            if (!this.state.isFormValid) {
                return;
            }
            
            this.setState({ loading: true });
            const {
                origin,
                destination,
                departDate,
                hasReturnDate,
                returnDate,
                originOptions,
                destinationOptions,
                departDateOptions,
                returnDateOptions,
                saveUserNewSearch,
            } = this.props;
    
            const props = {
                origin,
                destination,
                departDate,
                returnDate,
                originOptions,
                destinationOptions,
                departDateOptions,
                returnDateOptions,           
            }
            const state = this.state;
    
            await saveSearch(state, props);
            await saveUserNewSearch({
                origin,
                destination,
                departDate,
                returnDate,
                props,
                state
            });

            this.setState({ loading: false, enableAnimation: false }, () => {
                this.props.navigation.navigate('depart', {
                    hasReturnDate: hasReturnDate && returnDate
                });
            });
        }
        catch(err) {}
    }


    renderAirportRow = (keyProp, row) => {
        return (
            <Button
                onPress={() => this.onInputSelect(keyProp, row.iata)}
            >
                <Text style={styles.buttonTextStyle}>{createAirportTitle(row)}</Text>
            </Button>
        );
    }

    renderDateRow = (keyProp, row) => {
        return (
            <Button
                onPress={() => this.onInputSelect(keyProp, row)}
            >
                <Text style={styles.buttonTextStyle}>{createDateTitle(row)}</Text>
            </Button>
        );
    }

    renderReturnDate() {
        const {
            origin,
            destination,
            departDate,
            hasReturnDate,
            returnDateOptions,
        } = this.props;

        if (!origin || !destination || !departDate || !hasReturnDate) {
            return;
        }

        if (this.state.returnDateLoading) {
            return <ActivityIndicator size='small' />
        }

        if (hasReturnDate && returnDateOptions && Object.keys(returnDateOptions).length > 0) {
            return (
                <SearchInput
                    keyProp='returnDate'
                    label='Return'
                    iconType='evilicon'
                    icon='search'
                    placeholder='Select a date'
                    value={this.state.returnDate}
                    options={mapDates(returnDateOptions)}
                    renderRow={row => this.renderDateRow('returnDate', row)}
                    activeInput={this.state.activeInput}
                    onActiveInputChange={this.onActiveInputChange}
                />                  
            );
        }
    }

    renderToggleReturnDate() {
        const {
            departDate,
            hasReturnDate,
            toggleReturnDate
        } = this.props;

        if (departDate) {
            return (
                <Input
                    isSwitch
                    label='Has Return Date?'
                    value={hasReturnDate}
                    onChangeText={() => toggleReturnDate(!hasReturnDate)}
                    style={{ marginBottom: 20, marginTop: 10 }}
                />            
            );
        }
    }

    renderDepartDate () {
        const {
            origin,
            destination,
            departDateOptions
        } = this.props;

        if (!origin || !destination) {
            return;
        }

        if (this.state.departDateLoading) {
            return <ActivityIndicator size='small' />
        }

        if (departDateOptions && Object.keys(departDateOptions).length > 0) {
            return (
                <SearchInput
                    keyProp='departDate'
                    label='Depart'
                    iconType='evilicon'
                    icon='search'
                    placeholder='Select a date'
                    value={this.state.departDate}
                    options={mapDates(departDateOptions)}
                    renderRow={row => this.renderDateRow('departDate', row)}
                    activeInput={this.state.activeInput}
                    onActiveInputChange={this.onActiveInputChange}
                />
            )
        }
    }

    renderDestination() {
        const {
            origin,
            destinationOptions,
        } = this.props;

        if (!origin) {
            return;
        }

        if (this.state.destinationLoading) {
            return <ActivityIndicator size='small' />
        }

        if (destinationOptions && Object.keys(destinationOptions).length > 0) {
            return (
                <SearchInput
                    keyProp='destination'
                    label='To'
                    iconType='evilicon'
                    icon='search'
                    placeholder='Select a city'
                    value={this.state.destination}
                    options={destinationOptions}
                    renderRow={row => this.renderAirportRow('destination', row)}
                    activeInput={this.state.activeInput}
                    onActiveInputChange={this.onActiveInputChange}
                />  
            );
        }
    }

    renderOrigin() {
        if (this.state.originLoading) {
            return <ActivityIndicator size='small' />
        }

        return (
            <SearchInput
                keyProp='origin'
                label='From'
                iconType='evilicon'
                icon='search'
                placeholder='Select a city'
                value={this.state.origin}
                options={this.props.originOptions}
                renderRow={row => this.renderAirportRow('origin', row)}
                activeInput={this.state.activeInput}
                onActiveInputChange={this.onActiveInputChange}
            />
        );
    }

    renderSubmit() {
        if (this.state.isFormValid) {
            if (this.state.loading) {
                return <ActivityIndicator size='large'/>
            }

            return (
                <ButtonElement
                    title='Search'
                    large
                    onPress={this.onFormSubmit}
                    backgroundColor={this.state.isFormValid ? COLORS.aqua_dark : COLORS.grey}
                    fontWeight='500'
                    fontSize={20}
                    buttonStyle={{ marginBottom: 15 }}
                />
            );
        }
    }

    renderContent() {
        if (this.state.hide) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large'/>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                {this.renderOrigin()}
                {this.renderDestination()}
                {this.renderDepartDate()}
                {this.renderReturnDate()}
                {this.renderToggleReturnDate()}
                {this.renderSubmit()}
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.scrollView}>
                {this.renderContent()}
            </ScrollView>
        );
    }
}

const styles = {
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.black_light,
    },
    loadingContainer: {
        minHeight: SCREEN_HEIGHT * 0.7,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 100,

    },
    buttonTextStyle: {
        color: COLORS.white,
        fontSize: 20,
        lineHeight: 25,
    }
}

const mapStateToProps = ({ search }) => {
    const {
        originOptions,
        destinationOptions,
        departDateOptions,
        returnDateOptions,
        origin,
        destination,
        departDate,
        hasReturnDate,
        returnDate,
    } = search.searchForm;

    return {
        originOptions,
        destinationOptions,
        departDateOptions,
        returnDateOptions,
        origin,
        destination,
        departDate,
        hasReturnDate,
        returnDate,       
    }
}


export default connect(mapStateToProps, actions)(SearchScreen);

