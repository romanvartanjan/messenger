import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Menu from './Menu';
import MenuLogin from './MenuLogin';
import NachrichtSenden from './NachrichtSenden';
import history from './history';
import Login from './Login';
import EmpfangeneNachrichten from './EmpfangeneNachrichten';
import GesendeteNachrichten from './GesendeteNachrichten';
import Regestrieren from './Regestrieren';
import Einstellungen from './Einstellungen';
import PdfVonNachricht from './PdfVonNachricht';
import { css } from '@emotion/core';
import { makeStyles , withStyles, useTheme } from '@material-ui/core/styles';


class Root extends Component {

  state;

  constructor(props) {
    super(props);
      this.state = {
        username: "", 
        password: "",
      }
      // localStorage.clear();
  }

  // componentWillMount(){
  //   this.forceUpdate();
  // }

//////////////////////////////////////////////////////////
// die Paths mit A am ende sind für den Drucken Button, 
//da bei den normalen Paths am Afangnoch kontrolliert wird,
//ob man eingeloogt ist. Puppeteer öffnet dann einen neuen 
//browser bei dem man nicht eingeloggt ist.
//////////////////////////////////////////////////////////

  render(){
    return(
      <div>
        <HashRouter history={history}>
          <Switch>
            <Route exact path="/NachrichtSenden" component={NachrichtSenden} key={1}/>
            <Route exact path="/EmpfangeneNachrichten" component={EmpfangeneNachrichten} key={2}/>
            <Route exact path="/GesendeteNachrichten" component={GesendeteNachrichten} key={3}/>
            <Route exact path="/Login" component={Login} key={4}/>
            <Route exact path="/Regestrieren" component={Regestrieren} key={5}/> 
            <Route exact path="/Einstellungen" component={Einstellungen} key={6}/>
            <Route exact path="/" component={Login} key={7}/>
            <Route exact path="/PdfVonNachricht/:id" component={PdfVonNachricht} key={7}/>
          </Switch>
        </HashRouter>
    </div>
  )}
}

//Gibt an, welcher pfad welches Menü haben soll:
class MenuRichtig extends Component {

  state;

  constructor(props) {
    super(props);
      this.state = {
        username: "", 
        password: "",
      }
      // localStorage.clear();
  }

  // componentWillMount(){
  //   this.forceUpdate();
  // }

  render(){
    return(
      <div>
        <HashRouter history={history}>
          <Switch>
            <Route exact path="/NachrichtSenden" component={Menu} key={1}/>
            <Route exact path="/EmpfangeneNachrichten" component={Menu} key={2}/>
            <Route exact path="/GesendeteNachrichten" component={Menu} key={3}/>
            <Route exact path="/Login" component={MenuLogin} key={4}/>
            <Route exact path="/Regestrieren" component={MenuLogin} key={5}/> 
            <Route exact path="/Einstellungen" component={Menu} key={6}/>
            <Route exact path="/" component={MenuLogin} key={7}/>
          </Switch>
        </HashRouter>
    </div>
  )}
}

ReactDOM.render((
  <div>
    <MenuRichtig history={history}/> 
    <Root history={history}/>
  </div>
  ), document.getElementById('root'));           