import React from 'react';
import { View, Text, Switch } from 'react-native';
import { FormInput, FormLabel, FormValidationMessage } from 'react-native-elements';
import { COLORS } from '../styles';

const Input =  (props) => {
    const {
        isSwitch,
        label,
        value,
        onChangeText,
        error,
        placeholder,
        secureTextEntry,
        style,
    } = props;

    const {
        inputContainerStyle,
        labelStyle,
        inputStyle,
        switchContainerStyle,
        switchTextStyle,
        errorStyle
    } = styles;

    if (isSwitch) {
        const textColorStyle = {
            color: value ? COLORS.ios_green : COLORS.grey_dark,
            fontWeight: value ? '600': '300'
        }

        return (
            <View style={[switchContainerStyle, style]}>
                <Switch
                    value={value}
                    onValueChange={onChangeText}
                />
                <Text style={[switchTextStyle, textColorStyle]}>{label}</Text>
            </View>
        );
    }

    return (
        <View style={inputContainerStyle}>
            <FormLabel labelStyle={labelStyle}>{label}</FormLabel>
            <FormInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry ? true: false}
                inputStyle={inputStyle}
                placeholderTextColor={COLORS.grey}
                autoCapitalize='none'
                autoCorrect={false}
            /> 
            <FormValidationMessage labelStyle={errorStyle}>
                {error}
            </FormValidationMessage>
        </View>
    );
}

const styles = {
    inputContainerStyle: {
        marginTop: 5,
        marginBottom: 5,
    },
    labelStyle: {
        fontSize: 18,
        lineHeight: 24,
        color: COLORS.aqua
    },
    inputStyle: {
        color: COLORS.white,
        paddingTop: 5,
        fontSize: 18,
        lineHeight: 24,
        paddingBottom: 5,
    },
    switchContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchTextStyle: {
        fontSize: 18,
        lineHeight: 24,
        marginLeft: 10,
        color: COLORS.white,
    },
    errorStyle: {
        fontSize: 18,
        lineHeight: 24,
        color: COLORS.red_light
    }
}

export default Input;