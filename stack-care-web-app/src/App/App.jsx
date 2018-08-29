import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute, Loading } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { CommunityPage } from '../CommunityPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        return ( 
            <Router history={history}>
                <div className="h100">
                <Switch>
                    <PrivateRoute exact path="/" component={HomePage} refreshed={this.props.refreshed} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <PrivateRoute exact path="/:id" component={CommunityPage} refreshed={this.props.refreshed} />
                </Switch>
                </div>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    const { refreshed } = state.authentication;
    return {
        refreshed
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 