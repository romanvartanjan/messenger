import React, { Component, useState } from 'react';
import Menu from './Menu';
import history from './history';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';
import { FormControl } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ClapSpinner } from "react-spinners-kit";
import Einstellungen, { newEventEmitter } from './Einstellungen';

class NachrichtSenden extends Component {

    // Globale Variablen
    state;
    options = [];
    token = localStorage.getItem("token");

    constructor(props) {
        super(props);
        this.state = {
            receiver: "",
            subject: "",
            message: "",
            spinnerVisibility: "none",
        };
        newEventEmitter.on("showSpinner", () => {
            this.emitterShowSpinner();
        });
        newEventEmitter.on("hideSpinner", () => {
            this.emitterHideSpinner();
        });
        this.checkAngemeldet();
        this.getSelectedUser();
    }

    emitterShowSpinner(){
        this.state.spinnerVisibility = "inherit";
        this.forceUpdate();
    }
    emitterHideSpinner(){
        this.state.spinnerVisibility = "none";
        this.forceUpdate();
    }

    checkAngemeldet(){
        console.log("Token bei NachrichtSenden: " + this.token)
        if(this.token == null || this.token == ""){
            this.props.history.push('/Login');
            alert("Bitte Melde dich zuerst an");
        }
    }

    handleChangeReceiver = receiver => event => {
        this.setState({
            ...this.state,
            [receiver]: event.target.value,
        });
    };

    handleChangeSubject = subject => event => {
        this.setState({
            ...this.state,
            [subject]: event.target.value,
        });
    };

    handleChangeMessage = message => event => {
        this.setState({
            ...this.state,
            [message]: event.target.value,
        });
    };

    getSelectedUser = async () => {
        // User aus der Datenbank abfragen
        const http = axios.create({
            baseURL: "http://127.0.0.1:5000"
        });
        const test = await http.get("/getSelectedUser", {
        });
        // Select mit Usern füllen 
        console.log(test.data);
        this.options = test.data;   
        this.forceUpdate();
    }

    onClickAbsenden = async () => {
        if(this.state.subject.length > 200){
            alert("Der Betreff darf höchstens 200 Zeichen lang sein!")
        }else{
            if(this.state.receiver != "" && this.state.subject != "" && this.state.message != ""){
                const http = axios.create({
                    baseURL: "http://172.20.20.75:5000"
                });
                console.log(this.state.receiver  + "AAHHHHHHHHHHHHHHH");
                const test = await http.post("/saveMassage", {
                    receiver: this.state.receiver,
                    subject: this.state.subject,
                    message: this.state.message,
                    token: this.token,
                })
                .then(response => { 
                    window.location.href = "http://172.20.20.75:3000/#/GesendeteNachrichten";
                })
                .catch(error => {
                    console.log(error.response);
                    alert(error.response.data);
                });
            }else if(this.state.receiver == "" && this.state.subject != "" && this.state.message != ""){
                alert("Bitte wähle einen Empfänger aus");
            }else if(this.state.receiver != "" && this.state.subject == "" && this.state.message != ""){
                alert("Bitte füge einen Betreff hinzu");
            }else if(this.state.receiver != "" && this.state.subject != "" && this.state.message == ""){
                alert("Bitte schreibe eine Nachrichten");
            }else if(this.state.receiver == "" && this.state.subject == "" && this.state.message == ""){
                alert("Bitte fülle die Felder aus!");
            }
        }
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.onClickAbsenden();
        }   
    }

    render = () => {
        
        return(    
            <div>
                <div>
                    <div style={{ position: "fixed", zIndex: "9999",  backgroundColor: "gray", opacity: "0.8", width: "100%", height: "100%", display: this.state.spinnerVisibility}}>
                        <div style={{ position: "absolute", left: "50%", top: "30%" }}>
                            <ClapSpinner
                            size={50}
                            loading={true}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Grid container  mx="auto" justify="center" style={{ color: "black", backgroundcolor: "white"}} >
                        <Grid item xs={10} xl={6}>
                        <h1 style={{textAlign: "center"}}>
                            Nachricht senden
                        </h1> 
                            <FormControl style={{width: "100%"}}>
                            <InputLabel >Empfänger</InputLabel>
                                <Select
                                    native
                                    style={{width: "100%"}}
                                    id="demoSimpleSelect"
                                    // ref={this.selectBar} 
                                    value={this.state.receiver}
                                    onChange={this.handleChangeReceiver('receiver')}
                                    inputProps={{
                                    receiver: 'receiver',
                                    id: 'age-native-simple',
                                    }}
                                >
                                    <option ></option>
                                {
                                    this.options.map((value) => {
                                        console.log(value);
                                        return <option value={value.value}>{value.label}</option>
                                    })
                                }
                                </Select>
                            </FormControl>
                            <TextField
                                style={{width: "100%"}}
                                id="standard-with-placeholder"
                                label="Betreff"
                                margin="normal"
                                value={this.state.subject}
                                onChange={this.handleChangeSubject('subject')}
                                onKeyDown={this.handleKeyDown}
                            />
                            <TextField
                                style={{width: "100%"}}
                                id="standard-multiline-flexible"
                                label="Ihre Nachricht"
                                multiline
                                rowsMax="20"
                                value={this.state.message}
                                onChange={this.handleChangeMessage('message')}
                                margin="normal"
                            />
                            <Button style={{width: "100%"}} variant="contained" color="primary" onClick={this.onClickAbsenden} >
                                Absenden
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}
export default NachrichtSenden;