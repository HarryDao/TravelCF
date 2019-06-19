import React from 'react';
import {
    ScrollView, 
    View, 
    Text,
    LayoutAnimation, 
    Dimensions, 
    ActivityIndicator,
    Vibration,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { COLORS } from '../styles';
import * as actions from '../actions';
import { validatePassword, comparePasswords } from '../helpers/validation';
import Modal from './Modal';
import PinInput from './PinInput';
import Input from './Input';
import ButtonClose from './ButtonClose';

const SCREEN_WIDTH = Dimensions.get('window').width;
const INITIAL_STATE = {
    loading: false, 
    code: '', 
    openResetPasswordPanel: false,
    password: '',
    confirmPassword: '',
    errors: {
        password: '',
        confirmPassword: '',
    }
}


class ResetPassword extends React.Component {
    state = JSON.parse(JSON.stringify(INITIAL_STATE))

    componentDidMount() {
        this.setState({ loading: false, openResetPasswordPanel: false });
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            openResetPasswordPanel: nextProps.validKey
        });

        if (nextProps.reset) {
            this.onFormReset();
            this.props.onResetPasswordDone(this.state.password);
        }
    }


    onCodeComplete = (code, cb) => {
        const { email } = this.props;

        this.setState({ loading: true, code });
        this.props.validateResetPasswordLink({ email, key: code }, (err) => {
            this.setState({ loading: false }, () => {
                return cb(err);
            });
        });
    }


    onInputChange = (stateName, value) => {
        this.setState({ [stateName]: value });
    }

    onFormSubmit = () => {
        const { email } = this.props;
        const { password, code } = this.state;

        const { isValid, errors } = this.validateForm();

        this.setState({ errors });

        if (!isValid) {
            return Vibration.vibrate();
        }

        this.setState({ loading: true });
        this.props.resetPassword({ email, password, key: code }, () => {
            this.setState({ loading: false });
        })
    }

    onFormReset = () => {
        this.props.resetResetPasswordForm();
        this.setState(JSON.parse(JSON.stringify(INITIAL_STATE)));
    }

    onModalHide = () => {
        this.onFormReset();
        this.props.toggleModal(false);
    }

    validateForm = () => {
        const { password, confirmPassword } = this.state;
        const errors = {
            password: '',
            confirmPassword: '',
        };
        let isValid = true;

        const passwordError = validatePassword(password);
        if (passwordError) {
            errors.password = passwordError;
            isValid = false;
        }

        const confirmPasswordError = comparePasswords(password, confirmPassword);
        if (confirmPasswordError) {
            errors.confirmPassword = confirmPasswordError;
            isValid = false;
        }

        return { isValid, errors };
    }

    renderMessage() {
        if (this.state.loading) {
            return <ActivityIndicator/>;
        }
        else if(this.props.error) {
            return (
                <View >
                    <Text style={styles.errorText}>{this.props.error}</Text>
                </View>
            );
        }
    }

    render() {
        const { showModal } = this.props;
        const { openResetPasswordPanel } = this.state;
        const {
            pinContainerStyle,
            formContainerStyle,
            buttonStyle,
            buttonTextStyle
        } = styles;

        return (
            <Modal
                visible={showModal}
            >
                <ScrollView
                    horizontal
                    marginLeft={openResetPasswordPanel ? -SCREEN_WIDTH : 0}
                    scrollEnabled={false}
                >
                    <View style={pinContainerStyle}>
                        <ButtonClose
                            onPress={this.onModalHide}
                        />
                        <PinInput
                            keyProp='ResetPassword'
                            codeLength={6}
                            label='Enter 6 digit code to reset'
                            onCodeComplete={this.onCodeComplete}
                            loading={this.state.loading}
                            error={this.props.validKey === false ? 'Invalid Code' : null}
                            message='An email has been sent to your account.'
                        />
                    </View> 
                    <View style={formContainerStyle}>
                        <ButtonClose
                            onPress={this.onModalHide}
                        />
                        {this.renderMessage()}
                        <Input
                            label='Password'
                            value={this.state.password}
                            onChangeText={value => this.onInputChange('password', value)}
                            placeholder='password'
                            secureTextEntry
                            error={this.state.errors.password}
                        />
                        <Input
                            label='Confirm Password'
                            value={this.state.confirmPassword}
                            onChangeText={value => this.onInputChange('confirmPassword', value)}
                            placeholder='re-enter password'
                            secureTextEntry
                            error={this.state.errors.confirmPassword}
                        />

                        <Button
                            title='Submit'
                            backgroundColor={COLORS.aqua_dark}
                            large
                            buttonStyle={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={this.onFormSubmit}
                        />
                    </View>             
                </ScrollView>
            </Modal>
        );
    }
}

const styles = {
    pinContainerStyle: {
        width: SCREEN_WIDTH,
    },
    formContainerStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
    },
    buttonStyle: {
        marginTop: 20,
    },
    buttonTextStyle: {
        fontSize: 22,
        lineHeight: 30,
        fontWeight: '600'
    },
    errorText: {
        fontSize: 25,
        lineHeight: 30,
        textAlign: 'center',
        fontWeight: '600',
        color: COLORS.red_light,
    }
}

const mapStateToProps = ({ auth }) => {
    const { validKey, error, reset } = auth.resetPassword;

    return { validKey, error, reset };
    
}

export default connect(mapStateToProps, actions)(ResetPassword);