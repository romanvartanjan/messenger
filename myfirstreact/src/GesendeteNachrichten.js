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
import Einstellungen, { newEventEmitter } from './Einstellungen';
import { ClapSpinner } from "react-spinners-kit";

class GesendeteNachrichten extends Component {

    // Globale Variablen
    gesendeteNachrichtenAnzahl;
    gesendeteNachrichten = [];
    token = localStorage.getItem("token");
        state;

    constructor(props) {
      super(props);
      this.state = {
        offset: 0,
        mehrAls10: false,  
        seite: 1,
        gesendeteNachrichtenAnzahl: null,
        angezeigteAnzahl: 10,
        showVorherigerButton: "hidden",
        showNaechsterButton: "hidden",
        keineNachrichten: false,
        openDialogLoeschen: false,
        spinnerVisibility: "none",
      };
        newEventEmitter.on("showSpinner", () => {
            this.emitterShowSpinner();
        });
        newEventEmitter.on("hideSpinner", () => {
            this.emitterHideSpinner();
        });
        this.checkAngemeldet();
        this.zeigeGesendeteNachrichtenAnzahl();   
        this.zeigeGesendeteNachrichten();
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
        console.log(this.token);
        if(this.token == null || this.token == ""){
            this.props.history.push('/Login');
            alert("Bitte Melde dich zuerst an");
        }
    }

    zeigeGesendeteNachrichtenAnzahl = async () => {
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.get("/zeigeGesendeteAnzahl", {
            params: {
                token: this.token,
              }
        });
        this.gesendeteNachrichtenAnzahl = test.data;
    }

    zeigeGesendeteNachrichten = async () => {
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.get("/zeigeGesendet", {
            params: {
                token: this.token,
                offset: this.state.offset,
              }
        });
        if(this.gesendeteNachrichtenAnzahl == 0){
            this.setState({
                keineNachrichten : true,
            });
        }else{
            this.gesendeteNachrichten = test.data;

            if(this.gesendeteNachrichtenAnzahl > this.state.angezeigteAnzahl){
                this.setState({
                    showNaechsterButton: "visible"
                });
            }
            
            if(this.state.seite >= 2){
                this.setState({
                    showVorherigerButton: "visible"
                });
            }
        }
        this.forceUpdate();
    }

    // Post request an die Api um die Nachricht mit der mitgegebenen
    // messageID aus der DB zu löschen
    loeschenButton = async (event) => {
        this.schließeLoeschenDialog();
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.post("/loescheNachrichtSender", {
            token: this.token,
            messageID: event[0],
        });
        //Die Funktion zeigeGesendeteNachrichten aktualisiert den Array
        //mit den Nachrichten und rerendert die seite 
        if(test.data = "gut"){
            this.gesendeteNachrichtenAnzahl = this.gesendeteNachrichtenAnzahl - 1;
            this.zeigeGesendeteNachrichten(); 
            console.log(this.gesendeteNachrichtenAnzahl);
            console.log(this.state.angezeigteAnzahl );
            var abstand = this.state.angezeigteAnzahl - this.gesendeteNachrichtenAnzahl;
            if( abstand >= 10){
                this.vorherigeSeite();
            }

            if(this.gesendeteNachrichtenAnzahl <= this.state.angezeigteAnzahl ){
                this.setState({
                    showNaechsterButton: "hidden"
                });
            }
            if(this.gesendeteNachrichtenAnzahl == 0){
                this.setState({
                    keineNachrichten: true
                });
            }
        }

    }

    zeigeLoeschenDialog = async (event) => {
        this.setState({
            openDialogLoeschen: true
        });
    }

    schließeLoeschenDialog = async (event) => {
        this.setState({
            openDialogLoeschen: false
        });
    }


    //Zur vorherigen Seite kommen
    vorherigeSeite = async () => {
        console.log("wurde geklickt");
        if(this.state.offset >= 10){
            const http = axios.create({
                baseURL: "http://172.20.20.75:5000"
            });
            
            const test = await http.get("/zeigeGesendet", {
                params: {
                    token: this.token,
                    offset: this.state.offset - 10,
                }
            });
            this.setState({
                offset: this.state.offset - 10,
                seite: this.state.seite - 1,
                angezeigteAnzahl: this.state.angezeigteAnzahl - 10,
            });
            this.gesendeteNachrichten = test.data;

            if(this.gesendeteNachrichtenAnzahl > this.state.angezeigteAnzahl){
                this.setState({
                    showNaechsterButton: "visible"
                });
            }else{
                this.setState({
                    showNaechsterButton: "hidden"
                });
            }
    
            if(this.state.seite >= 2){
                this.setState({
                    showVorherigerButton: "visible"
                });
            }else{
                this.setState({
                    showVorherigerButton: "hidden"
                });
            }

            this.forceUpdate();
        }
    }
    
     //Zur nächsten Seite kommen
     naechsteSeite = async () => {
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.get("/zeigeGesendet", {
            params: {
                token: this.token,
                offset: this.state.offset + 10,
              }
        });
        this.setState({
            offset: this.state.offset + 10,
            seite: this.state.seite + 1,
            angezeigteAnzahl: this.state.angezeigteAnzahl + 10,
        });
        this.gesendeteNachrichten = test.data;

        if(this.gesendeteNachrichtenAnzahl > this.state.angezeigteAnzahl){
            this.setState({
                showNaechsterButton: "visible"
            });
        }else{
            this.setState({
                showNaechsterButton: "hidden"
            });
        }

        if(this.state.seite >= 2){
            this.setState({
                showVorherigerButton: "visible"
            });
        }else{
            this.setState({
                showVorherigerButton: "hidden"
            });
        }

        this.forceUpdate();
    }

    render(){

        let keineNachrichten;
        if(this.state.keineNachrichten === true){
            keineNachrichten = <h1 style={{textAlign: "center"}}>Sie haben noch keine Nachrichten gesendet</h1> ;
        }

        return(
            <div>
            <div style={{ position: "fixed", zIndex: "9999",  backgroundColor: "gray", opacity: "0.8", width: "100%", height: "100%", display: this.state.spinnerVisibility}}>
                <div style={{ position: "absolute", left: "50%", top: "30%" }}>
                    <ClapSpinner
                    size={50}
                    loading={true}
                    />
                </div>
            </div>
            <div>
                <h1 style={{textAlign: "center"}}>
                    Gesendete Nachrichten 
                </h1> 
                {
                    this.gesendeteNachrichten.map((value, index) => {
                    var massageIDundIndex = [value.messageID, index]
                    return <div>
                            <Grid container>
                                <Grid item xs={10} style={{marginBottom: "2%"}} >
                                    <ExpansionPanel
                                    style={{width: "100%", color: "black", backgroundcolor: "white"}} 
                                    > 
                                
                                    <ExpansionPanelSummary
                                        style={{ color: "black", backgroundcolor: "white", height: "10%"}} 
                                        aria-controls="panel1a-content"
                                        id= {index}
                                        >
                                            <Typography style={{fontWeight: "theme.typography.fontWeightRegular", width: "80%"}} >{value.an}</Typography>
                                    </ExpansionPanelSummary>

                                    <ExpansionPanelDetails style={{ height: 150, overflowY: "auto"}} >
                                        <Typography>
                                            {value.message}
                                        </Typography>
                                    </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Grid>
                                <Grid item xs={2} style={{marginBottom: "2%"}}>
                                    <Button 
                                        variant="contained"
                                        style={{ height: "100%", width: "100%" ,backgroundColor: "peru",  textAlign: "right"}} 
                                        onClick={() => this.zeigeLoeschenDialog()}
                                    >
                                        Löschen
                                    </Button>
                                </Grid>
                            </Grid>

                            <Dialog
                                open={this.state.openDialogLoeschen}
                                onClose={this.schließeLoeschenDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"Diese Nachricht wirklich löschen?"}</DialogTitle>
                                <DialogActions>
                                <Button onClick={() => this.schließeLoeschenDialog()} style={{backgroundColor: "peru"}}>
                                    Nein, nicht löschen
                                </Button>
                                <Button onClick={() => this.loeschenButton(massageIDundIndex)} style={{backgroundColor: "peru"}} autoFocus>
                                    Ja, löschen
                                </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    })
                }
                <div>
                    {keineNachrichten}
                </div>
                <Grid container>
                    <Grid item xs={6}>
                        <Button 
                            variant="contained"
                            style={{width: "100%", backgroundColor: "peru", textAlign: "right", visibility: this.state.showVorherigerButton}} 
                            onClick={() => this.vorherigeSeite()}
                        >
                            Vorherige Seite
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button 
                            variant="contained"
                            style={{width: "100%", backgroundColor: "peru", textAlign: "right", visibility: this.state.showNaechsterButton}} 
                            onClick={() => this.naechsteSeite()}
                        >
                            Nächste Seite
                        </Button>
                    </Grid>
                </Grid>
           </div>
           </div>
        )
    }
}  
export default GesendeteNachrichten;