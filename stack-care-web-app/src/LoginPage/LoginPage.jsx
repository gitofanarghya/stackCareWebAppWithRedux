import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import { NavBar, Loading } from '../_components';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';

const styles = {
    card: {
        maxHeight: 450
      },
      media: {
        paddingTop: '213.64px',//'56.25%', // 16:9
        'background-size': 'contain'
      }
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }

    render() {
        const { loggingIn, classes } = this.props;
        return ( loggingIn ? <Loading /> :
            <div style={{height: '100%'}}><NavBar />
            <Grid container direction="row" justify="center" alignItems='center' style={{height: 'calc(100% - 64px)'}}>
              <Grid md={6} sm={false} xs={false} item style={{height: '450px'}}>
                <div className="loginpic">
                </div>
              </Grid>
              <Grid md={3} sm={6} xs={10} item>
              <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image="/img/logo.png"
                    title="stack care logo"
                />
                <CardContent>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            name="username"
                            label="Email Id"
                            placeholder="Enter your email id"
                            className="email-field"
                            margin="normal"
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <br />
                        <TextField
                            name="password"
                            label="Password"
                            className="password-field"
                            placeholder="Enter your password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <br />
                        <br />
                        <center><Button type="submit" className="submit-button">
                            Login
                        </Button><Link to="/register" className="btn btn-link">Register</Link></center>
                    </form>
                </CardContent>
            </Card>
              </Grid>
            </Grid>
            </div>       
        
        )
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(withStyles(styles)(LoginPage));
export { connectedLoginPage as LoginPage }; 