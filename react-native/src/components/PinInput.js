import React from 'react';
import {
    View, 
    Text, 
    Dimensions, 
    TextInput, 
    LayoutAnimation,
    ActivityIndicator,
    Vibration
} from 'react-native';
import { COLORS } from '../styles';
const SCREEN_WIDTH = Dimensions.get('window').width;


class PinInput extends React.Component {    
    state = { code: [], currentIndex: 0 }

    componentDidMount() {
        if (this.props.codeLength) {
            this.generateCode();
        }
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    generateCode = () => {
        const code = new Array(this.props.codeLength).fill('');
        this.setState({ code, currentIndex: 0 }, () => {
            this.onInputFocusChange();
        });        
    }

    onBackspacePress = (e) => {
        if (e.nativeEvent && 
            e.nativeEvent.key === 'Backspace' &&
            this.state.currentIndex > 0) {
            this.setState({ currentIndex: this.state.currentIndex - 1 }, () => {
                this.onInputFocusChange();
            });
        }
    }

    onInputPress = (value, index) => {
        let code = [...this.state.code];

        code[index] = value;
        this.setState({ code });

        if (code.join('').length === code.length) {
            this.props.onCodeComplete(code.join(''), (err) => {
                if (err) {
                    Vibration.vibrate();
                    this.generateCode();
                }
            });
        }
        
        if (index < code.length - 1 && value) {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.onInputFocusChange();
            });
        }
    }

    onInputFocus = (index) => {
        this.setState({ currentIndex: index });
    }

    onInputFocusChange = () => {
        this.refs[`${this.props.keyProp}-digit-${this.state.currentIndex}`].focus();
    }

    renderCode(index) {
        const { keyProp, labelColor, textColor } = this.props;

        let customStyle = {};
        if (labelColor) {
            customStyle.borderColor = labelColor;
        }
        if (textColor) {
            customStyle.color = textColor;
        }

        return (
            <TextInput
                ref={`${keyProp}-digit-${index}`}
                style={[styles.inputStyle, customStyle]}
                key={index}
                value={this.state.code[index]}
                keyboardType='numeric'
                maxLength={1}
                onChangeText={value=>this.onInputPress(value, index)}
                onFocus={() => this.onInputFocus(index)}
                selectTextOnFocus
                onKeyPress={this.onBackspacePress}
            />
        );
    }

    renderCodes() {
        const code =  this.state.code.map((digit, index) => {
            return this.renderCode(index);
        });

        return (
            <View style={styles.inputWrapperStyle}>
                {code}
            </View>
        );
    }

    renderMessage() {
        const { error, message, loading } = this.props;

        if (loading) {
            return <ActivityIndicator size='large'/>
        }
        else if (error) {
            return <Text style={styles.errorStyle}>{error}</Text>
        } 
        else if (message) {
            return <Text style={styles.messageStyle}>{message}</Text>
        }
    }

    render() {
        const { label, labelColor } = this.props;
        const { containerStyle, labelStyle, messageWrapperStyle } = styles;
        const customStyle = labelColor ? { color: labelColor } : {};

        return (
            <View style={containerStyle}>
                <View style={messageWrapperStyle}>
                    {this.renderMessage()}
                </View>

                <Text style={[labelStyle, customStyle]}>
                    {label}
                </Text>
                
                {this.renderCodes()}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelStyle: {
        color: COLORS.white,
        fontSize: 25,
        lineHeight: 35,
    },
    inputWrapperStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingTop: 20,
    },
    inputStyle: {
        width: SCREEN_WIDTH/12, 
        height: SCREEN_WIDTH/6,
        marginLeft: SCREEN_WIDTH/36,
        marginRight: SCREEN_WIDTH/36,
        borderBottomWidth: 5,
        borderColor: COLORS.white,
        color: COLORS.aqua,
        fontSize: 40,
        lineHeight: 50,
        fontWeight: '600',
        textAlign: 'center',
        paddingBottom: 5
    },
    messageWrapperStyle: {
        marginBottom: 20,
        position: 'absolute',
        top: 50,
    },
    errorStyle: {
        fontSize: 30,
        color: COLORS.red_light,
        textAlign: 'center',
        fontWeight: '600',
    },
    messageStyle: {
        fontSize: 20,
        color: COLORS.green_light,
        textAlign: 'center',
        fontWeight: '600'
    }
}

export default PinInput;