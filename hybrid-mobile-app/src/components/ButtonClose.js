import React from 'react';
import { Button } from 'react-native-elements';
import { COLORS } from '../styles';

export default  ({ onPress, containerViewStyle, backgroundColor, color, fontSize }) => {
    return (
        <Button
            title='X'
            containerViewStyle={[{ position: 'absolute', top: 0, right: 0, zIndex: 99, opacity: 0.7 }, containerViewStyle]}
            backgroundColor={backgroundColor || COLORS.transparent_white}
            fontSize={fontSize || 30}
            fontWeight='500'
            color={color || COLORS.grey_light}
            onPress={onPress}
        />
    );
}