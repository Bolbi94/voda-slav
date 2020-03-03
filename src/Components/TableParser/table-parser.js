import React from 'react';
//import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import base64url from "base64url";
import * as XLSX from 'xlsx';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DateFnsUtils  from '@date-io/date-fns';
import { sub, startOfMonth, endOfMonth, getUnixTime, format } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './table-parser.css';

const API_KEY = "AIzaSyBrbNMXwOrljm_EJyxWWY8Fx_2YQdkeqto";

export default class TableParser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
      user: "",
      isGapiReady: false,

      dateFrom: startOfMonth(sub(new Date(), {months: 1})),
      dateTo: endOfMonth(sub(new Date(), {months: 1}))
    }
  }

  componentDidMount() {
    this.initGapi();
    // this.unregisterAuthObserver = this.props.firebase.auth.onAuthStateChanged(
    //   user => {
    //     console.log("user", user);
    //     this.setState({
    //       isSignedIn: !!user,
    //       user
    //     });
    //     if(this.state.user && this.state.user.email === "watercounters@gmail.com") {
    //       this.initGapi();
    //     }
    //   }
    // );
  }

  initGapi = () => {
    //console.log('Initializing GAPI...');
    //console.log('Creating the google script tag...');

    const script = document.createElement("script");
    script.onload = () => {
      //console.log('Loaded script, now loading our api...')
      // Gapi isn't available immediately so we have to wait until it is to use gapi.
      this.loadClientWhenGapiReady(script);
    };
    script.src = "https://apis.google.com/js/client.js";
    
    document.body.appendChild(script);
  }

  loadClientWhenGapiReady = (script) => {
    //console.log('Trying To Load Client!');
    //console.log(script)
    if(script.getAttribute('gapi_processed')){
      //console.log('Client is ready! Now you can access gapi. :)');
      // window.gapi.client.setApiKey(API_KEY);

      // window.gapi.client.load('gmail', 'v1', (data) => {
      //   console.log('load gapi', data);
      // })
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: "447205832578-qa26mmfh3lmvokcosq4mlmh42oepitmk.apps.googleusercontent.com",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        scope: "https://www.googleapis.com/auth/gmail.readonly"
      }).then(() => {
        this.setState({
          isGapiReady: true
        })
        this.handleSignIn();
      })
    }
    else{
      //console.log('Client wasn\'t ready, trying again in 100ms');
      setTimeout(() => {this.loadClientWhenGapiReady(script)}, 100);
    }
  }

  getMessages = () => {
    // console.log("date from:", this.state.dateFrom);
    // console.log("date to", this.state.dateTo);
    // console.log("q", `in:inbox after:${getUnixTime(this.state.dateFrom)} before:${getUnixTime(this.state.dateTo)}`);
    window.gapi.client.gmail.users.messages.list({
      "userId": "me",
      "includeSpamTrash": false,
      "q": `in:inbox after:${getUnixTime(this.state.dateFrom)} before:${getUnixTime(this.state.dateTo)}`,
      "maxResults": 500
    }).then(response => {
      //console.log("response", response);
      let messages = response.result.messages;
      let readings = [];
      let messagesCounter = 0;
      messages.forEach(messageIDs => {
        let id = messageIDs.id;
        //console.log("mess id", id);
        window.gapi.client.gmail.users.messages.get({
          "userId": "me",
          "id": id
        }).then(response => {
          ++messagesCounter;
          //console.log("mess response", response);
          let messageBody = response.result.payload.body.data;
          if(messageBody) {
            messageBody = base64url.decode(messageBody);
            //console.log("mess body", messageBody);
            if(messageBody.indexOf("##") > -1) {
              let jsonString = messageBody.substring(messageBody.indexOf("##") + 2);
              //console.log("jsonString", jsonString);
              let jsonObj = JSON.parse(jsonString);
              //console.log("jsonObj", jsonObj);
              let reading = this.convertDomovichekMessageObjToReading(jsonObj);
              //console.log("reading", reading);
              readings.push(reading);
            }
          }
          if(messagesCounter === messages.length) {
            this.exportToExcel(readings);
          }
        })
      });
    })
  }

  convertDomovichekMessageObjToReading = (jsonObj) => {
    let reading = {
      Sender: jsonObj.sender,
      AccountID: jsonObj.accountNumber,
      Sent: jsonObj.sendingDate,
      Month: jsonObj.month,
      Phone: jsonObj.phone,
      KitchenColdValue: jsonObj.countersNameValue.kitchenColdCounter,
      KitchenHotValue: jsonObj.countersNameValue.kitchenHotCounter,
      KitchenColdValue2: jsonObj.countersNameValue.kitchenCold2Counter,
      KitchenHotValue2: jsonObj.countersNameValue.kitchenHot2Counter,
      ToiletColdValue: jsonObj.countersNameValue.toiletColdCounter,
      ToiletHotValue: jsonObj.countersNameValue.toiletHotCounter,
      ToiletColdValue2: jsonObj.countersNameValue.toiletCold2Counter,
      ToiletHotValue2: jsonObj.countersNameValue.toiletHot2Counter,
      BathColdValue: jsonObj.countersNameValue.bathroomColdCounter,
      BathHotValue: jsonObj.countersNameValue.bathroomHotCounter,
      BathColdValue2: jsonObj.countersNameValue.bathroomCold2Counter,
      BathHotValue2: jsonObj.countersNameValue.bathroomHot2Counter,
      Reverse: jsonObj.countersNameValue.reverseHotCounter,
      Watering: jsonObj.countersNameValue.wateringColdCounter,
      HeatWater: jsonObj.countersNameValue.heatmeterColdCounter,
      HeatGKal: jsonObj.countersNameValue.heatmeterHotCounter,
    }
    return reading;
  }

  exportToExcel = (data) => {
    //console.log("exportToExcel()");
    let worksheet = XLSX.utils.json_to_sheet(data);
    //console.log("worksheet", worksheet);
    let new_workbook = XLSX.utils.book_new();
    //console.log("create workbook", new_workbook);
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "sheet");
    //console.log("add worksheet", new_workbook);
    XLSX.writeFile(new_workbook, `Counters_readings_${format(this.state.dateFrom, 'dd.MM.yyy')}-${format(this.state.dateTo, 'dd.MM.yyy')}.xlsx`);
  }

  handleSignIn = () => {
    window.gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        if(window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
          this.setState({
            isSignedIn: true,
            user: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()
          })
        } else {
          alert("Щось пішло не так з авторизацією, спробуйте залогінитись знову");
          this.handleSignIn();
        }
      })
  }

  handleSignOut = () => {
    window.gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        if(!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
          this.setState({
            isSignedIn: false,
            user: ""
          })
        } else {
          alert("Щось пішло не так з розлогуванням, спробуйте знову після перезавантаження сторінки");
          window.location.reload();
        }
      })
  }

  render() {
    // const { firebase } = this.props;
    // const uiConfig = {
    //   signInFlow: 'popup',
    //   signInOptions: [{
    //     provider: this.props.firebase.getGoogleProviderID(),
    //     scopes: [
    //       "https://www.googleapis.com/auth/gmail.readonly"
    //     ]
    //   }],
    //   callbacks: {
    //     signInSuccessWithAuthResult: () => false
    //   }
    // }

    return(
      <div className = "table-pareser">
        <div className = "table-parser-container">
          <div className = "table-parser-header">
            <h3>Сторінка для завантаження показників з електронної скриньки у форматі xlsx</h3>
          </div>
          {
            this.state.isGapiReady ? 
              this.state.isSignedIn ?
                this.state.user === "watercounters@gmail.com" ? 
                  <MuiPickersUtilsProvider utils = {DateFnsUtils}>
                    <Grid container justify = "space-around">
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        label="З (включно)"
                        value={this.state.dateFrom}
                        onChange={date => this.setState({
                          dateFrom: date
                        })}
                        maxDate={this.state.dateTo}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      <KeyboardDatePicker
                        disableToolbar
                        margin="normal"
                        variant="inline"
                        label="По (включно)"
                        format="dd/MM/yyyy"
                        value={this.state.dateTo}
                        onChange={date => this.setState({
                          dateTo: date
                        })}
                        minDate={this.state.dateFrom}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      <Button className = "table-parser-button" onClick = {this.getMessages}>
                        <FontAwesomeIcon className = "table-parser-button-icon" icon = {faFileExcel} />
                        <div>Сформувати ексель файл</div>
                      </Button>
                    </Grid>
                  </MuiPickersUtilsProvider>
                :
                  <div className = "table-parser-action-tooltip">
                    <div>Вам потрібно залогінитись під спеціальним аккаунтом, щоб мати доступ до цієї функції</div>
                    <Button className = "table-parser-button" onClick = {e => {
                      this.handleSignOut();
                      this.handleSignIn();
                    }}>
                      <LockOpenIcon className = "table-parser-button-icon" />
                      <div>Змінити аккаунт</div>
                    </Button>
                  </div>
              :
                <div className = "table-parser-action-tooltip">
                  <div>
                    Вам потрібно увійти до облікового запису Google
                  </div>
                  <Button className = "table-parser-button" onClick = {this.handleSignIn}>
                    <FontAwesomeIcon className = "table-parser-button-icon" icon = {faGoogle} />
                    <div>Увійти</div>
                  </Button>
                </div>
            :
              <div>
                Будь ласка, зачекайте доки Google API інітіалізується...
              </div>
          }
        </div>
      </div>
    )
  }
}