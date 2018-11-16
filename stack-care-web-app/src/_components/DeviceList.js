import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Loading } from './Loading'
import { Grid, Divider } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { authHeader } from '../_helpers';


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
    overflow: 'auto'
  },
  scroll: {
    maxWidth: 20
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 50,
  },
  zone: {
    textShadow: '1px 1px 5px #00000094',
    boxShadow: '0 0 1px black'
  },
  zoneHeading: {
      padding: '0px'
  }
});

class DeviceList extends React.Component {
  state = {
    value: 0,
    open: false,
    device: null,
    addingDevice: false,
    addintToZoneId: null,
    isInstaller: true,
    hubs: []
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

  getHubs = (unitId) => {

    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://dm-dot-care-api-staging.appspot.com/sites/${unitId}/hubs`, requestOptions)
        .then(this.handleResponse)
    
  }

  sendAddDevice = (unitId, hubId) => {
    const requestOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: JSON.stringify({
            "device_detect_on": true
          })
    }
    return fetch(`https://dm-dot-care-api-staging.appspot.com/sites/${unitId}/hubs/${hubId}`, requestOptions)
        .then(response => console.log(response.json()))
  }

  handleResponse = (response) => {
    return response.json().then(json => {
        const data = json
        if (!response.ok) {
            if (response.status === 403) {
                console.log("user unauthorised")
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);

        }
        this.setState({
            hubs: data
        })
        return data;
    });
}

  addDevice = (zoneId, siteId) => {
      this.setState({
          addingDevice: true
      })
      this.getHubs(siteId)
        .then(data => {
            this.state.hubs.map(h => this.sendAddDevice(siteId, h.id))
        }, error => {
            this.setState({
                isInstaller: false
            })
        })

    const addTimer = setTimeout(this.stopAddingDevice(zoneId), 240000)
    while(addTimer) {
        //refresh devices
    }
    //set state to adding, set zone to add else if already adding then stopAddingDevice
    //send request to all hubs in the site
    //setTimeout(stopAddingDevice(zoneId), 240000)
    //setInterval(getAllDevices(), 15000)
  }

  stopAddingDevice = (zoneId) => {
    //send permit join to zone
    //set state to not adding
  }
    
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    console.log(this.state.device)
    return (
        this.props.loadedCurrentZone ? <Loading /> : 
        <div className={classes.root}>
            <Grid container item xs={12} justify="space-around" style={{height: '60px', backgroundColor: '#525963'}}>
                <Grid item style={{margin: 'auto'}}>
                    <Typography variant="headline" color='primary'>{this.props.unit.name}</Typography>
                </Grid>
            </Grid>
            {this.props.zones.map(z => {
                return (
                    <div key={z.id} className={classes.zone}>
                        <Grid container className={classes.zoneHeading} direction="row" justify="flex-start">
                            <Typography variant="title" style={{padding: '10px'}}>{z.name}</Typography>
                            <Button disabled={!this.state.isInstaller} onClick={() => this.addDevice(z.id, z.site_id)} color='secondary' variant="contained" style={{height: 'fit-content', margin: 'auto', marginRight: '3px'}}>{this.state.addingDevice ? 'Adding... click to stop adding' : 'Add Device'}</Button>
                        </Grid>
                        {this.props.bulbs.filter(b => b.zone_id === z.id).length === 0 &&
                        this.props.sensors.filter(s => s.zone_id === z.id).length === 0 && 
                        this.props.switches.filter(sw => sw.zone_id === z.id).length === 0 ? 
                            <Typography variant="body2">No devices</Typography> : 
                            <Grid container className="flex" alignItems="stretch" direction="row" justify="flex-start" style={{padding: '10px'}}>
                                {this.props.bulbs.filter(b => b.zone_id === z.id).map( bulb => <Grid key={bulb.id} onClick={() => this.setDevice(bulb) }> <Bulbicon /> </Grid> )}
                                {this.props.sensors.filter(s => s.zone_id === z.id).map( sensor => <Grid key={sensor.id} onClick={() => this.setDevice(sensor) }> <Sensoricon /> </Grid> )}
                                {this.props.switches.filter(sw => sw.zone_id === z.id).map( swtch => <Grid key={swtch.id} onClick={() => this.setDevice(swtch) }> <Switchicon /> </Grid> )}
                                {this.state.addingDevice ? this.props.bulbs.filter(b => b.zone_id === null).map( bulb => <Grid key={bulb.id} onClick={() => this.setDevice(bulb) }> <Bulbicon /> </Grid> ) : ""}
                                {this.state.addingDevice ? this.props.sensors.filter(s => s.zone_id === null).map( sensor => <Grid key={sensor.id} onClick={() => this.setDevice(sensor) }> <Sensoricon /> </Grid> ) : ""}
                                {this.state.addingDevice ? this.props.switches.filter(sw => sw.zone_id === null).map( swtch => <Grid key={swtch.id} onClick={() => this.setDevice(swtch) }> <Switchicon /> </Grid> ) : ""}                       
                            </Grid>
                        }
                    </div> 
                    )
                })
            }
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
                    <Typography variant="subtitle2" color='secondary'>
                        <span><strong>Device type:</strong> {this.state.device.device_type}</span><br />
                        <span><strong>Device name:</strong> {this.state.device.name}</span><br />
                        <br />
                        <span><strong>Device ID:</strong> {this.state.device.id}</span><br />
                        <span><strong>Mac ID:</strong> {this.state.device.mac_address}</span><br />
                        <span><strong>Hub ID:</strong> {this.state.device.hub_id}</span><br />
                        <span><strong>Zone ID:</strong> {this.state.device.zone_id}</span><br />
                        <span><strong>Site ID:</strong> {this.state.device.site_id}</span><br />
                        <span><strong>Net Address:</strong> {this.state.device.network_address}</span><br />
                        <br />
                        <span><strong>Manu:</strong> {this.state.device.manufacturer}</span><br />
                        <span><strong>Model:</strong> {this.state.device.model}</span><br />
                        <span><strong>Serial No:</strong> {this.state.device.hw_vs}</span><br />
                        <span><strong>HW ver:</strong> {this.state.device.serial_number}</span><br />
                        <span><strong>Firmware:</strong> {this.state.device.firmware_vs}</span><br />
                        <br />
                        <span><strong>Created:</strong> {this.state.device.created_at}</span><br />
                        <span><strong>Joined:</strong> {this.state.device.last_joined_at}</span><br />
                        <span><strong>Contact:</strong> {this.state.device.last_contact_time}</span><br />
                        <span><strong>identify_time:</strong> {this.state.device.identify_time}</span><br />
                        <span><strong>is_connected_change_time:</strong> {this.state.device.is_connected_change_time}</span><br />
                        <br />
                        <span><strong>is_connected:</strong> {this.state.device.is_connected}</span><br />
                        <span><strong>is_on:</strong> {this.state.device.is_on}</span><br />
                        <span><strong>duration:</strong> {this.state.device.duration}</span><br />
                        <br />
                        <span><strong>brightness:</strong> {this.state.device.brightness}</span><br />
                        <span><strong>Color temperature:</strong> {this.state.device.color_temperature}</span><br />
                        <span><strong>endpoints:</strong> {this.state.device.endpoints}</span><br />
                    </Typography>
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

const Bulbicon = () => <div className="bulbIcon" />
const Sensoricon = () => <div className="sensorIcon" />
const Switchicon = () => <div className="switchIcon" />

DeviceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DeviceListWithStyles = withStyles(styles)(DeviceList);
export {DeviceListWithStyles as DeviceList}


/*<AppBar position="static" color="default">
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
            </TabContainer>*/














/*

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Loading } from './Loading'
import { Grid, Divider } from '@material-ui/core';
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
    overflow: 'auto'
  },
  scroll: {
    maxWidth: 20
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 50,
  },
  zone: {
    padding: '10px',
    textShadow: '1px 1px 5px #00000094',
    boxShadow: '0 0 1px black'
  },
  zoneHeading: {
      padding: '10px'
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
    console.log(this.props)
    return (
        this.props.loadedCurrentZone ? <Loading /> : 
        <div className={classes.root}>
        
            <Grid container item xs={12} justify="space-around" style={{height: '60px'}}>
                <Grid item style={{margin: 'auto'}}>
                    <Typography variant="headline">{this.props.unit.name}</Typography>
                </Grid>
            </Grid>
            {this.props.zones.map(z => {
                return (
                    <div key={z.id} className={classes.zone}>
                        <Grid container className={classes.zoneHeading} direction="row" justify="flex-start">
                            <Typography variant="title" padding={8}>{z.name}</Typography>
                        </Grid>
                        {this.props.bulbs.filter(b => b.zone_id === z.id).length === 0 &&
                        this.props.sensors.filter(s => s.zone_id === z.id).length === 0 && 
                        this.props.switches.filter(sw => sw.zone_id === z.id).length === 0 ? 
                            <Typography variant="body2">No devices</Typography> : 
                            <Grid container className="flex" alignItems="stretch" direction="row" justify="flex-start">
                                {this.props.bulbs.filter(b => b.zone_id === z.id).map( bulb => <Grid key={bulb.id} onClick={() => this.setDevice(bulb) }> <Bulbicon /> </Grid> )}
                                {this.props.sensors.filter(s => s.zone_id === z.id).map( sensor => <Grid key={sensor.id} onClick={() => this.setDevice(sensor) }> <Sensoricon /> </Grid> )}
                                {this.props.switches.filter(sw => sw.zone_id === z.id).map( swtch => <Grid key={swtch.id} onClick={() => this.setDevice(swtch) }> <Switchicon /> </Grid> )}                       
                            </Grid>
                        }
                    </div> 
                    )
                })
            }
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


/*<AppBar position="static" color="default">
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
            </TabContainer>*/