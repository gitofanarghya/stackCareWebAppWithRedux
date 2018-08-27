import React from 'react'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography';
import SiteList from '../_components/SiteList'
import { Loading, SearchBar, NavBar } from '../_components';
import { unitActions, communityActions } from '../_actions'
import { connect } from 'react-redux'

class CommunityPage extends React.Component {

    handleClick(id) {
        console.log(id)
        this.props.getUnitDetails(id)
    }
    
    render () {
        return (
            !this.props.loaded ? <Loading /> :
            <NavBar>
                <Grid container className="flex" justify="center" alignItems="stretch">
                    <Grid item xs={10} className="flex">
                        <Grid container className="flex" alignItems="stretch" direction="column" justify="space-around">
                            <Grid item className={classNames("flex", "topGridContainer", "padded2x")}>
                                <Grid container className="flex" alignItems="stretch" direction="row" justify="center">
                                    <Grid item sm={6} className={classNames("flex", "searchBarContainer")}>
                                        <SearchBar allCommunities={this.props.allCommunities} getAllUnits={this.props.getAllUnits} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item className={classNames("flex", "bottomGridContainer", "padded")}>
                                <Grid container className="flex" alignItems="stretch" direction="row" justify="space-around">
                                    <Grid item sm={6} className={classNames("flex", "padded")}>
                                        <SiteList units={this.props.allUnits[this.props.selectedCommunity.id]} community={this.props.selectedCommunity} handleClick={this.handleClick} />
                                    </Grid>
                                    <Grid item sm={6} className={classNames("flex", "padded")}>
                                        {
                                            //this.state.unit ? <DeviceList unit={} /> : <Placeholder />
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
    const { loaded, allUnits} = state.units
    const { selectedCommunity, allCommunities } = state.communities
    return {
        loaded,
        selectedCommunity,
        allUnits,
        allCommunities
    }
}

const mapDispatchToProps = (dispatch) => ({
    getUnitDetails: (id) => {
        dispatch(unitActions.setUnit(id))
        //dispatch(unitActions.getUnitDetails(id))
    },
    getAllUnits: (id) => {
        dispatch(communityActions.setCommunity(id))
        dispatch(unitActions.getAllUnits(id))
    },
})

const Placeholder = () => (
        <div className="placeholder">
            Select a Unit
        </div>
)

const connectedCommunityPage = connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
export { connectedCommunityPage as CommunityPage };