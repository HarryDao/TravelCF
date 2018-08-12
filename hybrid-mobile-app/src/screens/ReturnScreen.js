import React from 'react';
import { View, Text, ActivityIndicator, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { COLORS } from '../styles';
import * as actions from '../actions';
import Result from '../components/Result';
import ResultError from '../components/ResultError';
import { SCREEN_LOADING_TIME } from '../../configs/app';

class ReturnScreen extends React.Component {
    static navigationOptions = {
        title: 'Return'
    }

    state = {
        loading: false, 
        hide: true, 
        isInputValid: false,
    }

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
        const {
            origin, 
            destination, 
            hasReturnDate, 
            returnDate, 
            fetchReturnTrip
        } = props;

        if (
            !initial &&
            origin === this.props.origin &&
            destination === this.props.destination &&
            hasReturnDate === this.props.hasReturnDate &&
            JSON.stringify(returnDate) === JSON.stringify(this.props.returnDate)
        ) {
            return;
        }

        const isInputValid = hasReturnDate && returnDate ? true : false;

        if (hasReturnDate && returnDate) {
            this.setState({ isInputValid, loading: true })
            fetchReturnTrip({ origin, destination, returnDate }, () => this.setState({ loading: false }));
        }
        else {
            this.setState({ isInputValid });
        }
    }

    renderContent() {
        const {
            origin,
            destination,
            hasReturnDate,
            returnDate,
            returnTrip,
        } = this.props;

        if (this.state.loading || this.state.hide) {
            return <ActivityIndicator size='large'/>;
        }

        if (!this.state.isInputValid) {
            return (
                <ResultError
                    buttonTitle='To Search'
                    onPress={() => this.props.navigation.navigate('search')}
                />
            );
        }

        else if (!hasReturnDate) {
            return (
                <Text style={styles.errorTextStyle}>
                    You didn't set "Return Date" in search!
                </Text>
            );
        }

        return (
            <Result
                flightType='return'
                from={destination}
                to={origin}
                time={returnDate}
                flights={returnTrip}
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
    errorTextStyle: {
        fontSize: 30,
        textAlign: 'center',
        color: COLORS.red_light,
        padding: 10,
    }
}

const mapStateToProps = ({ search }) => {
    let {
        searchForm: {
            origin,
            destination,
            hasReturnDate,
            returnDate
        },
        searchResult: { returnTrip }
    } = search;

    return {
        origin,
        destination,
        hasReturnDate,
        returnDate,
        returnTrip
    }
}

export default connect(mapStateToProps, actions)(ReturnScreen);