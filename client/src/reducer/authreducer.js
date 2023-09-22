// redux/reducers.js

import { combineReducers } from 'redux';
import { REGISTER_SUCCESS, REGISTER_ERROR, LOGIN_SUCCESS, LOGIN_ERROR, PROFILE_SUCCESS, PROFILE_ERROR, } from '../actions/userAction';

// Initial state for the user
const initialState = {
    user: null,
    loginUser: null,
    error: null,
    message: "",
    isAuthenticated: localStorage.getItem('jwtLoginToken'),
    isAdminAuthenticated: localStorage.getItem('jwtAdminToken'),
};



// Reducer function for handling user registration
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_SUCCESS:
            return { ...state, user: action.payload, message: action.message, error: null };
        case REGISTER_ERROR:
            return { ...state, user: null, message: action.message, error: action.payload };
        default:
            return state;
    }
};


const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                loginUser: action.payload.loginUser, // Update loginUser with the data from action.payload
                error: null,
                message: action.message,
                isAuthenticated: true// Reset error on successful login
            };
        case LOGIN_ERROR:
            return {
                ...state,
                message: action.message,
                loginUser: null, // Set loginUser to null on login error
                error: action.payload, 
                isAuthenticated: false // Set the error message
            };
        default:
            return state;
    }
};




const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_SUCCESS:
            return {
                ...state,
                profileimage: action.payload.profileimage, // Update loginUser with the data from action.payload
                error: null, // Reset error on successful login
            };
        case PROFILE_ERROR:
            return {
                ...state,
                profileimage: null, // Set loginUser to null on login error
                error: action.payload, // Set the error message
            };
        default:
            return state;
    }
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
    user: userReducer,
    loginUser: loginReducer,
    profileimage: profileReducer,

});

export default rootReducer;

