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
    const {classes, allCommunities} = this.props;
    let id = 0
    const data = allCommunities.map(community => ({
      id: id++,
      name: community.name,
      Hub: this.getRandomInt(3),
      Device: this.getRandomInt(3),
      Battery: this.getRandomInt(3),
      commId: community.id
    })).sort(sort_by('Hub', 'Device', 'Battery'));

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