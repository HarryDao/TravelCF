import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { composeDateText } from '../helpers/time';
import { COLORS } from '../styles';
import { getDateInfo } from '../helpers/time';
import ResultCard from './ResultCard';
import FlightInfo from './FlightInfo';
import SortButton from './SortButton';

const SORTS = {
    takeoff: {
        iconType: 'font-awesome', 
        iconName: 'clock-o',
        iconSize: 20
    }, 
    price: {
        iconType: 'font-awesome', 
        iconName: 'dollar',
        iconSize: 20,
    }
}

const sortFlights = (flights, prop) => {
    return flights.sort((a, b) => a[prop] > b[prop] ? 1: -1);
}


const composeDateTitle = (time) => {
    const converted = getDateInfo(new Date(Date.UTC(time.year, time.month - 1, time.date, 0, 0, 0, 0)));

    if (!converted || !converted.year) {
        return 'Invalid Date'
    }

    const { year, month, date, monthString, dayString } = converted;

    return `${composeDateText(year, month, date)} (${dayString.slice(0, 3)}, ${date} ${monthString.slice(0, 3)} ${year})`;
}



class Result extends React.Component {
    state = { sort: 'takeoff' }

    onSortChange = () => {
        this.setState({ sort: this.state.sort === 'price' ? 'takeoff' : 'price' });
    }

    renderTripInfo() {
        let { flightType, from, to, time } = this.props;
        const { iconType, iconName, iconSize } = SORTS[this.state.sort];

        const timeString = composeDateTitle(time);

        return (
            <View style={styles.controlContainer}>
                <View style={styles.infoContainer}>
                    <FlightInfo
                        flightType={flightType}
                        from={from}
                        to={to}
                        time={timeString}
                    />
                </View>

                <View style={styles.sortContainer}>
                    <SortButton
                        iconName={iconName}
                        iconType={iconType}
                        iconSize={iconSize}
                        onPress={this.onSortChange}
                    />
                </View>
            </View>
        );
    }

    renderFlights() {
        const flights = sortFlights(this.props.flights, this.state.sort);

        return flights.map((flight, index) => {
            return (
                <ResultCard
                    flightType={this.props.flightType}
                    flight={flight} 
                    key={`flight-${index}`}
                />
            );
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderTripInfo()}

                <ScrollView style={styles.flightsContainer}>
                    {this.renderFlights()}
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    controlContainer: {
        height: 70,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.aqua_darker,
        flexDirection: 'row',
    },
    infoContainer: {
        flex: 5,
    },
    sortContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingLeft: 10,
        paddingRight: 10,  
    },
    flightsContainer: {
        top: 70,
        marginBottom: 100,
    }
}

export default Result;