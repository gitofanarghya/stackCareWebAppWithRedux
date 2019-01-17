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
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto',
    height: '530px',
    marginBottom: '29px'
  },
  rowRed: {
    borderLeft: `red 20px solid`
  },
  rowGreen: {
    borderLeft: `green 20px solid`
  },
  rowOrange: {
    borderLeft: `orange 20px solid`
  },
  heading: {
    paddingLeft: '24px'
  }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function SiteList(props) {
  const { classes } = props;

  let id = 0
  const data = props.units.map(unit => ({
    id: id++,
    name: unit.name,
    /*sortParameter1: props.getHubOfflineEventCount(unit.id),
    sortParameter2: props.getDeviceOfflineEventCount(unit.id),
    sortParameter3: props.getBatteryLowEventCount(unit.id),*/
    unitId: unit.id,
    isNotificationsPaused: unit.is_notifications_paused,
    isOccupied: unit.is_occupied,
    last_motion_time: unit.last_motion_time,
    latest_event: props.getLatestEvent(unit.id),
   // responderDetails: props.getLatestEvent(unit.id) === 'no event' ? null : props.getResponderDetails(props.getLatestEvent(unit.id).responder_id)
  }))
  return (
    <Paper className='siteList'>
        <Typography variant="headline" component="h3" style={{paddingLeft: '10px'}}>
          {props.communityName} - Summary          
        </Typography>
        <Table className={classes.table}>
            <TableHead>
            <TableRow>
                <TableCell padding="none"></TableCell>
                <TableCell padding="none"><Typography variant="subheading">No. of devices</Typography></TableCell>
                <TableCell padding="none"><Typography variant="subheading">Last motion time</Typography></TableCell>
                <TableCell padding="none"><Typography variant="subheading">Latest event</Typography></TableCell>
                <TableCell padding="none"><Typography variant="subheading">Event created at</Typography></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {data.map(n => {
                return (
                <TableRow 
                  hover
                  onClick={() => props.getUnitDetails(n.unitId)}
                  className={props.returnColor(n.unitId, classes)} 
                  key={n.id}
                >
                    <TableCell component="th" scope="row" padding="none">
                        <Typography variant="body1">
                            {n.name}
                        </Typography>    
                    </TableCell>
                    <TableCell padding="none">{props.bulbs.filter(b => b.site_id === n.unitId).length + props.sensors.filter(s => s.site_id === n.unitId).length + props.switches.filter(sw => sw.site_id === n.unitId).length}</TableCell>
                    <TableCell padding="none">{n.last_motion_time/*props.avgEvents(n.unitId)*/}</TableCell>
                    <TableCell padding="none">{n.latest_event !== 'no event' ? n.latest_event.event_type : 'no event'}</TableCell>
                    <TableCell padding="none">{n.latest_event !== 'no event' ? n.latest_event.time_created : ''}</TableCell>
                </TableRow>
                );
            })}
            </TableBody>
        </Table>  
    </Paper>
  );
}

SiteList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SiteList);