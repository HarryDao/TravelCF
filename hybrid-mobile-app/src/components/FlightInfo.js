import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../styles';

const FlightInfo = ({ from, to, time }) => {
    const {
        containerStyle,
        rowStyle,
        cityStyle,
        timeStyle,
        iconStyle
    } = styles;

    return (
        <View style={containerStyle}>
            <View style={rowStyle}>
                <Text style={cityStyle}>{from}</Text>
                <Icon
                    type='material-icon' 
                    name='flight' 
                    color={COLORS.aqua} 
                    size={30}
                    containerStyle={iconStyle}
                />
                <Text style={cityStyle}>{to}</Text>
            </View>

            <View >
                <Text style={timeStyle}>{time}</Text>
            </View>
        </View>
    );
}

const styles = {
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cityStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        color: COLORS.white,
        fontWeight: '600'
    },
    timeStyle: {
        fontSize: 15,
        color: COLORS.white,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: '500',
    },
    iconStyle: {
        transform: [{ rotate: '90deg' }], 
        marginTop: 5
    }
}

export default FlightInfo;