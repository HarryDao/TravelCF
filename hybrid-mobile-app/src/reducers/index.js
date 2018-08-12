import { combineReducers } from 'redux';
import LoginReducer from './Auth/LoginReducer';
import ResetPasswordReducer from './Auth/ResetPasswordReducer';
import SearchFormReducer from './Search/SearchFormReducer';
import SearchResultReducer from './Search/SearchResultReducer';
import SearchHistoryReducer from './Search/SearchHistoryReducer';


export default combineReducers({
    auth: combineReducers({
        login: LoginReducer,
        resetPassword: ResetPasswordReducer,
    }),
    search: combineReducers({
        searchForm: SearchFormReducer,
        searchResult: SearchResultReducer,
        searchHistory: SearchHistoryReducer,
    }),
});