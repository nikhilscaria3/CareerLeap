import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../reducer/authreducer'; // Make sure the path to your userReducer is correct
import loginReducer from '../reducer/authreducer'; // Make sure the path to your loginReducer is correct
import profileReducer from '../reducer/authreducer'; // Make sure the path to your profileReducer is correct
import adminloginReducer from '../reducer/adminreducer'; // Import the adminloginReducer
// Import other reducers if you have more

const rootReducer = combineReducers({
  user: userReducer,
  loginUser: loginReducer,
  profileimage: profileReducer,
  adminloginuser: adminloginReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
