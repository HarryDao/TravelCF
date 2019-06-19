import React from 'react';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../styles';

const Button = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
}

const styles = {
    button: {
        padding: 10,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: COLORS.grey,
    },
}

export { Button };