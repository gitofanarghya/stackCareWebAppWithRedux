import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Loading } from './Loading'
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  scroll: {
    maxWidth: 20
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 50,
  }
});

class DeviceList extends React.Component {
  state = {
    value: 0,
    open: false,
    device: null
  };

  componentDidUpdate(prevProps) {
      if(this.props.unit !== prevProps.unit) {
          this.setState({
              value: 0
          })
      }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  setDevice = (device) => {
      this.setState({
          open: true,
          device: device
      })
  }
    
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
        !this.props.loadedCurrentZone ? <Loading /> : 
        <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="secondary"
                textColor="primary"
                scrollable
                scrollButtons="auto"
                classes={{scrollButtons: classes.scroll}} 
              >
                {this.props.zones.map(n => <Tab classes={{ root: classes.tabRoot}} key={n.id} onClick={() => this.props.setCurrentZone(n.id)} label={<Typography variant="subheading">{n.name}</Typography>} />)}
              </Tabs>
            </AppBar>
            <TabContainer>
                {
                    !this.props.loadedCurrentZone ? <Loading /> : <Zone currentZone={this.props.currentZone} setDevice={this.setDevice}/>
                }
            </TabContainer>
            {this.state.open ?
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                <DialogTitle id="alert-dialog-slide-title">
                    {this.props.unit.name}
                </DialogTitle>
                <DialogContent>
                    <center>
                    <DialogContentText id="alert-dialog-slide-description">
                        <span>Device ID: {this.state.device.id}</span><br />
                        <span>Mac ID: {this.state.device.mac_address}</span><br />
                        <span>Net Address: {this.state.device.network_address}</span><br />
                        <br />
                        <span>Manu: {this.state.device.manufacturer}</span><br />
                        <span>Model: {this.state.device.model}</span><br />
                        <span>HW ver: {this.state.device.hw_vs}</span><br />
                        <span>Firmware: {this.state.device.firmware_vs}</span><br />
                        <br />
                        <span>Created: {this.state.device.created_at}</span><br />
                        <span>Joined: {this.state.device.last_joined_at}</span><br />
                        <span>Contact: {this.state.device.last_contact_time}</span><br />
                    </DialogContentText>
                    </center>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                    Close
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
            : <div></div>}
        </div>
    );
  }
}

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const Zone = (props) => (
    <Grid container className="flex" alignItems="stretch" direction="column" justify="center">
        <Grid item className="flex">
            <Grid container className="flex" alignItems="stretch" direction="column" justify="center">
                <Grid item className="flex">
                    <Typography variant="subheading">Bulbs</Typography>
                </Grid>
                <Grid item className="flex">
                    <Grid container className="flex" alignItems="stretch" direction="row" justify="flex-start">
                        {
                            props.currentZone.bulbs.map( bulb => <Grid key={bulb.id} onClick={() => props.setDevice(bulb) }> <Bulbicon /> </Grid> )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid item className="flex">
            <Grid container className="flex" alignItems="stretch" direction="column" justify="center">
                <Grid item className="flex">
                    <Typography variant="subheading">Sensors</Typography>
                </Grid>
                <Grid item className="flex">
                    <Grid container className="flex" alignItems="stretch" direction="row" justify="flex-start">
                        {
                            props.currentZone.sensors.map( sensor => <Grid key={sensor.id} onClick={() => props.setDevice(sensor) }> <Sensoricon /> </Grid> )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid item className="flex">
            <Grid container className="flex" alignItems="stretch" direction="column" justify="center">
                <Grid item className="flex">
                    <Typography variant="subheading">Switches</Typography>
                </Grid>
                <Grid item className="flex">
                    <Grid container className="flex" alignItems="stretch" direction="row" justify="flex-start">
                        {
                            props.currentZone.switches.map( swtch => <Grid key={swtch.id} onClick={() => props.setDevice(swtch) }> <Switchicon /> </Grid> )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
)

const Bulbicon = () => <div className="bulbIcon" />
const Sensoricon = () => <div className="sensorIcon" />
const Switchicon = () => <div className="switchIcon" />

DeviceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DeviceListWithStyles = withStyles(styles)(DeviceList);
export {DeviceListWithStyles as DeviceList}
