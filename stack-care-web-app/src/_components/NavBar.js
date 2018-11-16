import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { Button, Grid } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import { history } from '../_helpers'

const styles = {
  root: {
    flexGrow: 1
  },
  home: {
    margin: 'auto'
  }
};

const Nav = (props) => {
  const { classes, children } = props;
  return (
  
    <div className={classNames(classes.root, "container-column", "flex-item")}>
        <AppBar className={classes.AppBar} position="static" color="secondary">
            <Toolbar>
            <Grid container justify="space-between" alignItems='center' style={{height: '64px'}}>
              <Grid item xs={false} sm={false} md={5} className="logo-bg"></Grid>
              <Grid item xs>
                <Typography variant="display1" color="primary">
                    Operations Center
                </Typography>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Button variant="contained" color="secondary" aria-label="Home" className={classes.home} onClick={() => history.push(`/`)}>
                  <HomeIcon />  HOME
                </Button>            
              </Grid>
            </Grid>

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