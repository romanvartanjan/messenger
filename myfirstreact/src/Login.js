import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Menu from './Menu';
import 'typeface-roboto';
import { Typography, AppBar, Toolbar, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';

const classes = makeStyles(theme => ({
    button: {
    //   margin: theme.spacing(1),
      align: "center",
    },
    input: {
      display: 'none',
    },
  }));


class Login extends Component {

    state;

    constructor(props) {
      super(props);
        this.state = {username: "", password: ""}
        // localStorage.clear();
    }

    handleChange = name => event => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
    };

    onClickAnmelden = async () => {
        if(this.state.username.length > 50 ||  this.state.password.length > 50){
            alert("Falsche Anmeldedaten");
        }else{
            console.log(this.state.username);
            const http = axios.create({
                baseURL: "http://172.20.20.75:5000"
            });
            const test = await http.post("/onClickAnmelden", {
                    username : this.state.username,
                    password : this.state.password
            })
            .then(response => { 
                // localStorage.clear();
                console.log(response.data);
                localStorage.setItem("token", response.data);
                console.log(localStorage.getItem("token"));
                this.props.history.push('/NachrichtSenden');
                console.log("JOO");
            })
            .catch(error => {
                alert(error.response.data);
            });
        }
    }

    jetztRegestrieren= () => {
        this.props.history.push('/Regestrieren');
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.onClickAnmelden();
        }
    }

    render(){
        return(
            <div>
                <Grid container justify="center" style={{ color: "black", backgroundcolor: "white", marginTop: "5%" }} >
                    <Grid item xs={10} xl={6}>
                        <form noValidate autoComplete="off">
                            <Typography align="center" variant="bold" component="h2">
                            Login
                            </Typography>
                            <TextField
                            style={{width: "100%"}}
                            id="usernameInput"
                            label="Name"
                            margin="normal"
                            text-align= "center"
                            variant="outlined"
                            value={this.state.username}
                            onChange={this.handleChange("username")}
                            onKeyDown={this.handleKeyDown}
                            />
                            <TextField
                            style={{width: "100%"}}
                            id="passwordInput"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            text-align= "center"
                            variant="outlined"
                            value={this.state.password}
                            onChange={this.handleChange("password")}
                            onKeyDown={this.handleKeyDown}
                            />
                            <Button id="loginSubmit" style={{width: "100%"}} variant="contained" color="primary" onClick={this.onClickAnmelden} >
                            Anmelden
                            </Button>
                            <Button style={{left: "20%", width: "60%"}} color="primary" className={classes.button}  onClick={this.jetztRegestrieren}>
                            Noch kein Account?
                            </Button>
                        </form>
                    </Grid>
                </Grid>
          </div>
        )
    }
}  
export default  withStyles(classes)(Login);