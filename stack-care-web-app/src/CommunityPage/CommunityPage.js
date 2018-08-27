import React from 'react'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography';
import SiteList from '../_components/SiteList'
import { Loading, SearchBar, NavBar } from '../_components';
import { unitActions } from '../_actions'
import { connect } from 'react-redux'

class CommunityPage extends React.Component {

    componentDidMount() {
        this.props.getAllUnits(this.props.selectedCommunityId)
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
                                        <SearchBar allCommunities={this.props.allCommunities} setCommunity={this.props.setCommunity} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item className={classNames("flex", "bottomGridContainer", "padded")}>
                                <Grid container className="flex" alignItems="stretch" direction="row" justify="space-around">
                                    <Grid item sm={6} className={classNames("flex", "padded")}>
                                        <SiteList units={this.props.allUnits[this.props.selectedCommunityId]} communityName={this.props.allCommunities.find(community => community.id === this.props.selectedCommunityId).name} getUnitDetails={this.props.getUnitDetails} />
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
    const { loaded, allUnits, selectedCommunityId} = state.units
    const { allCommunities } = state.communities
    return {
        loaded,
        selectedCommunityId,
        allUnits,
        allCommunities
    }
}

const mapDispatchToProps = (dispatch) => ({
    getUnitDetails: (id) => {
        dispatch(unitActions.setUnit(id))
        dispatch(unitActions.getUnitDetails(id))
    },
    getAllUnits: (id) => {
        dispatch(unitActions.getAllUnits(id))
    },
    setCommunity: (id) => {
        dispatch(unitActions.setCommunity(id))
    }
})

const Placeholder = () => (
        <div className="placeholder">
            Select a Unit
        </div>
)

const connectedCommunityPage = connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
export { connectedCommunityPage as CommunityPage };