import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Button } from './common';
import { COLORS } from '../styles';


const SortButton = ({ iconType, iconName, iconSize, onPress }) => {
    return (
        <Button
            style={styles.buttonWrapper}
            onPress={onPress}
        >
            <View style={styles.buttonContent}>
                <Icon
                    type='entypo'
                    name='arrow-long-down'
                    color={COLORS.aqua_darker}
                    size={iconSize * 0.8}
                />
                <Icon
                    type={iconType}
                    name={iconName}
                    color={COLORS.aqua_darker}
                    size={iconSize}
                />
            </View>
        </Button>
    );
}

const styles = {
    buttonWrapper: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        shadowColor: COLORS.black_light,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        elevation: 1,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row'
    }
}

export default SortButton;