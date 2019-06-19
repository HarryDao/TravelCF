import axios from 'axios';
import { createAuthHeader } from '../../services/AsyncStorage';
import { ROUTE_SEARCH } from '../routes';
import {
    FETCH_ORIGIN_SUCCESS,
    SET_ORIGIN,
    FETCH_DESTINATION_SUCCESS,
    SET_DESTINATION,
    FETCH_DEPART_DATE_SUCCESS,
    SET_DEPART_DATE,
    FETCH_RETURN_DATE_SUCCESS,
    SET_RETURN_DATE,
    TOGGLE_RETURN_DATE,

    RESTORED_SAVED_SEARCH_SUCCESS,
} from '../types';

export const fetchOrigin = (cb) => async dispatch =>  {
    try {
        let { data } = await axios.get(
            ROUTE_SEARCH.FETCH_ORIGIN,
            await createAuthHeader()
        );

        dispatch({ type: FETCH_ORIGIN_SUCCESS, payload: data });
        return cb();
    }
    catch(err) {
        // console.error(`Error fetchOrigin: ${err}`);

        return cb(err);
    }
}


export const setOrigin = ({ origin }) => {
    return {
        type: SET_ORIGIN,
        payload: origin,
    }
}

export const fetchDestination = ({ origin }, cb) => async dispatch => {
    try {
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_DESTINATION,
            { origin },
            await createAuthHeader()
        );

        dispatch({ type: FETCH_DESTINATION_SUCCESS, payload: data });
        return cb()
    }
    catch(err) {
        // console.error(`Error fetchDestination ${err}`);

        return cb(err);
    }
}


export const setDestination = ({ destination }) => {
    return {
        type: SET_DESTINATION,
        payload: destination
    }
}

export const fetchDepartDate = ({ origin, destination }, cb) => async dispatch => {
    try {
        let response = await axios.post(
            ROUTE_SEARCH.FETCH_DATE,
            { origin, destination },
            await createAuthHeader()
        );

        dispatch({ type: FETCH_DEPART_DATE_SUCCESS, payload: response.data });
        return cb();
    }
    catch(err) {
        // console.error(`Error fetchDepartDate: ${err}`);

        return cb(err);
    }
}


export const setDepartDate = ({ departDate }) => {
    return {
        type: SET_DEPART_DATE,
        payload: departDate,
    }
}

export const fetchReturnDate = ({ origin, destination, departDate }, cb) => async dispatch => {
    try {
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_DATE,
            {
                origin: destination,
                destination: origin,
                min: departDate
            },
            await createAuthHeader()
        );

        dispatch({ type: FETCH_RETURN_DATE_SUCCESS, payload: data });
        return cb();
    }
    catch(err) {
        // console.error(`Error fetchReturnDate: ${err}`);
        
        return cb(err);
    }
}


export const setReturnDate = ({ returnDate }) => {
    return {
        type: SET_RETURN_DATE,
        payload: returnDate,
    };
};

export const toggleReturnDate = (on) => {
    return {
        type: TOGGLE_RETURN_DATE,
        payload: on ? true : false,
    }
};

export const restoreSavedSearch = (props) => {
    props.hasReturnDate = props.returnDate ? true : false;

    return {
        type: RESTORED_SAVED_SEARCH_SUCCESS,
        payload: props
    }
}