import axios from 'axios';
import { Google } from 'expo';
import * as AS from '../../services/AsyncStorage';
import { ROUTE_USER } from '../routes';
import {
    RESET_AUTH_FORM,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    ACTIVATE_SUCCESS,
    ACTIVATE_FAIL,
} from '../types';
import {
    GOOGLE_OAUTH
} from '../../../configs/app';


export const resetForm = () => {
    return { type: RESET_AUTH_FORM };
}

export const loginUser = ({ email, password }, cb, cbOnError) => async dispatch => {
    try {
        dispatch({ type: RESET_AUTH_FORM });
        let { data: { token } } = await axios.post(ROUTE_USER.LOGIN, { email, password });
        
        await AS.saveToken(token);
        dispatch({ type: LOGIN_SUCCESS, payload: email });
        
        return cb();
    }
    catch(err) {
        // console.error(`Error loginUser: ${err}`);

        authFail(dispatch, err, LOGIN_FAIL, cbOnError)
    }

}

export const registerUser = ({ email, password }, cb, cbOnError) => async dispatch => {
    try {
        dispatch({ type: RESET_AUTH_FORM });
        await axios.post(ROUTE_USER.REGISTER, { email, password, onMobile: true });
        dispatch({ type: REGISTER_SUCCESS });
        return cb();
    }
    catch(err) {
        // console.error(`Error registerUser: ${err}`);

        return authFail(dispatch, err, REGISTER_FAIL, cbOnError);
    }
}


export const activateUser = ({ key, email }, cb) => async dispatch => {
    try {
        await axios.post(ROUTE_USER.ACTIVATE, { key, email });
        dispatch({ type: ACTIVATE_SUCCESS });
        return cb();
    }
    catch(err) {
        // console.error(`Error activateUser: ${err}`);

        dispatch({ type: ACTIVATE_FAIL });
        return cb(err);
    }
}

export const loginWithOAuthGoogle = (cb) => async dispatch => {
    try {
        let { idToken } = await Google.logInAsync({
            androidClientId: GOOGLE_OAUTH.ANDROID_ID,
            iosClientId: GOOGLE_OAUTH.IOS_ID,
            scopes: ['email'],
        });

        let { data: { token, email } } = await axios.post(
            ROUTE_USER.LOGIN_WITH_OAUTH_GOOGLE,
            { idToken }
        )

        await AS.saveToken(token);
        dispatch({ type: LOGIN_SUCCESS, payload: email });

        return cb();
        
    }
    catch(err) {
        // console.error(`Error loginWithOAuthGoogle: ${err}`);

        return authFail(dispatch, err, LOGIN_FAIL, cb);
    }
}

const authFail = (dispatch, err, type, cbOnError) => {

    let message = null;

    if (err && err.response && err.response.data && err.response.data.error){
        message = err.response.data.error;
    }

    dispatch({ type, payload: message });

    if (cbOnError && typeof cbOnError === 'function' ) {
        return cbOnError();
    }
}