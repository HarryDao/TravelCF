import React from 'react';
import {
    ScrollView, 
    View, 
    Text, 
    LayoutAnimation, 
    ActivityIndicator,
    Dimensions,
    Vibration
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import * as actions from '../actions';
import { COLORS } from '../styles';
import {
    validatePassword, 
    validateEmail, 
    comparePasswords
} from '../helpers/validation';
import Input from '../components/Input';
import Activate from '../components/Activate';
import ResetPassword from '../components/ResetPassword';
import { SCREEN_LOADING_TIME } from '../../configs/app';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const INITIAL_STATE = {
    showActivateUserModal: false,
    showForgotPasswordModal: false,
    loading: false,
    email: '',
    password: '',
    confirmPassword: '',
    isRegister: false,
    errors: {
        email: '',
        password: '',
        confirmPassword: '',
    },
    hide: true,
    enableAnimation: true,
}


class LoginScreen extends React.Component {
    state = JSON.parse(JSON.stringify(INITIAL_STATE))

    componentWillUpdate(nextProps, nextState) {
        if (nextState.enableAnimation) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ hide: false });
        }, SCREEN_LOADING_TIME); 
    }

    componentWillUnmount() {
        this.resetForm();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authenticated) {
            this.setState({ enableAnimation: false }, () => {
                return this.props.navigation.navigate('search');
            });
        }

        if (nextProps.error) {
            Vibration.vibrate();
        }
    }

    onGoogleOauthPress = () => {
        this.setState({ loading: true });
        this.props.loginWithOAuthGoogle(() => {
            this.setState({ loading: false });
        });
    }

    onFormSubmit = () => {
        const { isValid, errors } = this.validateForm();
        
        this.setState({ errors });

        if (!isValid) {
            return Vibration.vibrate();
        }

        const {
            email,
            password,
            isRegister
        } = this.state;

        this.setState({ loading: true });

        if (isRegister) {
            return this.props.registerUser({ email, password }, () => {
                this.setState({ loading: false, ...this.toggleActivateUserModal(true, false) });
            }, () => {
                this.setState({ loading: false });
            });
        }

        this.props.loginUser({ email, password }, () => {
            this.setState({ loading: false })
        }, () => {
            this.setState({ loading: false });
        });
    }


    resetForm = () => {
        this.setState({ ...JSON.parse(JSON.stringify(INITIAL_STATE)) });
    }

    validateForm = (emailOnly = false) => {
        const {
            email,
            password,
            confirmPassword,
            isRegister,
        } = this.state;

        let isValid = true;
        let errors = JSON.parse(JSON.stringify(INITIAL_STATE.errors));

        const emailError = validateEmail(email);
        if (emailError) {
            errors.email = emailError;
            isValid = false;
        }

        if (emailOnly) {
            return { isValid, errors }
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            errors.password = passwordError;
            isValid = false;
        }

        if (isRegister) {
            const confirmPasswordError = comparePasswords(password, confirmPassword);
            if (confirmPasswordError) {
                errors.confirmPassword = confirmPasswordError;
                isValid = false;
            }
        }

        return { isValid, errors }

    }

    onInputChange = (stateName, value) => {
        this.setState({ [stateName]: value });
    }

    toggleActivateUserModal = (nextState, setState = true) => {
        if (setState){
            this.setState({ showActivateUserModal: nextState });
        }
        else {
            return { showActivateUserModal: nextState };
        }
        
    }

    onActivateUserSuccess = () => {
        this.setState({ isRegister: false, ...this.toggleActivateUserModal(false, false) }, () => {
            this.onFormSubmit();
        });
    }


    toggleResetPasswordModal = (nextState, setState = true) => {
        if (setState) {
            this.setState({ showForgotPasswordModal: nextState });
        }
        else {
            return { showForgotPasswordModal: nextState };
        }

    }


    onResetPasswordDone = (newPassword) => {
        this.setState({ password: newPassword, isRegister: false, ...this.toggleResetPasswordModal(false, false) }, () => {
            this.onFormSubmit();
        });
    }

    onForgotPasswordPress = () => {
        const { isValid, errors } = this.validateForm(true);
        this.setState({ errors });

        if (!isValid) {
            return Vibration.vibrate();
        }

        this.setState({ loading: true });
        this.props.requestResetPassword({ email: this.state.email }, () => {
            this.setState({ loading: false, ...this.toggleResetPasswordModal(true, false) });
        });

    }

    renderLoading = () => {
        if (this.state.loading) {
            return (
                <ActivityIndicator size='large' />
            );
        }
    }

    renderMessage() {
        const { error, message } = this.props;

        const {
            messageStyle,
            errorStyle,
            successStyle,
        } = styles;

        if (error) {
            return (
                <Text style={[messageStyle, errorStyle]}>
                    {error}
                </Text>
            );
        }
        else if (message) {
            return (
                <Text style={[messageStyle, successStyle]}>
                    {message}
                </Text>
            );
        }
    }

    renderConfirmPassword = () => {
        if (this.state.isRegister) {
            return (
                <Input
                    label='Confirm Password'
                    value={this.state.confirmPassword}
                    onChangeText={value => this.onInputChange('confirmPassword', value)}
                    placeholder='re-enter password'
                    secureTextEntry
                    error={this.state.errors.confirmPassword}
                />
            );
        }
    }

    renderForgotPassword() {
        return (
            <Button
                title='Forgot password'
                backgroundColor={COLORS.transparent_white}
                color={COLORS.grey_light}
                fontSize={22}
                onPress={this.onForgotPasswordPress}
                fontWeight='600'
            />
        );
    }

    renderContent() {
        const {
            error, message
        } = this.props;

        if (this.state.hide) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' />
                </View>
            );
        }

        return (
            <View style={[styles.containerStyle]}>
                {this.renderForgotPassword()}

                <Input
                    label='Email'
                    value={this.state.email}
                    onChangeText={value => this.onInputChange('email', value)}
                    placeholder='user@gmail.com'
                    error={this.state.errors.email}
                />
                <Input
                    label='Password'
                    value={this.state.password}
                    onChangeText={value => this.onInputChange('password', value)}
                    placeholder='password'
                    secureTextEntry
                    error={this.state.errors.password}
                />

                {this.renderConfirmPassword()}

                <Input
                    isSwitch
                    label='Create New Account'
                    value={this.state.isRegister}
                    onChangeText={() => this.onInputChange('isRegister', !this.state.isRegister)}
                />

                <View style={styles.messageContainerStyle}>
                    {this.renderLoading()}
                    {this.renderMessage()}
                </View>

                <Button
                    title='Submit'
                    backgroundColor={COLORS.aqua_dark}
                    buttonStyle={styles.buttonStyle}
                    textStyle={styles.buttonTextStyle}
                    onPress={this.onFormSubmit}
                />

                <View style={styles.oauthWrapper}>
                    <Button
                        title='Login With Google'
                        onPress={this.onGoogleOauthPress}
                        icon={{ type: 'font-awesome', name: 'google', size: 25, color: COLORS.white }}
                        buttonStyle={styles.oauthButtonStyle}
                        textStyle={styles.oauthGoogleTextStyle}
                    />
                </View>
                

                <Activate
                    showModal={this.state.showActivateUserModal}
                    toggleModal={this.toggleActivateUserModal}
                    email={this.state.email}
                    onActivateUserSuccess={this.onActivateUserSuccess}
                    error={error}
                    message={message}

                />

                <ResetPassword
                    showModal={this.state.showForgotPasswordModal}
                    email={this.state.email}
                    onResetPasswordDone={this.onResetPasswordDone}
                    toggleModal={this.toggleResetPasswordModal}
                />
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.scrollViewStyle}>
                {this.renderContent()}
            </ScrollView>
        );
    }
}

const styles = {
    scrollViewStyle: {
        flex: 1,
        backgroundColor: COLORS.black_light
    },  
    loadingContainer: {
        minHeight: SCREEN_HEIGHT * 0.7,
        justifyContent: 'center',
    },
    containerStyle: {
        flex: 1,
        backgroundColor: COLORS.black_light,
        paddingTop: 70,
        paddingBottom: 100,
        paddingRight: 10,
        paddingLeft: 10,
    },
    buttonStyle: {
        marginTop: 20,
    },
    buttonTextStyle: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600'
    },
    messageContainerStyle: {
        marginTop: 30,
        marginBottom: 15,
        paddingRight: 10,
        paddingLeft: 10,
    },
    messageStyle: {
        fontSize: 22,
        lineHeight: 25,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorStyle: {
        color: COLORS.red_light,
    },
    successStyle: {
        color: COLORS.green_light,
    },
    modalContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    oauthWrapper: {
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: COLORS.grey,
        paddingTop: 10,
    },
    oauthButtonStyle: {
        backgroundColor: COLORS.red_google
    },
    oauthGoogleTextStyle: {
        fontSize: 18,
        lineHeight: 24,
        color: COLORS.white,
    }
}


const mapStateToProps = ({ auth }) => {
    const { error, message, authenticated } = auth.login;
    
    return { error, message, authenticated };
}

export default connect(mapStateToProps, actions)(LoginScreen);