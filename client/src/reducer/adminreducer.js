// adminloginReducer.js
import { ADMINLOGIN_SUCCESS, ADMINLOGIN_ERROR } from '../actions/userAction';

const initialState = {
  adminloginuser: null,
  adminemail: null,
  error: null,
  isAdminAuthenticated: false
};

const adminloginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMINLOGIN_SUCCESS:
      return {
        ...state,
        adminloginuser: action.payload,
        adminemail: action.adminemail,
        error: null,
        isAdminAuthenticated: true
      };
    case ADMINLOGIN_ERROR:
      return {
        ...state,
        adminloginuser: null,
        adminemail: null,
        error: action.payload,
        isAdminAuthenticated: false
      };
    default:
      return state;
  }
};

export default adminloginReducer;
