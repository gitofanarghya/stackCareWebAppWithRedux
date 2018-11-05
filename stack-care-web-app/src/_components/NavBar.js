import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { Button } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import { history } from '../_helpers'

const styles = {
  root: {
    flexGrow: 1,
    height: '100%'
  },
};

const Nav = (props) => {
  const { classes, children } = props;
  return (
    <div className={classNames(classes.root, "container-column", "flex-item")}>
        <AppBar className={classes.AppBar} position="static" color="secondary">
            <Toolbar className="logo-bg">
            <Button variant="extendedFab" color="secondary" aria-label="Home" className={classes.home} onClick={() => history.push(`/`)}>
              <HomeIcon />  HOME
            </Button>
            </Toolbar>
            
        </AppBar>
        <main className={classNames("container-column", "flex-item")}>
            {children}
        </main>
    </div>
  );
}

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const NavBar = withStyles(styles)(Nav);