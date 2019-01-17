import React from 'react';
import { connect } from 'react-redux';
import { NavBar, SearchBar, Map, Notifications, CommunitiesStatus, Loading } from '../_components'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import { communityActions, unitActions, eventActions } from '../_actions';
import classNames from 'classnames';
import { Paper } from '@material-ui/core';
import firebase from 'firebase'
import {firebaseConfig} from '../_helpers/firebaseConfig';


class HomePage extends React.Component {

    componentDidMount() {
        this.props.getAllCommunities()
        this.props.getAllEvents()
    }

    componentWillUnmount() {
        this.app = null
    }

    render() {
        const { allCommunities, loaded, loadedEvents, allEvents } = this.props;
        return(
            !loaded ? <Loading /> :
            <NavBar main={true}>
                <Grid container justify="flex-start">
                    <Grid container item xs={12} justify="space-around" style={{height: '100px'}}>
                        <Grid item xs={11} sm={10} md={8} lg={6} style={{margin: 'auto'}}>
                            <SearchBar allCommunities={allCommunities} setCommunity={this.props.setCommunity} />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} direction='row' justify='space-around'>
                        <Grid item xs={11} sm={10} md={9} lg={5} style={{marginBottom: '29px'}}>
                            {loadedEvents ? <CommunitiesStatus events={allEvents} allCommunities={allCommunities} setCommunity={this.props.setCommunity} /> : <Loading />}
                        </Grid>
                        <Grid container alignContent='flex-start' justify='flex-start' item xs={11} sm={10} md={9} lg={5}>
                            <Grid className='notificationsGrid' item xs={12}>
                                <Paper>
                                    <Typography variant="headline" component="h3" style={{paddingLeft: '10px'}}>
                                        Notifications
                                    </Typography>
                                    {loadedEvents ? <Notifications events={allEvents}/> : <Loading />}
                                </Paper>
                            </Grid>
                            <Grid className='mapGrid' item xs={12}>
                                <Paper>
                                    <Map setCommunity={this.props.setCommunity}/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>    
            </NavBar>
        )
    }
}


function mapStateToProps(state) {
    const { loaded, allCommunities } = state.communities;
    const { loadedEvents, allEvents } = state.events;
    return {
        allCommunities,
        loaded,
        loadedEvents,
        allEvents
    };
}

const mapDispatchToProps = (dispatch) => ({
    setCommunity: (id) => {
        dispatch(unitActions.setCommunity(id))
    },
    getAllCommunities: () => {
        dispatch(communityActions.getAllCommunities())
    },
    getAllEvents: () => {
        dispatch(eventActions.getAllEvents())
    }
})

const connectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export { connectedHomePage as HomePage };