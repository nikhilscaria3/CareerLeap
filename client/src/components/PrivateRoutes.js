/* eslint-disable import/no-anonymous-default-export */
// client/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ component: Component, ...rest }) {
    const jwtToken = localStorage.getItem('jwtLoginToken');
    const isAuthenticated = jwtToken && Date.now() < JSON.parse(jwtToken).expiration;

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
}

export function PrivateAdminRoute({ component: Component, ...rest }) {
    const jwtToken = localStorage.getItem('jwtAdminToken');
    const isAuthenticated = jwtToken && Date.now() < JSON.parse(jwtToken).expiration;

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/adminlogin" />;
}
