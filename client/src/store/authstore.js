import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducer/authreducer'; // Make sure the path to your userReducer is correct
import loginReducer from '../reducer/authreducer'; // Make sure the path to your userReducer is correct
import profileReducer from '../reducer/authreducer'; // Make sure the path to your userReducer is correct
import adminloginReducer from '../reducer/authreducer'; // Make sure the path to your userReducer is correct



const rootReducer = {
  user: userReducer,
  loginUser: loginReducer,
  profileimage: profileReducer,
  adminloginuser:adminloginReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
