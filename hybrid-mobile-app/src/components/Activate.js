import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Modal from './Modal';
import PinInput from './PinInput';
import ButtonClose from './ButtonClose';


class ActivateUser extends React.Component {
    state = { loading: true }

    componentDidMount() {
        this.setState({ loading: false });
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activated) {
            nextProps.onActivateUserSuccess();
        }
    }


    onCodeComplete = (code, cb) => {
        const { email } = this.props;

        this.setState({ loading: true });
        this.props.activateUser({ key: code, email }, (err) => {
            this.setState({ loading: false });
            return cb(err);
        });
    }


    render() {
        const {
            toggleModal,
            showModal,
            error,
            message
        } = this.props;

        return (
            <Modal
                visible={showModal}
            >
                <View>
                    <ButtonClose
                        onPress={() => toggleModal(false)}
                    />
                    <PinInput
                        keyProp='activate'
                        codeLength={6}
                        label='Enter 6 digit code'
                        onCodeComplete={this.onCodeComplete}
                        loading={this.state.loading}
                        error={error}
                        message={message}
                    />
                </View>
            </Modal>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    const { error, activated } = auth.login;
    return { error, activated };
}

export default connect(mapStateToProps, actions)(ActivateUser);