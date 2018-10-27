import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StatusIcon from './StatusIcon';
import Typography from '@material-ui/core/Typography'
import sort_by from '../_helpers/sorter'
import { unitCountByCommunity } from '../_helpers'

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

class Communities extends React.Component {
  
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  handleClick(id) {
    this.props.setCommunity(id)
  }

  render() {
    const {classes, allCommunities, eventsWithCommunity} = this.props;
    let id = 0
    const data = allCommunities.map(community => {
      const communityEvents = eventsWithCommunity.filter(e => e.community_id === community.id)
      const hubEventsCount = communityEvents.filter(e => e.event_type === 'hub_offline').length
      const hub = hubEventsCount === 0 ? 2 : hubEventsCount < unitCountByCommunity.find(c => c.communityId === community.id).unitCount*0.1 ? 1 : 0
      const deviceEventsCount = communityEvents.filter(e => e.event_type === 'device_offline').length
      const device = deviceEventsCount === 0 ? 2 : deviceEventsCount < unitCountByCommunity.find(c => c.communityId === community.id).unitCount*0.2 ? 1 : 0
      const batteryEventsCount = communityEvents.filter(e => e.event_type === 'battery_low').length
      const battery = batteryEventsCount === 0 ? 2 : batteryEventsCount < unitCountByCommunity.find(c => c.communityId === community.id).unitCount*0.5 ? 1 : 0
      return {
        id: id++,
        name: community.name,
        Hub: hub,
        Device: device,
        Battery: battery,
        commId: community.id
      }
    }).sort(sort_by('Hub', 'Device', 'Battery'));

    return (
      <Paper className={classes.root}>
          <Typography variant="headline" component="h3">
            Community Status
          </Typography>
          <Table className={classes.table}>
              <TableHead>
              <TableRow>
                  <TableCell padding="dense"></TableCell>
                  <TableCell padding="dense"><Typography variant="subheading" >Hub</Typography></TableCell>
                  <TableCell padding="dense"><Typography variant="subheading">Device</Typography></TableCell>
                  <TableCell padding="dense"><Typography variant="subheading">Battery</Typography></TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {data.map(n => {
                  return (
                  <TableRow 
                    hover
                    onClick={() => this.handleClick(n.commId)}
                    className={classes.row}
                    key={n.id}
                  >
                      <TableCell component="th" scope="row" padding="dense">
                          <Typography variant="body1">
                              {n.name}
                          </Typography>    
                      </TableCell>
                      <TableCell padding="dense"><StatusIcon status = {n.Hub} /></TableCell>
                      <TableCell padding="dense"><StatusIcon status = {n.Device} /></TableCell>
                      <TableCell padding="dense"><StatusIcon status = {n.Battery} /></TableCell>
                  </TableRow>
                  );
              })}
              </TableBody>
          </Table>  
      </Paper>
    );
  }
}

Communities.propTypes = {
  classes: PropTypes.object.isRequired,
};


export const CommunitiesStatus = withStyles(styles)(Communities)