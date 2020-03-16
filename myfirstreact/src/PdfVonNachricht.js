import React, { Component } from 'react';
import axios from 'axios';
import Menu from './Menu';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';  
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import eventEmitter, { EventEmitter } from 'events';
import { useParams } from 'react-router';

export const newEventEmitterNachrichtDrucken = new EventEmitter();

class PdfVonNachricht extends Component {


  state;
  token = localStorage.getItem("token");
  allesFürMessage = [];
  unnotigerTest= "affe";

  constructor(props) {
    super(props);
    this.state = {
        betreff: "",
        nachricht: "",
        messageIDundIndex: "",
        unnotigerTest: "afffffe",
        id: this.props.match.params.id,
        showTralalaButton: "inherit",
        subject: "",
        message: "",
        messageID: "",
    }
    // newEventEmitterNachrichtDrucken.on("NachrichtDrucken", (e) => {
    //     console.log("AAAAAAHHHHHHHHHHHHHHH");
    //     console.log(e.message);
    //     console.log(e.von);
    //     console.log(e.messageID);
    //     console.log(this.state.id);
    //     this.state.allesFuerMessage = e.message;   
    //     this.state.allesFuerBetreff = e.von;   
    //     this.state.unnotigerTest= "esel";
    //     console.log(this.state.allesFuerMessage.von);
    //     this.emitterNachrichtDrucken();
    // });
    this.getMessageValues();
    // this.emitterNachrichtDrucken();
  }

  getMessageValues = async () => {
    const http = axios.create({
        baseURL: "http://172.20.20.75:5000"
    });
    const test = await http.get("/getMessageValues", {
        params: {
            token: this.token,
            id: this.state.id,
        }
    })
    .then(response => { 
        console.log(response);
        if(response.data == 400){
            alert("Fehler beim erhalten der Daten aus der db ");
        }else{
            console.log(response);
            this.setState({
            subject: response.data.von,
            message: response.data.message,
            messageID: response.data.messageID,
            });
        }
    });
  }

  emitterNachrichtDrucken = async () => {
    console.log( "messageIdundIndex bei PdfVonNachricht.js");
    this.setState({
        unnotigerTest: "esel"
    });

    const http = axios.create({
    baseURL: "http://172.20.20.75:5000"
    });
    const test = await http.get("/emitterNachrichtDrucken", {
        params: {
            token: this.token,
            id: this.state.id,
        }
    })
    .then(response => { 
        console.log(response);
        if(response.data == 400){
          alert("Fehler beim Drucken einer PDF dieser Nachricht");
        }else{
          console.log(response);
          alert("Drucken einer PDF dieser Nachricht erfolgreich");
        }
    });
  }

  hideTralalaButton = (eallesFuerMessage, allesFuerBetreff) => {
    this.state.showTralalaButton = "none";
    console.log(eallesFuerMessage);
    console.log(allesFuerBetreff);
    if(allesFuerBetreff == "" || allesFuerBetreff == null){
        console.log(allesFuerBetreff);
    }
    this.forceUpdate();
  }

  render() {
      return (
        <div>
            <Grid container>
                <Grid item xs={10} xl={10} style={{marginBottom: "2%"}} >
                    <ExpansionPanel
                        style={{width: "100%", color: "black", backgroundcolor: "white"}} 
                    > 
                        <ExpansionPanelSummary
                            style={{ color: "black", backgroundcolor: "white", height: "10%"}} 
                            aria-controls="panel1a-content"
                            >
                                <Typography id={"idOnClickPanelZumDrucken"} style={{fontWeight: "theme.typography.fontWeightRegular", width: "80%"}} >{this.state.subject}</Typography>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails style={{ height: 150, overflowY: "auto"}}>
                            <Typography>
                                {this.state.message}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel> 
                </Grid>
                <Grid item xs={2} xl={2} style={{marginBottom: "2%"}}>
                    <Button 
                    variant="contained"
                    style={{ height: "50%", width: "100%" ,backgroundColor: "peru",  textAlign: "right"}} 
                    >
                    Löschen
                    </Button>
                    <Button 
                    variant="contained"
                    style={{ height: "50%", width: "100%", backgroundColor: "peru",  textAlign: "right"}} 
                    >
                    Nachricht drucken
                    </Button>
                </Grid>
            </Grid>
        </div>
      );
    }
  }

export default PdfVonNachricht;