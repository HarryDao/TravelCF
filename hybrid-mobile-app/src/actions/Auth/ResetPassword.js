import axios from 'axios';
import { ROUTE_USER } from '../routes';
import {
    VALIDATE_RESET_PASSWORD_SUCCESS,
    VALIDATE_RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_RESET_PASSWORD_FORM,
} from '../types';

export const resetResetPasswordForm = () => {
    return { type: RESET_RESET_PASSWORD_FORM }
}

export const requestResetPassword = ({ email }, cb) => async dispatch => {
    try {
        await axios.post(ROUTE_USER.REQUEST_RESET_PASSWORD, { email, onMobile: true });
        return cb();
    }
    catch(err) {
        // console.error(`Error Request Reset Password ${err}`);
    }
} 


export const validateResetPasswordLink = ({ key, email }, cb) => async dispatch =>  {
    try {
        await axios.post(ROUTE_USER.VALIDATE_RESET_PASSWORD_LINK, { key, email });

        dispatch({
            type: VALIDATE_RESET_PASSWORD_SUCCESS,
            payload: email
        });

        return cb();
    }
    catch(err) {
        // console.error(`Error validateResetPasswordLink: ${err}`);

        dispatch({ type: VALIDATE_RESET_PASSWORD_FAIL });
        return cb(err);
    }
}


export const resetPassword = ({ email, password, key }, cb) => async dispatch => {
    try {
        await axios.post(ROUTE_USER.RESET_PASSWORD, { email, password, key });
        dispatch({ type: RESET_PASSWORD_SUCCESS });
        return cb();
    }
    catch(err) {
        // console.error(`Error resetPassword: ${err}`);

        authFail(dispatch, err, RESET_PASSWORD_FAIL);
        return cb(err);
    }
}


const authFail = (dispatch, err, type) => {
    let message = null;
    if (err && err.response && err.response.data && err.response.data.error){
        message = err.response.data.error;
    }

    dispatch({  
        type,
        payload: message,
    });
}