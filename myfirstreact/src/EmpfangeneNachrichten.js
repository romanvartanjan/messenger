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
import PdfVonNachricht, { newEventEmitterNachrichtDrucken } from './PdfVonNachricht';
import eventEmitter, { EventEmitter } from 'events';
import { ClapSpinner } from "react-spinners-kit";


class EmpfangeneNachrichten extends Component {
    
    // Globale Variablen
    empfangeneNachrichtenAnzahl;
    empfangeneNachrichten = [];
    token = localStorage.getItem("token");

    constructor(props) {
      super(props);
      this.state = {
        offset: 0,
        mehrAls10: false,  
        seite: 1,
        empfangeneNachrichtenAnzahl: null,
        angezeigteAnzahl: 10,
        showVorherigerButton: "hidden",
        showNaechsterButton: "hidden",
        keineNachrichten: false,
        openDialogLoeschen: false,
        spinnerVisibility: "none",
        loeschenButtonHeight0: "100%",
        loeschenButtonHeight1: "100%",
        loeschenButtonHeight2: "100%",
        loeschenButtonHeight3: "100%",
        loeschenButtonHeight4: "100%",
        loeschenButtonHeight5: "100%",
        loeschenButtonHeight6: "100%",
        loeschenButtonHeight7: "100%",
        loeschenButtonHeight8: "100%",
        loeschenButtonHeight9: "100%",
        druckenButtonDisplay0: "none",
        druckenButtonDisplay1: "none",
        druckenButtonDisplay2: "none",
        druckenButtonDisplay3: "none",
        druckenButtonDisplay4: "none",
        druckenButtonDisplay5: "none",
        druckenButtonDisplay6: "none",
        druckenButtonDisplay7: "none",
        druckenButtonDisplay8: "none",
        druckenButtonDisplay9: "none",
      };
        newEventEmitter.on("showSpinner", () => {
            this.emitterShowSpinner();
        });
        newEventEmitter.on("hideSpinner", () => {
            this.emitterHideSpinner();
        });
      this.checkAngemeldet();
      this.zeigeEmpfangeneNachrichtenAnzahl();   
      this.zeigeEmpfangeneNachrichten();
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
        if(this.token == null || this.token == ""){
            this.props.history.push('/Login');
            alert("Bitte Melde dich zuerst an");
        }
    }

    componentDidMount(){
        this.checkAngemeldet();
        this.zeigeEmpfangeneNachrichten();
        this.zeigeEmpfangeneNachrichtenAnzahl();
        // this.zeigeLoeschenDialog();
        if(this.zeigeEmpfangeneNachrichtenAnzahl >= 10){
            this.vorherigeSeite();
        }
    }

    zeigeEmpfangeneNachrichtenAnzahl = async () => {
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.get("/zeigeEmpfangenAnzahl", {
            params: {
                token: this.token,
              }
        });
        this.setState({
            empfangeneNachrichtenAnzahl: test.data
        });
    }

    zeigeEmpfangeneNachrichten = async () => {
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.get("/zeigeEmpfangen", {
            params: {
                token: this.token,
                offset: this.state.offset,
              }
        });
        if(this.gesendeteNachrichtenAnzahl === 0){
            this.setState({
                keineNachrichten : true,
            });
        }else{
            this.empfangeneNachrichten = test.data;

            if(this.empfangeneNachrichtenAnzahl > this.state.angezeigteAnzahl){
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

    expansionPanelOnClick = async (event) =>{
        console.log(event);
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        var d = new Date();
        console.log("Event: " + event);
        const test = await http.post("/gelesenUmZeit", {
            token: localStorage.getItem('token'),
            date: d.getHours() + ":" + d.getMinutes(),
            messageID: event[0],
        })
        .then(response => { 
            console.log("nach then ist jetzt");

            
            var loeschenButtonHeight = "loeschenButtonHeight" + event[1];

            if(loeschenButtonHeight == "loeschenButtonHeight0"){
                if(this.state.loeschenButtonHeight0 == "100%"){
                    this.setState({
                        loeschenButtonHeight0: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight0: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight1"){
                if(this.state.loeschenButtonHeight1 == "100%"){
                    this.setState({
                        loeschenButtonHeight1: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight1: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight2"){
                if(this.state.loeschenButtonHeight2 == "100%"){
                    this.setState({
                        loeschenButtonHeight2: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight2: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight3"){
                if(this.state.loeschenButtonHeight3 == "100%"){
                    this.setState({
                        loeschenButtonHeight3: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight3: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight4"){
                if(this.state.loeschenButtonHeight4 == "100%"){
                    this.setState({
                        loeschenButtonHeight4: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight4: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight5"){
                if(this.state.loeschenButtonHeight5 == "100%"){
                    this.setState({
                        loeschenButtonHeight5: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight5: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight6"){
                if(this.state.loeschenButtonHeight6 == "100%"){
                    this.setState({
                        loeschenButtonHeight6: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight6: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight7"){
                if(this.state.loeschenButtonHeight7 == "100%"){
                    this.setState({
                        loeschenButtonHeight7: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight7: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight8"){
                if(this.state.loeschenButtonHeight8 == "100%"){
                    this.setState({
                        loeschenButtonHeight8: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight8: "100%",
                    });
                }
            }else if(loeschenButtonHeight == "loeschenButtonHeight9"){
                if(this.state.loeschenButtonHeight9 == "100%"){
                    this.setState({
                        loeschenButtonHeight9: "50%",
                    })
                }else{
                    this.setState({
                        loeschenButtonHeight9: "100%",
                    });
                }
            }
            
            
            
            
            var druckenButtonDisplay = "druckenButtonDisplay" + event[1];

            if(druckenButtonDisplay == "druckenButtonDisplay0"){
                if(this.state.druckenButtonDisplay0 == "none"){
                    this.setState({
                        druckenButtonDisplay0: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay0: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay1"){
                if(this.state.druckenButtonDisplay1 == "none"){
                    this.setState({
                        druckenButtonDisplay1: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay1: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay2"){
                if(this.state.druckenButtonDisplay2 == "none"){
                    this.setState({
                        druckenButtonDisplay2: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay2: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay3"){
                if(this.state.druckenButtonDisplay3 == "none"){
                    this.setState({
                        druckenButtonDisplay3: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay3: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay4"){
                if(this.state.druckenButtonDisplay4 == "none"){
                    this.setState({
                        druckenButtonDisplay4: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay4: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay5"){
                if(this.state.druckenButtonDisplay5 == "none"){
                    this.setState({
                        druckenButtonDisplay5: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay5: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay6"){
                if(this.state.druckenButtonDisplay6 == "none"){
                    this.setState({
                        druckenButtonDisplay6: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay6: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay7"){
                if(this.state.druckenButtonDisplay7 == "none"){
                    this.setState({
                        druckenButtonDisplay7: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay7: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay8"){
                if(this.state.druckenButtonDisplay8 == "none"){
                    this.setState({
                        druckenButtonDisplay8: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay8: "none"
                    });
                }
            }else if(druckenButtonDisplay == "druckenButtonDisplay9"){
                if(this.state.druckenButtonDisplay9 == "none"){
                    this.setState({
                        druckenButtonDisplay9: "inherit"
                    });
                }else{
                    this.setState({
                        druckenButtonDisplay0: "none"
                    });
                }
            }else{
                console.log("NICHTS HAT GEKLAPPT AHHHHHHHHHHHHHHH");
                console.log(event[1]);
            }
        })
        .catch(error => {
            alert(error.response.data);
        });
    }

    loeschenButton = async (event) => {
        this.schließeLoeschenDialog();
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.post("/loescheNachrichtReceiver", {
            token: this.token,
            messageID: event[0],
        });
        //Die Funktion zeigeGesendeteNachrichten aktualisiert den Array
        //mit den Nachrichten und rerendert die seite 
        if(test.data = "gut"){
            this.empfangeneNachrichtenAnzahl = this.gesendeteNachrichtenAnzahl -1;
            this.zeigeEmpfangeneNachrichten();
            var abstand = this.state.angezeigteAnzahl - this.empfangeneNachrichtenAnzahl;
            if( abstand >= 10){
                this.vorherigeSeite();
            }

            if(this.empfangeneNachrichtenAnzahl <= this.state.angezeigteAnzahl ){
                this.setState({
                    showNaechsterButton: "hidden"
                });
            }
            if(this.empfangeneNachrichtenAnzahl === 0){
                this.setState({
                    keineNachrichten: true
                });
            }
        }
    }
    

    onClickNachrichtDrucken = async (event) => {
        this.setState({
            spinnerVisibility: "inherit"
        });
        console.log("ist bei onClickNachrichtDrucken ");
        console.log(event);
        console.log(this.empfangeneNachrichten);
        console.log(this.empfangeneNachrichten[event[1]].messageID);
        // await this.props.history.push('/PdfVonNachricht/' + this.empfangeneNachrichten[event[1]].messageID);
        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
            });
            const test = await http.get("/emitterNachrichtDrucken", {
                params: {
                    token: this.token,
                    id: this.empfangeneNachrichten[event[1]].messageID,
                }
            })
            .then(response => {
                if(response.data == 400){
                  alert("Fehler beim Drucken einer PDF dieser Nachricht");
                }else{
                  alert("Drucken einer PDF dieser Nachricht erfolgreich");
                }
                this.setState({
                    spinnerVisibility: "none"
                });
            });
        // const http = axios.create({
        //     baseURL: "http://172.20.20.75:5000"
        // });
        // const test = await http.get("/emitterNachrichtDrucken", {
        //     params: {
        //         token: this.token,
        //         nachrichtObject: this.empfangeneNachrichten[event[1]]
        //     }
        // });
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

    vorherigeSeite = async () => {
        console.log("wurde geklickt");
        if(this.state.offset >= 10){
            const http = axios.create({
                baseURL: "http://172.20.20.75:5000"
            });
            
            const test = await http.get("/zeigeEmpfangen", {
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
            this.empfangeneNachrichten = test.data;

            if(this.empfangeneNachrichtenAnzahl > this.state.angezeigteAnzahl){
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
        const test = await http.get("/zeigeEmpfangen", {
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
        this.empfangeneNachrichten = test.data;

        if(this.empfangeneNachrichtenAnzahl > this.state.angezeigteAnzahl){
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
            keineNachrichten = <h1 style={{textAlign: "center"}}>Sie haben noch keine Nachrichten empfangen</h1> ;
        }

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
                <h1 style={{textAlign: "center"}}>
                    Empfangene Nachrichten 
                </h1>
                <div style={{width: "100%"}} >
                    {
                        this.empfangeneNachrichten.map((value, index) => {
                        var messageIDundIndex = [value.messageID, index]
                        return <div>
                                    <Grid container id={messageIDundIndex[1]}>
                                        <Grid item xs={10} xl={10} style={{marginBottom: "2%"}} >
                                            <ExpansionPanel
                                                style={{width: "100%", color: "black", backgroundcolor: "white"}} 
                                            > 
                                                <ExpansionPanelSummary
                                                    style={{ color: "black", backgroundcolor: "white", height: "10%"}} 
                                                    aria-controls="panel1a-content"
                                                    id= {value.messageID}
                                                    onClick={() => this.expansionPanelOnClick(messageIDundIndex)}
                                                    >
                                                        <Typography style={{fontWeight: "theme.typography.fontWeightRegular", width: "80%"}} >{value.von}</Typography>
                                                </ExpansionPanelSummary>

                                                <ExpansionPanelDetails style={{ height: 150, overflowY: "auto"}}>
                                                    <Typography>
                                                        {value.message}
                                                    </Typography>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel> 
                                        </Grid>
                                        <Grid item xs={2} xl={2} style={{marginBottom: "2%"}}>
                                            <Button 
                                            variant="contained"
                                            style={{ height: this.state["loeschenButtonHeight" + index], width: "100%" ,backgroundColor: "peru",  textAlign: "right"}} 
                                            onClick={() => this.zeigeLoeschenDialog(messageIDundIndex)}
                                            >
                                            Löschen
                                            </Button>
                                            <Button 
                                            variant="contained"
                                            id={messageIDundIndex[1]}
                                            style={{ height: "50%", width: "100%", display: this.state["druckenButtonDisplay" + index], backgroundColor: "peru",  textAlign: "right"}} 
                                            // onClick={this.onClickNachrichtDrucken()}
                                            onClick={() => this.onClickNachrichtDrucken(messageIDundIndex)}
                                            >
                                            Nachricht drucken
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
                                        <Button onClick={() => this.loeschenButton(messageIDundIndex)} style={{backgroundColor: "peru"}} autoFocus>
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
        </div>
        )
    }
}  
export default EmpfangeneNachrichten;