import { AsyncStorage } from 'react-native';
const TOKEN_KEY = 'token';
const SEARCH_KEY = 'search_item';


export const getToken = async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

export const saveToken = async (token) => {
    if (token) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    }
}

export const removeToken = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
}

export const createAuthHeader = async () => {
    let token = await getToken();

    return {
        headers: {
            authorization: token
        }
    }
}

export const saveSearch = async (state, props) => {
    await AsyncStorage.setItem(SEARCH_KEY, JSON.stringify({ state, props }));
}

export const getSearch = async () => {
    const savedSearch = await AsyncStorage.getItem(SEARCH_KEY);
    if (savedSearch) {
        try {
            return JSON.parse(savedSearch);
        }
        catch(err) {
            return null;
        }
    }

    return savedSearch;
}

export const removeSearch = async () => {
    await AsyncStorage.removeItem(SEARCH_KEY);
}