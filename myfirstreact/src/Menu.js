import React, { Component } from 'react';
import { makeStyles , withStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withRouter } from 'react-router-dom';
import { css } from '@emotion/core';
import Einstellungen, { newEventEmitter } from './Einstellungen';

const drawerWidth = 240;

const override = css`
    display: block;
    margin: 0 auto;
    border-color: inherit;
`;

const classes = makeStyles(theme => ({
  root: {
    color: 'black',
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  //   [theme.breakpoints.up('sm')]: {
  //     display: 'none',
  //     visibility: this.state.visibilityIcon,
  //   },
  // },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  closeMenuButton: {
    marginRight: 'auto',
    marginLeft: 0,
  },
}));

class Menu extends Component {

  state;
  token = localStorage.getItem("token");

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      menuJaOderNein: "hidden",
      mobileOpen: false,
      visibilityIcon: "hidden",
      dummyCategories: ["Nachricht Senden", "Empfangene Nachrichten", "Gesendete Nachrichten" ],
    }
  }
  
   logoutUsername = async () => {
    const http = axios.create({
        baseURL: "http://172.20.20.75:5000"
    });
    const test = await http.get("/logoutUsername", {
        params: {
            token: this.token
        }
    });
    this.setState({
      username: " " + test.data,
    });
  }

  onClickDrucken = async () => { 

    //Event
    newEventEmitter.emit("showSpinner");
    this.handleDrawerToggle();
    const http = axios.create({
        baseURL: "http://172.20.20.75:5000",
        responseType: 'blob',
    });
    const test = await http.get("/seiteDruckenPDF", {
        params: {
            location: document.location.href,
            token: this.token
        }
    })
    .then(response => { 
      console.log(response);
      if(response.data == 400){
        newEventEmitter.emit("hideSpinner");
        alert("Fehler beim Drucken einer PDF dieser Seite");
      }else{
        newEventEmitter.emit("hideSpinner");
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", Date.now() + "MessengerDruck.pdf");
        document.body.appendChild(link);
        link.click();
      }
    })
    .catch(error => {
      // console.log("fehler hat nicht geklappt");
      alert(error.response.data);
    });
    }

  // Mobil mit schließen beim onklick auf einen Button
  onClickSendenMobil = () => {
    this.props.history.push('/NachrichtSenden');
    this.handleDrawerToggle();
  }
  onClickGesendeteNachrichtenMobil = () => {
    this.props.history.push('/GesendeteNachrichten');
    this.handleDrawerToggle();
  }
  onClickEmpfangeneNachrichtenMobil = () => {
    this.props.history.push('/EmpfangeneNachrichten');
    this.handleDrawerToggle();
  }
  onClickLoginMobil = () => {
    this.props.history.push('/Login');
    this.handleDrawerToggle();
  }
  onClickEinstellungenMobil = () => {
    this.props.history.push('/Einstellungen');
    this.handleDrawerToggle();
  }


  handleDrawerToggle = () =>  {
    if(this.state.mobileOpen === true){
    this.setState({mobileOpen: false});
    }else{
      this.setState({mobileOpen: true});
    }
  }

  render() {
    const logoutUsername = "Logout" + this.state.username;
    var drawer = (
      <div>
        <List style={{display:"inline-block"}}>
            <ListItem >
              <Button onClick={this.onClickSenden} color="inherit">Senden</Button>
            </ListItem>
            <ListItem >
              <Button onClick={this.onClickGesendeteNachrichten} color="inherit">Gesendete Nachrichten</Button>
            </ListItem>
            <ListItem >
              <Button onClick={this.onClickEmpfangeneNachrichten} color="inherit">Empfangene Nachrichten</Button>
            </ListItem> 
            <ListItem >
              <Button onClick={this.onClickEinstellungen} color="inherit">Einstellungen</Button>
            </ListItem> 
            <ListItem >
              <Button onClick={this.onClickLogin} color="inherit">{logoutUsername}</Button>
            </ListItem>
        </List>
      </div>
    );

    var drawerMobil = (
      <div>
        <List style={{display:"inline-block"}}>
            <ListItem >
              <Button onClick={this.onClickSendenMobil} id={"idSenden"} color="inherit">Senden</Button>
            </ListItem>
            <ListItem >
              <Button onClick={this.onClickGesendeteNachrichtenMobil} id={"idGesendeteNachrichten"} color="inherit">Gesendete Nachrichten</Button>
            </ListItem>
            <ListItem >
              <Button onClick={this.onClickEmpfangeneNachrichtenMobil} id={"idEmpfangeneNachrichten"} color="inherit">Empfangene Nachrichten</Button>
            </ListItem> 
            <ListItem >
              <Button onClick={this.onClickEinstellungenMobil} id={"idEinstellungen"} color="inherit">Einstellungen</Button>
            </ListItem> 
            <ListItem >
              <Button onClick={this.onClickDrucken} id={"idSeiteDrucken"} color="inherit">Seite Drucken</Button>
            </ListItem> 
            <ListItem >
              <Button onClick={this.onClickLoginMobil} id={"idLogoutUsername"} color="inherit">{logoutUsername}</Button>
            </ListItem>
        </List>
      </div>
    );
      return (
      <div className={classes.root}>
        <div>
        <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                id="iconButton"
                onClick={this.handleDrawerToggle}
                // className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Messenger
              </Typography>
            </Toolbar>
          </AppBar>
          </div>
          <div style={{marginTop: "64px", visibility: this.state.menuJaOderNein}}>
            <nav className={classes.drawer} >
              <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <IconButton className={classes.closeMenuButton} id={"iconButton"} onClick={this.handleDrawerToggle}>
                  <CloseIcon/>
                </IconButton>
                {drawerMobil}
              </Drawer>
              </Hidden>
              <Hidden xsDown implementation="css" >
                <Drawer
                  className={classes.drawer}
                  variant="permanent"
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                  <div className={classes.toolbar} />
                  {drawer}
                </Drawer>  
              </Hidden>
            </nav>
          </div>
      </div>
      );
    }
  }

export default withStyles(classes)(Menu);