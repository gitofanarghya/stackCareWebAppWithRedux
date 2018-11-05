import React from 'react'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography';
import SiteList from '../_components/SiteList'
import { Loading, SearchBar, NavBar, DeviceList } from '../_components';
import { unitActions } from '../_actions'
import { connect } from 'react-redux'
import { groupBy } from '../_helpers';

class CommunityPage extends React.Component {

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

    render () {
        return (
            !this.props.loadedUnitDetails ? <Loading /> :
            <NavBar>
                <Grid container className="flex" justify="center" alignItems="stretch">
                    <Grid item xs={10} className="flex">
                        <Grid container className="flex" alignItems="stretch" direction="column" justify="space-around">
                            <Grid item className={classNames("flex", "topGridContainer", "padded2x")}>
                                <Grid container className="flex" alignItems="stretch" direction="row" justify="center">
                                    <Grid item sm={6} className={classNames("flex", "searchBarContainer")}>
                                        <SearchBar allCommunities={this.props.allCommunities} setCommunity={this.props.setCommunity} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item className={classNames("flex", "bottomGridContainer", "padded")}>
                                <Grid container className="flex" alignItems="stretch" direction="row" justify="space-around">
                                    <Grid item sm={6} className={classNames("flex", "padded")}>
                                        <SiteList avgEvents={this.returnAvgEvents} bulbs={this.props.bulbs} sensors={this.props.sensors} switches={this.props.switches}  returnColor={this.returnColor} units={this.props.allUnits[this.props.selectedCommunityId]} communityName={this.props.allCommunities.find(community => community.id === this.props.selectedCommunityId).name} getUnitDetails={this.props.getUnitDetails} />
                                    </Grid>
                                    <Grid item sm={6} className={classNames("flex", "padded")}>
                                        {
                                            !this.props.selectedUnitId ? <Placeholder /> : <DeviceList setCurrentZone={this.props.setCurrentZone} loadedCurrentZone={this.props.loadedCurrentZone} currentZone={this.props.currentZone} zones={this.props.zones.filter(z => z.site_id === this.props.selectedUnitId)} unit={this.props.allUnits[this.props.selectedCommunityId].find(u => u.id === this.props.selectedUnitId)}/>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>                            
            </NavBar>        
        )
    }
}

const mapStateToProps = (state) => {
    const { loaded, allUnits, selectedCommunityId, selectedUnitId, currentZone, loadedCurrentZone, loadedUnitDetails, zones, bulbs, sensors, switches } = state.units
    const { allCommunities } = state.communities
    const { allEvents } = state.events
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
        events: allEvents
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
    }
})

const Placeholder = () => (
        <div className="placeholder">
            Select a Unit
        </div>
)

const connectedCommunityPage = connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
export { connectedCommunityPage as CommunityPage };