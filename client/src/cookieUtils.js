// cookieUtils.js

import Cookies from 'js-cookie';

// Function to set the secure HTTP-only cookie when the user logs in
export const setLoggedInEmailInCookie = (email) => {
  // Set the cookie with the "HttpOnly" and "Secure" flags
  Cookies.set('loggedInEmail', email, { secure: false, sameSite: 'strict', httpOnly: false });
};



// Function to get the email ID from the cookie
export const getLoggedInEmailFromCookie = () => {
  return Cookies.get('loggedInEmail');
};


// Function to remove the secure HTTP-only cookie
export const removeLoggedInEmailFromCookie = () => {
  // Remove the cookie
  Cookies.remove('loggedInEmail');
};
