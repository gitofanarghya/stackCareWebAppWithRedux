import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Loading } from './Loading'
import { Grid, Divider, Paper } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';




const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto',
    height: '255px'
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
    device: null
  };

  componentDidMount() {
      this.props.getAllHubs(this.props.selectedUnitId)
  }

  componentDidUpdate(prevProps) {
      if(this.props.unit !== prevProps.unit) {
        this.props.getAllHubs(this.props.selectedUnitId)
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
    const { value } = this.state
    return (
        this.props.loadedCurrentZone ? <Loading /> : 
        <Paper>
            <Grid container item xs={12} justify="space-around" style={{height: '30px', backgroundColor: '#525963'}}>
                <Grid item style={{margin: 'auto'}}>
                    <Typography variant="headline" color='primary'>{this.props.unit.name}</Typography>
                </Grid>
            </Grid>
            {this.props.zones.map(z => {
                return (
                    <div key={z.id} className={classes.zone}>
                        <Grid container className={classes.zoneHeading} direction="row" justify="flex-start">
                            <Typography variant="title">{z.name}</Typography>
                            <Button size="small" disabled={this.props.unitIdForDeviceOps === null || this.props.requestingHubs} onClick={() => this.props.startAddingDevices(z.site_id)} color='secondary' variant="contained" style={{height: 'fit-content', margin: 'auto', marginRight: '3px'}}>{this.state.addingDevice ? 'Adding... click to stop adding' : 'Add Device'}</Button>
                        </Grid>
                        {this.props.bulbs.filter(b => b.zone_id === z.id).length === 0 &&
                        this.props.sensors.filter(s => s.zone_id === z.id).length === 0 && 
                        this.props.switches.filter(sw => sw.zone_id === z.id).length === 0 ? 
                            <Typography variant="body2">No devices</Typography> : 
                            <Grid container className="flex" alignItems="stretch" direction="row" justify="flex-start">
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
                    <Button onClick={this.handleClose} color="secondary">
                    Close
                    </Button>
                    <Button disabled={this.props.unitIdForDeviceOps === null || this.props.requestingHubs} onClick={() => this.props.deleteDevice(this.state.device.site_id, this.state.device.device_type, this.state.device.id)} color="secondary">
                    Remove
                    </Button>
                    <Button disabled={this.props.unitIdForDeviceOps === null || this.props.requestingHubs} onClick={() => this.props.identifyDevice(this.state.device.site_id, this.state.device.device_type, this.state.device.id)} color="secondary">
                    Identify
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
            : <div></div>}
        </Paper>
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