import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import 'typeface-roboto';
import { Link } from 'react-router-dom';
import { Typography, AppBar, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const classes = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
  }));

class Regestrieren extends Component {

    state;

    constructor(props) {
      super(props);
        this.state = {username: "", password: ""}
    }

    handleChange = name => event => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
    };

    onClickRegestrieren = async () => {
        if(this.state.username.length <= 50){
            if(this.state.password.length <= 50){
                console.log(this.state.username);
                const http = axios.create({
                    baseURL: "http://172.20.20.75:5000"
                });
                const test = await http.post("/onClickRegestrieren", {
                        usernameReg : this.state.username,
                        passwordReg : this.state.password
                });
                if(test.data == "Gut"){
                console.log("test" + test);
                // localStorage.clear();
                this.props.history.push('/Login');
                console.log("JOO");
                console.log(test);
                JSON.stringify(test);
                // localStorage.clear();
                localStorage.setItem("token", test);
                }else{
                    alert(test.data);
                }
            }else{
                alert("Der Username darf maximal 50 Zeichen lang sein!")
            }
        }else{
            alert("Das Passwort darf maximal 50 Zeichen lang sein!")
        }
    }
    schonAccount= () => {
        this.props.history.push('/Login');
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.onClickRegestrieren();
        }
    }

    render(){
        return(
            <div >
                <Grid container  xs={12} xl={12} mx="auto" justify="center" style={{ color: "black", backgroundcolor: "white", marginTop: "5%" }} >
                    <Grid item xs={12} xl={6}>
                        <form noValidate autoComplete="off">
                            <Typography align="center" variant="bold" component="h2">
                            Regestrieren
                            </Typography>
                            <TextField   
                            style={{width: "100%"}}
                            id="standard-name"
                            label="Name"
                            type="text"
                            margin="normal"
                            text-align= "center"
                            variant="outlined"
                            value={this.state.username}
                            onChange={this.handleChange("username")}
                            onKeyDown={this.handleKeyDown}

                            />
                            <TextField
                            style={{width: "100%"}}
                            id="standard-password-input"
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
                            <Button style={{width: "100%"}} variant="contained" color="primary" onClick={this.onClickRegestrieren} >
                            Regestrieren
                            </Button>
                            <Button style={{ left: "20%", width: "60%"}} color="primary" className={classes.button}  onClick={this.schonAccount}>
                            Schon ein Account?
                            </Button>
                        </form>
                    </Grid>
                </Grid>
          </div>
        )
    }
}  
export default withStyles(classes)(Regestrieren);