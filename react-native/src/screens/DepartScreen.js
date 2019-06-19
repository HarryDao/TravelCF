import React from 'react';
import {
    View, 
    ActivityIndicator, 
    Dimensions,
    LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { COLORS } from '../styles';
import * as actions from '../actions';
import Result from '../components/Result';
import ResultError from '../components/ResultError';
import { SCREEN_LOADING_TIME } from '../../configs/app';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class DepartScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const hasReturnDate = navigation.getParam('hasReturnDate', true);

        const createHeaderRight = () => {
            if (hasReturnDate) {
                return (
                    <Button
                        title='Return'
                        backgroundColor={COLORS.transparent_white}
                        color={COLORS.ios_blue}
                        onPress={() => navigation.navigate('return')}
                    />
                );
            }

            return <View/>
        }

        return {
            headerTitle: 'Depart',
            headerRight: createHeaderRight()
        }
    }

    state = { loading: false, hide: true, isInputValid: false }

    componentWillMount() {
        this.fetchData(this.props, true);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ hide: false });
        }, SCREEN_LOADING_TIME); 
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    fetchData = (props, initial = false) => {
        const { origin, destination, departDate, fetchDepartTrip } = props;
        const isInputValid = origin && destination && departDate ? true : false;

        if (
            !initial &&
            origin === this.props.origin &&
            destination === this.props.destination &&
            JSON.stringify(departDate) === JSON.stringify(this.props.departDate) 
        ) {
            return;
        }

        if (isInputValid) {
            this.setState({ isInputValid, loading: true });
            fetchDepartTrip({ origin, destination, departDate }, () => {
                this.setState({ loading: false });
            });
        }
        else {
            this.setState({ isInputValid });
        }
    }

    renderContent() {
        const { origin, destination, departDate, departTrip } = this.props;

        if (!this.state.isInputValid) {
            return (
                <ResultError
                    buttonTitle='To Search'
                    onPress={() => this.props.navigation.navigate('search')}
                />
            )
        }

        if (this.state.loading || this.state.hide) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large'/>
                </View>
            );
        }

        return (
            <Result
                flightType='depart'
                from={origin}
                to={destination}
                time={departDate}
                flights={departTrip}
            />
        );
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                {this.renderContent()}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: COLORS.black_light,
        justifyContent: 'center',
        position: 'relative',
    },
    loadingContainer: {
        minHeight: SCREEN_HEIGHT * 0.7,
        justifyContent: 'center'
    }
}

const mapStateToProps = ({ search }) => {
    let {
        searchForm: {
            origin,
            destination,
            departDate,

        },
        searchResult: { departTrip }
    } = search;

    return { origin, destination, departDate, departTrip }
}

export default connect(mapStateToProps, actions)(DepartScreen);