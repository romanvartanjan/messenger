import React, { Component } from 'react';
import Button from '@material-ui/core/Button';  
import { Typography, Grid } from '@material-ui/core';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ClapSpinner } from "react-spinners-kit";
import eventEmitter, { EventEmitter } from 'events';

export const newEventEmitter = new EventEmitter();

class Einstellungen extends Component {

    // Globale Variablen
    state;
    token = localStorage.getItem("token");

    constructor(props) {
        super(props);
        this.state = {
            username: "", neuerUsername: "", altesPasswordFuerUsername: "",
            altesPassword: "", neuesPassword: "", neuesPassword2: "", 
            openErfolgreich: false, openErfolglos: false, 
            passwordOpenErfolgreich: false, passwordOpenErfolglos: false, 
            file: null,
            fileZwei: null,
            profilbild: null,       // der name der beim Uploaden an den Client zuruückgesendet wurde (mit date)
            profilbildAktuell: null, 
            profilbildOrt: null,    // die vollständige URL der datei = localhsot..... + profilbild
            showProfilbild: false,  // bei false = hide das Feld für das ausgewählte Profilbild bei true = show
            showProfilbildAktuell: false,
            profilbildAktuell: null,
            spinnerVisibility: "none",
        }
        newEventEmitter.on("showSpinner", () => {
            this.emitterShowSpinner();
        });
        newEventEmitter.on("hideSpinner", () => {
            this.emitterHideSpinner();
        });
        this.checkAngemeldet();
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.zeigeAktuellesProfilbild();
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

    handleChangeFile= (event) => {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        });
      }
    
    handleCloseErfolgreich = () => {
        this.setState({openErfolgreich: false});
    };

    handleCloseErfolglos = () => {
        this.setState({openErfolglos: false});
    };

    handleClosePasswordErfolgreich = () => {
        this.setState({passwordOpenErfolgreich: false});
    };

    handleClosePasswordErfolglos = () => {
        this.setState({passwordOpenErfolglos: false});
    };


    handleChange = name => event => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
    };

    usernameAendern = async () => {
        if(this.state.altesPasswordFuerUsername && this.state.neuerUsername){
            if(this.state.neuerUsername.length <= 50){
                const http = axios.create({
                    baseURL: "http://172.20.20.75:5000"
                });
                const test = await http.post("/usernameAendern", {
                    token: this.token,
                    password: this.state.altesPasswordFuerUsername,
                    neuerUsername: this.state.neuerUsername,
                });
                console.log(test);
                this.setState({altesPasswordFuerUsername: "", neuerUsername: ""});
                if(test.data === "good"){
                    this.setState({openErfolgreich: true});
                }else if(test.data === "falsches Passwort"){
                    alert("falsches Passwort");
                }else if(test.data === "vergeben"){
                    // this.setState({openErfolglos: true});
                    alert("Username bereits vergeben!");
                }
            }else{
                alert("Der username darf höchstens 50 zeichen lang sein!")
            }
        }else{
            alert("Bitte fülle alle Felder aus!")
        }
    }

    passwordAendern = async () => {
        if(this.state.neuesPassword.length <= 50 && this.state.neuesPassword2.length <= 50 && this.state.altesPassword.length <= 50){
            if(this.state.neuesPassword === this.state.neuesPassword2){
                const http = axios.create({
                    baseURL: "http://172.20.20.75:5000"
                });
                const test = await http.post("/passwordAendern", {
                    token: this.token,
                    altesPassword: this.state.altesPassword,
                    neuesPassword: this.state.neuesPassword
                });
                this.setState({altesPassword: "", neuesPassword: "", neuesPassword2: ""});
                console.log(test.data);
                if(test.data === "good"){
                    this.setState({passwordOpenErfolgreich: true});
                }else if(test.data === "fail"){
                    this.setState({passwordOpenErfolglos: true});
                }else if(test.data === "leer"){
                    this.setState({passwordOpenErfolglos: true});
                }
            }else{
                this.setState({passwordOpenErfolglos: true});
            }
        }else{
            alert("Der username darf höchstens 50 zeichen lang sein!")
        }
    }

    profilbildAendern = async () => {

        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.post("/uploadMitName", {
                token: this.token,
                alteDatei: this.state.profilbild,
                fileAktuell: this.state.file
        });

        console.log(test);

        this.setState({
            profilbildAktuell: test.data,
            showProfilbild: false,
            showProfilbildAktuell: true,
        })
        this.forceUpdate();
        console.log(this.state.profilbildAktuell);
        console.log(this.state.file);
    }

    onChange(e) {
        console.log(e.target.files[0]);
        this.setState({
            file: URL.createObjectURL(e.target.files[0]),
            fileZwei: (e.target.files[0])
        })
        console.log(this.state.file);
        console.log(this.state.fileZwei);
          
        const formData = new FormData();
        console.log( e.target.files[0]);
        formData.append("myImage", e.target.files[0]);
        console.log(formData);
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };  

        var selectedFile = e.target.files[0];
        var idxDot = selectedFile.name.lastIndexOf(".") + 1;
        var extFile = selectedFile.name.substr(idxDot, selectedFile.name.length).toLowerCase();
        if (extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "svg" || extFile === "gif") {
            
        axios.post("http://172.20.20.75:5000/showImage",formData,config)
        .then((response) => {
            console.log(response);
            this.setState({profilbild: response.data});
            alert("The file is successfully uploaded");
        })
        this.setState({showProfilbild: true});
        this.forceUpdate();
        } else {
            alert("Only jpg/jpeg, png, gif and svg files are allowed!");
        }
    }

    zeigeAktuellesProfilbild = async () => {

        const http = axios.create({
            baseURL: "http://172.20.20.75:5000"
        });
        const test = await http.get("/zeigeAktuellesProfilbild", {
            params: {
                token: this.token
            }
        });
        console.log(test);
        console.log(test.data);
        this.setState({
            profilbildAktuell: "http://172.20.20.75:5000/offizielesProfilbild/" + test.data + "?" + Date.now(),
            showProfilbildAktuell: true
        })
    }

    render(){

        let profilbildNeu;
        if(this.state.showProfilbild === true){
            profilbildNeu =  <img src={this.state.file} width="104" height="90" alt=''  /> ;
        }else{
            profilbildNeu = <p> Noch kein Bild hochgeladen </p>;
        }

        
        let profilbildNeuAktuell;
        if(this.state.showProfilbildAktuell === true){
            profilbildNeuAktuell =  <img src={this.state.profilbildAktuell} width="104" height="90" alt=''  /> ;
        }else{
            profilbildNeuAktuell = <p> Noch kein Bild hochgeladen </p>;
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
                    <Grid container mx="auto" justify="center" style={{ color: "black", backgroundcolor: "white"}} >
                    <Grid item xs={10} xl={6}>
                        <form noValidate autoComplete="off">
                            <Typography align="left" variant="h4" component="h2" style={{marginTop:"5%"}} >
                            Einstellungen
                            </Typography>
                            <div>
                                <Typography align="left" variant="h6" component="h2" style={{marginTop:"3%"}} >
                                Username Ändern
                                </Typography>
                                <TextField
                                    style={{width: "100%"}}
                                    id="standard-name"
                                    label="Jetziges Passwort"
                                    margin="normal"
                                    type="password"
                                    text-align= "center"
                                    variant="outlined"
                                    value={this.state.password}
                                    onChange={this.handleChange("altesPasswordFuerUsername")}
                                />
                                <TextField
                                    style={{width: "100%"}}
                                    id="standard-name"
                                    label="Neuer Username"
                                    margin="normal"
                                    text-align= "center"
                                    variant="outlined"
                                    value={this.state.neuerUsername}
                                    onChange={this.handleChange("neuerUsername")}
                                />
                                <Button style={{width: "100%"}} variant="contained" color="primary" 
                                    onClick={() => this.usernameAendern()} >
                                    Ändern
                                </Button>
                                <Dialog
                                    open={this.state.openErfolgreich}
                                    onClose={this.handleCloseErfolgreich}
                                    aria-labelledby="usernameErfolgreich"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="usernameErfolgreich">{"Username erfolgreich gändert!"}</DialogTitle>
                                    <DialogActions>
                                    <Button onClick={this.handleCloseErfolgreich} color="primary">
                                        Ok
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={this.state.openErfolglos}
                                    onClose={this.handleCloseErfolglos}
                                    aria-labelledby="usernameErfolglos"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="usernameErfolglos">{"Bitte fülle die Felder richtig aus!"}</DialogTitle>
                                    <DialogActions>
                                    <Button onClick={this.handleCloseErfolglos} color="primary">
                                        Ok
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>

                            <div>
                                <Typography align="left" variant="h6" component="h2" style={{marginTop:"5%"}} >
                                Passwort Ändern
                                </Typography>
                                <TextField
                                    style={{width: "100%"}}
                                    id="standard-name"
                                    label="Jetziges Passwort"
                                    margin="normal"
                                    text-align= "center"
                                    variant="outlined"
                                    value={this.state.password}
                                    onChange={this.handleChange("altesPassword")}
                                />
                                <TextField
                                    style={{width: "100%"}}
                                    id="standard-name"
                                    type="password"
                                    label="Neues Passwort"
                                    margin="normal"
                                    text-align= "center"
                                    variant="outlined"
                                    value={this.state.newPassword}
                                    onChange={this.handleChange("neuesPassword")}
                                />
                                <TextField
                                    style={{width: "100%"}}
                                    id="standard-name"
                                    type="password"
                                    label="Neues Passwort bestätigen"
                                    margin="normal"
                                    text-align= "center"
                                    variant="outlined"
                                    value={this.state.newPassword2}
                                    onChange={this.handleChange("neuesPassword2")}
                                />
                                <Button style={{width: "100%"}} variant="contained" color="primary" 
                                    onClick={() => this.passwordAendern()} >
                                    Ändern
                                </Button>
                                <Dialog
                                    open={this.state.passwordOpenErfolgreich}
                                    onClose={this.handleClosePasswordErfolgreich}
                                    aria-labelledby="passwordErfolgreich"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="passwordErfolgreich">{"Password erfolgreich gändert!"}</DialogTitle>
                                    <DialogActions>
                                    <Button onClick={this.handleClosePasswordErfolgreich} color="primary">
                                        Ok
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={this.state.passwordOpenErfolglos}
                                    onClose={this.handleClosePasswordErfolglos}
                                    aria-labelledby="passwordErfolglos"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="passwordErfolglos">{"Bitte fülle die Felder richtig aus!"}</DialogTitle>
                                    <DialogActions>
                                    <Button onClick={this.handleClosePasswordErfolglos} color="primary">
                                        Ok
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>

                            <div>
                                <div style={{ marginTop: "5%", bottom: "20%"}}>
                                    <Typography align="left" variant="h6" component="h2" >
                                    Profilbild Ändern
                                    </Typography>
                                    <div>
                                    <Typography align="left" variant="caption" component="h2" >
                                    Jetziges Profilbild
                                    </Typography>
                                    </div>
                                    <div>
                                        {profilbildNeuAktuell} 
                                    </div>
                                </div>
                                <Typography align="left" variant="caption" component="h2" >
                                    Neues Profilbild
                                </Typography>


                                <div>
                                <p>
                                    <input type="file" name="myImage" accept="image/*" onChange= {this.onChange} />
                                </p>
                                <div>
                                    {profilbildNeu}
                                </div>

                                </div>

                                <Button style={{width: "100%"}} variant="contained" color="primary" 
                                        onClick={() => this.profilbildAendern()} >
                                        Ändern
                                </Button>
                            </div>
                        </form>
                    </Grid>
                    </Grid>
                </div>
        </div>
        )
    }
}  
export default Einstellungen;