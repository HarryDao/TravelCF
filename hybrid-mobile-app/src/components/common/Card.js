import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../styles';

const Card = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}


const styles = {
    container: {
        borderBottomWidth: 1,
        borderColor: COLORS.grey,
        padding: 5,
    }
}
export { Card };