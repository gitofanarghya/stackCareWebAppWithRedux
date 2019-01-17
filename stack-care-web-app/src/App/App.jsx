import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions, eventActions } from '../_actions';
import { PrivateRoute, Loading } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { CommunityPage } from '../CommunityPage';

class App extends React.Component {
    

    componentDidMount() {
        if(this.props.loggedIn) this.props.dispatch(eventActions.getAllEvents());
    }

    componentWillReceiveProps(prevProps) {
        if (this.props.loadedEvents !== prevProps.loadedEvents) {

            clearTimeout(this.timeout);
            if (!prevProps.requesting) {
                this.startPoll();
            }
        }
    }

    startPoll() {
        this.timeout = setTimeout(() => this.props.dispatch(eventActions.getAllEvents()), 300000);
    }
    
    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    render() {
        console.log()
        return ( 
            <Router history={history}>
                <div className="h100">
                <Switch>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <PrivateRoute exact path="/" component={HomePage} refreshed={this.props.refreshed} />
                    <PrivateRoute exact path="/:id" component={CommunityPage} refreshed={this.props.refreshed} />
                </Switch>
                </div>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    const { refreshed, loggedIn } = state.authentication;
    const { loadedEvents, requesting } = state.events
    return {
        refreshed,
        loadedEvents,
        requesting,
        loggedIn
    };
}


const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 