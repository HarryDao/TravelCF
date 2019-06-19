import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { convertMinutesToHours } from '../helpers/time';
import { images } from '../media';
import { COLORS } from '../styles';


const ResultCard = ({ flight }) => {
    let {
        airline,
        price, 
        minutes, 
        origin_city, 
        destination_city, 
        takeoff_local, 
        landing_local
    } = flight;

    minutes = convertMinutesToHours(minutes).timeString;

    return (
        <Card
            title={`USD ${price}`}
        >
            <View>
                <Text style={styles.minutes}>{minutes}</Text>
                <View style={styles.detailWrapper}>
                    <View style={styles.detailAirline}>
                        <Image source={images[airline]} style={styles.detailAirlineImage} />
                    </View>

                    <View style={styles.detailCity}>
                        <Text style={styles.detailAirportText}>{origin_city}</Text>
                        <Text style={styles.detailTimeText}>{takeoff_local}</Text>
                    </View>

                    <View  style={styles.detailIconWrapper}>
                        <Icon type='material-icon' name='flight' color={COLORS.aqua_darker} containerStyle={styles.detailIcon}/>
                    </View>

                    <View style={styles.detailCity}>
                        <Text style={styles.detailAirportText}>{destination_city}</Text>
                        <Text style={styles.detailTimeText}>{landing_local}</Text>
                    </View>
                </View>
            </View>
        </Card>
    );
}


const styles = {
    minutes: {
        textAlign: 'center',
        marginBottom: 10,
        color: COLORS.aqua_darker,
        fontWeight: '600',
    },
    detailWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailCity: {
        flex: 2,
        alignItems: 'center'
    },
    detailAirportText: {
        color: COLORS.black_light,
        fontWeight: '600'
    },
    detailTimeText: {
        color: COLORS.aqua_darker,
        fontWeight: '600'
    },
    detailIconWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    detailIcon: {
        transform: [{ rotate: '90deg' }]
    },
    detailAirline: {
        flex: 1,
        alignItems: 'center',
    },
    detailAirlineImage: {
        height: 30,
        width: 50,
    }
}

export default ResultCard;