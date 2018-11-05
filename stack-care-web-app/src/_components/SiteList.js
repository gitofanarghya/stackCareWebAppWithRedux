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
    overflowX: 'auto',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: 'unset !important'
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
    avgEventCount: getRandomInt(3),
    unitId: unit.id,
    isNotificationsPaused: unit.is_notifications_paused,
    isOccupied: unit.is_occupied
  }))
  return (
    <Paper className={classes.root}>
        <Typography className={classes.heading} variant="headline" component="h3">
          <p>{props.communityName} - Summary</p>
        </Typography>
        <Table className={classes.table}>
            <TableHead>
            <TableRow>
                <TableCell padding="dense"></TableCell>
                <TableCell padding="dense"><Typography variant="subheading">No. of devices</Typography></TableCell>
                <TableCell padding="dense"><Typography variant="subheading">Avg. events</Typography></TableCell>
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
                    <TableCell component="th" scope="row" padding="dense">
                        <Typography variant="body1">
                            {n.name}
                        </Typography>    
                    </TableCell>
                    <TableCell padding="dense">{props.bulbs.filter(b => b.site_id === n.unitId).length + props.sensors.filter(s => s.site_id === n.unitId).length + props.switches.filter(sw => sw.site_id === n.unitId).length}</TableCell>
                    <TableCell padding="dense">{props.avgEvents(n.unitId)}</TableCell>
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