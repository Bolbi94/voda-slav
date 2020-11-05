import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import * as ROUTES from './Components/Constants/routes';
import { FirebaseContext, withFirebase } from './Components/Firebase';
import Main from './Components/Main/main';
import SignIn from './Components/Authentification/sign-in';
import SignUp from './Components/Authentification/sign-up';
import TableParser from './Components/TableParser/table-parser';
import Export from './Components/Export/export';
import Home from './Components/Main/home';

import './app.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return(
      <Router>
        <React.Fragment>
          <Route exact path = {ROUTES.MAIN} component = {withRouter(withFirebase(Main))} />
          <Route path = {ROUTES.HOME} component = {withRouter(withFirebase(Home))} />
          <Route path = {ROUTES.SIGN_IN} component = {withRouter(withFirebase(SignIn))} />
          <Route path = {ROUTES.SIGN_UP} component = {withRouter(withFirebase(SignUp))} />
          <Route path = {ROUTES.TABLE_PARSER} component = {withRouter(withFirebase(TableParser))} />
          <Route path = {ROUTES.EXPORT} component = {withRouter(withFirebase(Export))} />
        </React.Fragment>
      </Router>
    )
  }
}
