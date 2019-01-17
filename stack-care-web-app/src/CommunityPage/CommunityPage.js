import React from 'react'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography';
import SiteList from '../_components/SiteList'
import { Loading, SearchBar, NavBar, DeviceList, Notifications } from '../_components';
import { unitActions, deviceActions } from '../_actions'
import { connect } from 'react-redux'
import { groupBy } from '../_helpers';
import { Paper } from '@material-ui/core';
import Clock from 'react-live-clock';


class CommunityPage extends React.Component {

    constructor(props) {
        super(props)
        this.focus = React.createRef();
    }

    componentDidMount() {
        if(this.props.selectedCommunityId) {
            this.props.getAllUnits(this.props.selectedCommunityId)
        } else {
            this.props.setCommunity(this.props.match.params.id)
            this.props.getAllUnits(this.props.match.params.id)
        }
    }
    events = null
    componentDidUpdate(prevProps) {
        if(prevProps.selectedCommunityId !== undefined && this.props.selectedCommunityId !== prevProps.selectedCommunityId) this.props.getAllUnits(this.props.selectedCommunityId)
    }

    returnColor = (unitId, classes) => {
        if(this.props.allEvents) {
            if(this.props.allEvents[unitId]) {
            if(this.props.allEvents[unitId].pause_notification) {
                return classes.rowOrange
            } else {
                return classes.rowRed
            }
            } else {
            return classes.rowGreen
            }
        } else {
            return classes.rowGreen
        }
    } 

    returnAvgEvents = (unitId) => {
        if(this.props.events) {
            return this.props.events.filter(e => e.unit_id === unitId).length        
        }
    }

    getLatestEvent = (unitId) => {
        if(this.props.events) {
            return this.props.events.filter(e => e.unit_id === unitId)[0] ? this.props.events.filter(e => e.unit_id === unitId)[0] : 'no event'
        }
    }

    focusAndCallGetUnitDetails = (id) => {
        this.props.getUnitDetails(id)
        window.scrollTo({
            top: this.focus.current.offsetTop, 
            behavior: "smooth"
        })
    }

    render () {
        return (
            !this.props.loadedUnitDetails ? <Loading /> :
            <NavBar main={true}>
                <Grid container direction="column" justify="flex-start" style={{flexGrow: 1}}>
                    <Grid container item xs={12} justify="space-around" style={{height: '100px'}}>
                        <Grid item xs={11} sm={10} md={8} lg={6} style={{margin: 'auto'}}>
                            <SearchBar allCommunities={this.props.allCommunities} setCommunity={this.props.setCommunity} />
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} lg={1}>
                            <CommunityClock community={this.props.allCommunities.find(c => c.id === this.props.match.params.id)} /> 
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} direction='row' justify='space-evenly'>
                        <Grid item xs={11} sm={10} md={9} lg={5} style={{marginBottom: '29px'}}>
                            <SiteList getLatestEvent={this.getLatestEvent} avgEvents={this.returnAvgEvents} bulbs={this.props.bulbs} sensors={this.props.sensors} switches={this.props.switches}  returnColor={this.returnColor} units={this.props.allUnits[this.props.selectedCommunityId]} communityName={this.props.allCommunities.find(community => community.id === this.props.selectedCommunityId).name} getUnitDetails={this.focusAndCallGetUnitDetails} />
                        </Grid>
                        <Grid container alignContent='flex-start' justify='flex-start' item xs={11} sm={10} md={9} lg={5}>
                            <Grid className='notificationsGrid' item xs={12}>
                                <Paper>
                                    <Typography variant="headline" component="h3" style={{paddingLeft: '10px'}}>
                                        Notifications
                                    </Typography>
                                    <Notifications events={this.props.events.filter(e => e.community_id === this.props.selectedCommunityId)}/>
                                </Paper>
                            </Grid>
                            <Grid className='deviceList' item xs={12}>
                                <div ref={this.focus} style={{height: '100%'}}>
                                {
                                    this.props.selectedUnitId ? 
                                        <DeviceList 
                                        requestingHubs={this.props.requestingHubs}
                                        unitIdForDeviceOps={this.props.unitIdForDeviceOps}
                                        selectedUnitId={this.props.selectedUnitId}
                                        startAddingDevices={this.props.startAddingDevices}
                                        getAllHubs={this.props.getAllHubs}
                                        deleteDevice={this.props.deleteDevice} 
                                        identifyDevice={this.props.identifyDevice} 
                                        setCurrentZone={this.props.setCurrentZone} 
                                        loadedCurrentZone={this.props.loadedCurrentZone} 
                                        currentZone={this.props.currentZone} 
                                        zones={this.props.zones.filter(z => z.site_id === this.props.selectedUnitId)} 
                                        bulbs={this.props.bulbs.filter(b => b.site_id === this.props.selectedUnitId)} 
                                        switches={this.props.switches.filter(sw => sw.site_id === this.props.selectedUnitId)} 
                                        sensors={this.props.sensors.filter(s => s.site_id === this.props.selectedUnitId)} 
                                        unit={this.props.allUnits[this.props.selectedCommunityId].find(u => u.id === this.props.selectedUnitId)}
                                        /> :
                                        <Placeholder />
                                }
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>                            
            </NavBar>        
        )
    }
}

const CommunityClock = (props) => <p> Time at community: <Clock format={'HH:mm:ss'} ticking={true} timezone={props.community.time_zone} /> </p>

const mapStateToProps = (state) => {
    const { loaded, allUnits, selectedCommunityId, selectedUnitId, currentZone, loadedCurrentZone, loadedUnitDetails, zones, bulbs, sensors, switches } = state.units
    const { allCommunities } = state.communities
    const { allEvents } = state.events
    const {
            unitId,
            requestingHubs,
        } = state.device
    return {
        loaded,
        selectedCommunityId,
        allUnits,
        allCommunities,
        selectedUnitId,
        currentZone,
        loadedCurrentZone,
        loadedUnitDetails, zones, bulbs, sensors, switches,
        allEvents: eventsHandler(allEvents),
        events: allEvents,
        requestingHubs,
        unitIdForDeviceOps: unitId
    }
}

const eventsHandler = (allEvents) => {
    if(allEvents) {
        let eventsByUnitId = groupBy(allEvents, 'unit_id' )
        for (var key in eventsByUnitId) {
            if (eventsByUnitId.hasOwnProperty(key)) {
                eventsByUnitId[key] = groupBy(eventsByUnitId[key], 'event_type')
            }
        }
        return eventsByUnitId
    } else {
        return null
    }
    
}

const mapDispatchToProps = (dispatch) => ({
    getUnitDetails: (id) => {
        dispatch(unitActions.setUnit(id))
    },
    getAllUnits: (id) => {
        dispatch(unitActions.getAllUnits(id))
    },
    setCommunity: (id) => {
        dispatch(unitActions.setCommunity(id))
    },
    setCurrentZone: (id) => {
        dispatch(unitActions.setCurrentZone(id))
    },
    deleteDevice: (siteId, deviceType, deviceId) => {
        dispatch(deviceActions.deleteDevice(siteId, deviceType, deviceId))
    },
    identifyDevice: (siteId, deviceType, deviceId) => {
        dispatch(deviceActions.identifyDevice(siteId, deviceType, deviceId))
    },
    getAllHubs: (unitId) => {
        dispatch(deviceActions.getAllHubs(unitId))
    },
    startAddingDevices: (unitId) => {
        dispatch(deviceActions.startAddingDevices(unitId))
    }
})

const Placeholder = () => (
        <div className="placeholder">
            Select a Unit
        </div>
)

const connectedCommunityPage = connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
export { connectedCommunityPage as CommunityPage };