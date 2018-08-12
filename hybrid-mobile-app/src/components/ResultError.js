import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { COLORS } from '../styles';


const ResultError = ({ buttonTitle, onPress }) => {
    return (   
        <View style={styles.errorWrapper}>
            <Text style={styles.errorText}>
                Please edit your iterary in Search panel
            </Text>
            <Button
                title={buttonTitle}
                backgroundColor={COLORS.aqua_darker}
                color={COLORS.white}
                fontSize={18}
                fontWeight='600'
                onPress={onPress}
            />
        </View>       
    );
}

const styles = {
    errorWrapper: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    errorText: {
        color: COLORS.red_light,
        fontSize: 22,
        lineHeight: 25,
        textAlign: 'center',
        marginBottom: 20,
    }
}

export default ResultError;