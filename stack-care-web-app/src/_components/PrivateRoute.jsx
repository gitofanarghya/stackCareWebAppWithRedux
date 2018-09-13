import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Loading } from './Loading'

export const PrivateRoute = ({ component: Component, ...rest, refreshed: refreshed }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user') ? refreshed ? <Component {...props} /> : <Loading />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} /> 
)