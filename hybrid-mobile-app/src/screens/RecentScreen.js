import React from 'react';
import {
    ScrollView, 
    View, 
    Text, 
    ActivityIndicator,
    LayoutAnimation,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Card, Icon } from 'react-native-elements';
import * as actions from '../actions';
import { COLORS } from '../styles';
import { getDateInfo, composeDateText } from '../helpers/time';
import { Button } from '../components/common';
import { SCREEN_LOADING_TIME } from '../../configs/app';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const composeDateTitle = (time, shortForm = false) => {
    let converted;
    if (typeof time === 'number') {
        converted = getDateInfo(new Date(time));
    }
    else {
        converted = getDateInfo(new Date(Date.UTC(time.year, time.month - 1, time.date, 0, 0, 0, 0)));
    }

    const { year, month, date, dayString, monthString } = converted;
    if (shortForm) {
        return composeDateText(year, month, date);
    }

    return `${composeDateText(year, month, date)}, (${dayString}, ${date} ${monthString} ${year})`;
}

const composeAirportTitle = ({ city, country }) => {
    return `${city} (${country})`
}



class RecentScreen extends React.Component {
    static navigationOptions = {
        title: 'Recent Searches'
    }

    state = { loading: false, hide: true, enableAnimation: true }

    componentWillMount() {
        this.setState({ loading: true });
        this.props.fetchUserSearchHistory(() => {
            this.setState({ loading: false });
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ hide: false });
        }, SCREEN_LOADING_TIME);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.enableAnimation) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    onButtonPress = (savedProps) => {
        this.props.restoreSavedSearch(savedProps);
        this.setState({ enableAnimation: false }, () => {
            this.props.navigation.navigate('depart', {
                hasReturnDate: savedProps.returnDate ? true : false
            });
        });
    }

    renderTripRow (from, fromCity, to, toCity, time) {
        const {
            rowStyle,
            timeStyle,
            wrapperStyle,
            airportStyle,
            textMainStyle, 
            textStyle,
            iconStyle
        } = styles;

        if (time) {
            return (
                <View style={rowStyle}>
                    <Text style={timeStyle}>{time}</Text>
                    <View style={wrapperStyle}>
                        <View style={airportStyle}>
                            <Text style={textMainStyle}>{from}</Text>
                            <Text style={textStyle}>{fromCity}</Text>
                        </View>

                        <View style={iconStyle}>
                            <Icon
                                type='material-icons' 
                                name='flight-takeoff' 
                                color={COLORS.aqua}
                            />
                        </View>

                        <View style={airportStyle}>
                            <Text style={textMainStyle}>{to}</Text>
                            <Text style={textStyle}>{toCity}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    }

    renderSearches() {
        const { searches, cities } = this.props;

        if (!searches || searches.length === 0) {
            return (
                <View style={styles.errorWrapper}>
                    <Text style={styles.errorText}>
                        You dont have any recent searches yet!
                    </Text>
                </View>
                
            );
        }


        return searches.map(search => {
            let { props, time, origin, destination, departDate, returnDate } = search;

            const timeString = composeDateTitle(time);
            
            if (departDate) {
                departDate = composeDateTitle(departDate, true);
            }

            if (returnDate) {
                returnDate = composeDateTitle(returnDate, true);
            }
            
            const originCity = composeAirportTitle(cities[origin]);
            const destinationCity = composeAirportTitle(cities[destination]);

            return (
                <Button
                    key={time} 
                    style={styles.buttonStyle}
                    onPress={() => this.onButtonPress(props)}
                >
                    <Card
                        title={timeString}
                        titleStyle={styles.titleStyle}
                        containerStyle={{ flex: 1 }}
                    >
                        {this.renderTripRow(origin, originCity, destination, destinationCity, departDate)}
                        {this.renderTripRow(destination, destinationCity, origin, originCity, returnDate)}
                    </Card>
                </Button>
            );
        });
    }

    renderContent() {
        if (this.state.loading || this.state.hide) {
            return (
                <View style={styles.loadingWrapper}>
                    <ActivityIndicator size='large' alignSelf='center' />
                </View>
            );
        }

        return this.renderSearches();
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: COLORS.black_light }}>
                {this.renderContent()}
            </ScrollView>
        );
    }
}

const styles = {
    loadingWrapper: {
        minHeight: SCREEN_HEIGHT * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black_light,
    },
    titleStyle: {
        fontStyle: 'italic',
    },
    buttonStyle: {
        flex: 1, 
        borderBottomWidth: 0
    },
    rowStyle: {
        backgroundColor: COLORS.aqua_darker,
        padding: 5,
    },
    timeStyle: {
        color: COLORS.white,
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: '600',
        padding: 5,
    },
    wrapperStyle: {
        flexDirection: 'row'
    },
    airportStyle: {
        flex: 3,
        alignItems: 'center',
    },
    textMainStyle: {
        color: COLORS.aqua,
        fontSize: 18,
    },
    textStyle: {
        color: COLORS.white,
        fontSize: 15,
        textAlign: 'center'
    },
    iconStyle: {
        flex: 1,
    },
    errorWrapper: {
        minHeight: SCREEN_HEIGHT * 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: COLORS.red_light,
        fontSize: 30,
        textAlign: 'center'
    }
}

const mapStateToProps = ({ search }) => {
    const { searches, cities } = search.searchHistory;

    return { searches, cities }
}

export default connect(mapStateToProps, actions)(RecentScreen);