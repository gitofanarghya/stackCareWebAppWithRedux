import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error'

const styles = {
  avatar: {
    margin: 10,
  },
  orangeAvatar: {
    color: orange[500],
    margin: 10,
    //backgroundColor: orange[500],
  },
  redAvatar: {
    color: red[500],
    margin: 10,
    //backgroundColor: red[500],
  },
  greenAvatar: {
    color: green[500],
    margin: 10,
    //backgroundColor: green[500],
  },
};

function IconAvatars(props) {
  const { classes, status } = props;
  return (
    <div className={status === 2 ? classes.greenAvatar : status === 1 ? classes.orangeAvatar : classes.redAvatar }>
        {status === 2 ? <DoneIcon style={{ fontSize: 30 }}/> : status === 1 ? <WarningIcon style={{ fontSize: 30 }} /> : <ErrorIcon style={{ fontSize: 30 }} /> }
    </div>
  );
}

IconAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconAvatars);