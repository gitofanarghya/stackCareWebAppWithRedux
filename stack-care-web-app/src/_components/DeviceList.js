import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Loading from './Loading'
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
});

class DeviceList extends React.Component {
  state = {
    value: 0,
    isLoading: true,
    zones: null,
    bulbs: null,
    sensors: null,
    switches: null,
    currentZone: null,
    unit: null,
    open: false,
    device: null
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  setZoneDetails(zoneId, bulbs, sensors, switches, rest) {
    this.setState({
        currentZone: {
            zoneId: zoneId,
            bulbs: bulbs.filter(bulb => bulb.zone_id === zoneId),
            sensors: sensors.filter(sensor => sensor.zone_id === zoneId),
            switches: switches.filter(swtch => swtch.zone_id === zoneId)
        },
        isLoading: false,
        ...rest
    }) 
  }

  setCurrentZoneDetails(zoneId) {
    this.setState({
        currentZone: {
            zoneId: zoneId,
            bulbs: this.state.bulbs.filter(bulb => bulb.zone_id === zoneId),
            sensors: this.state.sensors.filter(sensor => sensor.zone_id === zoneId),
            switches: this.state.switches.filter(swtch => swtch.zone_id === zoneId)
        }
    })
  }

  request = async (options, unit) => {
    const zoneres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${unit.unitId}/zones`, options)
    const zones = await zoneres.json()
    const bulbres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${unit.unitId}/bulbs`, options)
    const bulbs = await bulbres.json()
    const sensorres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${unit.unitId}/sensors`, options)
    const sensors = await sensorres.json()
    const switchres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${unit.unitId}/switches`, options)
    const switches = await switchres.json()
    const rest = {
        zones: zones,
        bulbs: bulbs,
        sensors: sensors,  
        switches: switches,
        unit: unit
    }
    this.setZoneDetails(zones[0].id, bulbs, sensors, switches, rest)
  }

  componentDidMount() {
    
    let { unit, accessToken } = this.props
    let options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${accessToken}`
        },
        body: null,
    }
    this.request(options, unit)
    
  }

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

  componentDidUpdate(prevProps) {
      
    let { unit, accessToken } = this.props
    if(this.state.isLoading) {      
        let options = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${accessToken}`
            },
            body: null,
        }
        this.request(options, this.state.unit)
        
    } else {
        if (unit.unitId !== prevProps.unit.unitId) {
            this.setState({
                isLoading: true,
                unit: unit
            })
        }
    }
  }
    
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
        this.state.isLoading ? <Loading /> : 
        <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="secondary"
                textColor="primary"
                scrollable
                scrollButtons="auto"
              >
                {this.state.zones.map(n => <Tab  key={n.id} onClick={() => this.setCurrentZoneDetails(n.id)} label={<Typography variant="subheading">{n.name}</Typography>} />)}
              </Tabs>
            </AppBar>
            <TabContainer>
                {
                    this.state.isLoading ? <Loading /> : <Zone currentZone={this.state.currentZone} setDevice={this.setDevice}/>
                }
            </TabContainer>
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
                    {this.state.unit.name ? this.state.unit.name : 'nothing' }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                    {this.state.device ? 
                    <center>
                    <div>
                        <Typography>Device ID: {this.state.device.id}</Typography>
                        <Typography>Mac ID: {this.state.device.mac_address}</Typography>
                        <Typography>Net Address: {this.state.device.network_address}</Typography>
                        <br />
                        <Typography>Manu: {this.state.device.manufacturer}</Typography>
                        <Typography>Model: {this.state.device.model}</Typography>
                        <Typography>HW ver: {this.state.device.hw_vs}</Typography>
                        <Typography>Firmware: {this.state.device.firmware_vs}</Typography>
                        <br />
                        <Typography>Created: {this.state.device.created_at}</Typography>
                        <Typography>Joined: {this.state.device.last_joined_at}</Typography>
                        <Typography>Contact: {this.state.device.last_contact_time}</Typography>
                    </div>
                    </center>
                        : 'nothing'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                    Close
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
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

export default withStyles(styles)(DeviceList);
