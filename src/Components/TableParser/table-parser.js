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
import 'core-js/features/promise';

const API_KEY = "AIzaSyBrbNMXwOrljm_EJyxWWY8Fx_2YQdkeqto";

const CounterReadingsMails = [
  "mobile.user.office@gmail.com", // domovichek
  "y.klinkoff@gmail.com", //yura klinkov
];

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
    // this.initGapi();
    window.gapi.load('client', this.initGapi);
  }

  // initGapi = () => {const script = document.createElement("script");
  //   script.onload = () => {
  //     // Gapi isn't available immediately so we have to wait until it is to use gapi.
  //     this.loadClientWhenGapiReady(script);
  //   };
  //   script.src = "https://apis.google.com/js/client.js";
    
  //   document.body.appendChild(script);
  // }

  // loadClientWhenGapiReady = (script) => {
  //   if(script.getAttribute('gapi_processed')){
  //     window.gapi.client.init({
  //       apiKey: API_KEY,
  //       clientId: "447205832578-qa26mmfh3lmvokcosq4mlmh42oepitmk.apps.googleusercontent.com",
  //       discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
  //       scope: "https://www.googleapis.com/auth/gmail.readonly"
  //     }).then(() => {
  //       this.setState({
  //         isGapiReady: true
  //       })
  //       this.handleSignIn();
  //     })
  //   }
  //   else{
  //     setTimeout(() => {
  //       this.loadClientWhenGapiReady(script)
  //     }, 100);
  //   }
  // }

  initGapi = () => {
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

  getMessages = () => {
    // console.log("getMessages() start");
    let query = {
      userId: "me",
      q: `{from:${CounterReadingsMails.join(" from:")}} after:${getUnixTime(this.state.dateFrom)} before:${getUnixTime(this.state.dateTo)}`, // it is also possible to use date format like YYYY/MM/DD
    };
    let getMessagesList = (callback) => {
      let retrievePageOfMails = (request, result) => {
        request.execute(resp => {
          result = result.concat(resp.result.messages);
          let nextPageToken = resp.nextPageToken;
          if(nextPageToken) {
            request = window.gapi.client.gmail.users.messages.list({
              ...query,
              pageToken: nextPageToken,
            });
            retrievePageOfMails(request, result);
          } else {
            callback(result);
          }
        });
      };
      let initialRequest = window.gapi.client.gmail.users.messages.list({...query});
      retrievePageOfMails(initialRequest, []);
    };
    let collectMessagesData = (messagesList) => {
      console.log("collectMessagesData() start", messagesList);
      let readings = [];
      let failedMessagesIds = [];
      let messagesCounter = 0;
      const BatchSize = 100;
      let collectDataFromMessageBatch = (batchIteration = 0) => {
        console.log(`collectDataFromMessageBatch(), iteration ${batchIteration} (${messagesList.length} items)`);
        let messagesBatch = [...messagesList.slice(batchIteration * BatchSize, (batchIteration + 1) * BatchSize)];
        messagesBatch.forEach(message => {
          window.gapi.client.gmail.users.messages.get({
            userId: "me",
            id: message.id,
          }).then(
            response => {
              ++messagesCounter;
              let messageBody = response.result.payload.body.data;
              if(messageBody) {
                // console.log("OK list", message, response.result);
                let encodedMessage = base64url.decode(messageBody);
                let reading;
                if(encodedMessage.indexOf("##") > -1) {
                  let jsonString = encodedMessage.substring(encodedMessage.indexOf("##") + 2);
                  // console.log("encoded message", jsonString);
                  let jsonObj = JSON.parse(jsonString);
                  reading = this.convertDomovichekMessageObjToReading(jsonObj);
                  readings.push(reading);
                } else {
                  reading = this.parseKlinkoffMessage(encodedMessage);
                  readings.push(reading);
                }
              } else {
                console.log("empty body, try to check parts", message, response.result);
                let messageParts = response.result.payload.parts[0];
                if(messageParts) {
                  let messageBody = messageParts.body.data;
                  if(messageBody) {
                    // console.log("OK list", message, response.result);
                    let encodedMessage = base64url.decode(messageBody);
                    let reading;
                    if(encodedMessage.indexOf("##") > -1) {
                      let jsonString = encodedMessage.substring(encodedMessage.indexOf("##") + 12);
                      // console.log("encoded message", jsonString);
                      let jsonObj = JSON.parse(jsonString);
                      // console.log("encoded message", jsonString,  jsonObj);
                      reading = this.convertNewDomovichekMessageObjToReading(jsonObj);
                      readings.push(reading);
                    } else {
                      reading = this.parseNewKlinkoffMessage(encodedMessage);
                      readings.push(reading);
                    }
                  } else {
                    console.log("empty list", message, response.result);
                  }
                } else {
                  console.log("empty list", message, response.result);
                }
              }
              if(messagesCounter === batchIteration * BatchSize + messagesBatch.length) {
                if(messagesCounter < messagesList.length) {
                  collectDataFromMessageBatch(++batchIteration);
                } else {
                  console.log("collectMessagesData() finish", readings);
                  if(failedMessagesIds.length > 0) {
                    // handleFailedMessages(failedMessagesIds);
                    console.log("waiting 10s and try to retrieve failed messages");
                    setTimeout(handleFailedMessages, 1000 * 10, failedMessagesIds);
                  } else {
                    this.exportToExcel(readings);
                  }
                }
              }
            },
            err => {
              ++messagesCounter;
              console.log("Failed to retrive message", message, err);
              failedMessagesIds.push(message.id);
              if(messagesCounter === batchIteration * BatchSize + messagesBatch.length) {
                if(messagesCounter < messagesList.length) {
                  collectDataFromMessageBatch(++batchIteration);
                } else {
                  // handleFailedMessages(failedMessagesIds);
                  console.log("waiting 10s and try to retrieve failed messages");
                  setTimeout(handleFailedMessages, 1000 * 10, failedMessagesIds);
                  // this.exportToExcel(readings);
                }
              }
            }
          );
        });
      }

      let handleFailedMessages = (failedMessagesIds) => {
        const TryIterationsLimit = 3;
        let tryIteration = 0;
        let tryRetrieveFailedMessages = (failedMessagesIds) => {
          console.log("tryRetrieveFailedMessages()", tryIteration, failedMessagesIds);
          let messagesIdsList = [...failedMessagesIds];
          let newFailedMessagesIds = [];
          let messagesCounter = 0;
          const BatchSize = 200;
          let collectDataFromMessageBatch = (batchIteration = 0) => {
            console.log(`collectDataFromMessageBatch(), iteration ${batchIteration} (${failedMessagesIds.length} items)`);
            let messagesIdsBatch = [...messagesIdsList.slice(batchIteration * BatchSize, (batchIteration + 1) * BatchSize)];
            messagesIdsBatch.forEach(messageId => {
              window.gapi.client.gmail.users.messages.get({
                userId: "me",
                id: messageId,
              }).then(
                response => {
                  ++messagesCounter;
                  let messageBody = response.result.payload.body.data;
                  // if(messageBody) {
                  //   let encodedMessage = base64url.decode(messageBody);
                  //   let reading;
                  //   if(encodedMessage.indexOf("##") > -1) {
                  //     let jsonString = encodedMessage.substring(encodedMessage.indexOf("##") + 2);
                  //     let jsonObj = JSON.parse(jsonString);
                  //     reading = this.convertDomovichekMessageObjToReading(jsonObj);
                  //     readings.push(reading);
                  //   } else {
                  //     reading = this.parseKlinkoffMessage(encodedMessage);
                  //     readings.push(reading);
                  //   }
                  // }
                  if(messageBody) {
                    // console.log("OK list", message, response.result);
                    let encodedMessage = base64url.decode(messageBody);
                    let reading;
                    if(encodedMessage.indexOf("##") > -1) {
                      let jsonString = encodedMessage.substring(encodedMessage.indexOf("##") + 2);
                      // console.log("encoded message", jsonString);
                      let jsonObj = JSON.parse(jsonString);
                      reading = this.convertDomovichekMessageObjToReading(jsonObj);
                      readings.push(reading);
                    } else {
                      reading = this.parseKlinkoffMessage(encodedMessage);
                      readings.push(reading);
                    }
                  } else {
                    console.log("empty body, try to check parts", messageId, response.result);
                    let messageParts = response.result.payload.parts[0];
                    if(messageParts) {
                      let messageBody = messageParts.body.data;
                      if(messageBody) {
                        // console.log("OK list", message, response.result);
                        let encodedMessage = base64url.decode(messageBody);
                        let reading;
                        if(encodedMessage.indexOf("##") > -1) {
                          let jsonString = encodedMessage.substring(encodedMessage.indexOf("##") + 12);
                          // console.log("encoded message", jsonString);
                          let jsonObj = JSON.parse(jsonString);
                          // console.log("encoded message", jsonString,  jsonObj);
                          reading = this.convertNewDomovichekMessageObjToReading(jsonObj);
                          readings.push(reading);
                        } else {
                          reading = this.parseNewKlinkoffMessage(encodedMessage);
                          readings.push(reading);
                        }
                      } else {
                        console.log("empty list", messageId, response.result);
                      }
                    } else {
                      console.log("empty list", messageId, response.result);
                    }
                  }
                  if(messagesCounter === batchIteration * BatchSize + messagesIdsBatch.length) {
                    if(messagesCounter < messagesIdsList.length) {
                      collectDataFromMessageBatch(++batchIteration);
                    } else {
                      if(newFailedMessagesIds.length > 0) {
                        if(++tryIteration < TryIterationsLimit) {
                          console.log(`waiting 10s and try to retrieve failed messages, iteration ${tryIteration}`);
                          setTimeout(tryRetrieveFailedMessages, 1000 * 10, newFailedMessagesIds);
                          // tryRetrieveFailedMessages(newFailedMessagesIds);
                        } else {
                          window.alert("failed retrive messages, pls reload page and try again");
                          // this.exportToExcel(readings);
                        }
                      } else {
                        this.exportToExcel(readings);
                      }
                    }
                  }
                }, err => {
                  ++messagesCounter;
                  console.log("Failed to retrive message", messageId, err);
                  newFailedMessagesIds.push(messageId);
                  if(messagesCounter === batchIteration * BatchSize + messagesIdsBatch.length) {
                    if(messagesCounter < messagesIdsList.length) {
                      collectDataFromMessageBatch(++batchIteration);
                    } else {
                      if(++tryIteration < TryIterationsLimit) {
                        console.log(`waiting 10s and try to retrieve failed messages, iteration ${tryIteration}`);
                        setTimeout(tryRetrieveFailedMessages, 1000 * 10, newFailedMessagesIds);
                        // tryRetrieveFailedMessages(newFailedMessagesIds);
                      } else {
                        window.alert("failed retrive messages, pls reload page and try again");
                        // this.exportToExcel(readings);
                      }
                    }
                  }
                }
              )
            })
          }

          collectDataFromMessageBatch();
        }

        tryRetrieveFailedMessages(failedMessagesIds);
      }

      collectDataFromMessageBatch();
    }

    getMessagesList(collectMessagesData);
  }

  parseNewKlinkoffMessage = (message) => {
    const domovichekKlinkoffDictionary = {
      "ваше ім'я": "Sender",
      "особистий рахунок": "AccountID",
      "дата заповнення форми": "Sent",
      "за який місяць": "Month",
      "номер телефону": "Phone",
      "кухня (холодна)": "KitchenColdValue",
      "кухня (гаряча)": "KitchenHotValue",
      "туалет (холодна)": "ToiletColdValue",
      "туалет (гаряча)": "ToiletHotValue",
      "ванна (холодна)": "BathColdValue",
      "ванна (гаряча)": "BathHotValue",
      "полив": "Watering",
      "додаткові дані": "Notes",
      "адреса": "Address",
      "e-mail": "Email"
    };

    let readingsObj = {};

    const formData = message.split('\r\n\t* \r\n\r\n');
    if (formData?.length > 4) {
      const readingsFormData = formData.slice(1, -3);
      readingsFormData.forEach(r => {
        let readingKeyValueArray = r.split('\r\n\r\n');
        if (readingKeyValueArray?.length === 2) {
          let key = readingKeyValueArray[0].toLocaleLowerCase();
          readingsObj[domovichekKlinkoffDictionary[key]] = readingKeyValueArray[1];
        } else {
          console.log('unexpected form row', message, formData, r);
        };
      });
    } else {
      console.log("failed parsing new Klinkoff message", message, formData);
    };

    return readingsObj;
  }

  parseKlinkoffMessage = (message) => {
    const domovichekKlinkoffDictionary = {
      "Прізвище та ім'я": "Sender",
      "Особовий рахунок": "AccountID",
      "Дата заповнення форми": "Sent",
      "За який місяць": "Month",
      "Номер телефону": "Phone",
      "Кухня (холодна)": "KitchenColdValue",
      "Кухня (гаряча)": "KitchenHotValue",
      "Туалет (холодна)": "ToiletColdValue",
      "Туалет (гаряча)": "ToiletHotValue",
      "Ванна (холодна)": "BathColdValue",
      "Ванна (гаряча)": "BathHotValue",
      "Полив": "Watering",
    }
    
    let parceTable = (tableLayout) => {
      let headerArr = [], valueArr = [];
      let HeaderTagOpen = `<dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">`, HeaderTagClose = `</dt>`;
      let ValueTagOpen = `<dd style="margin: 4px 4px 16px 4px;">`, ValueTagClose = `</dd>`;
      let i = 0, j = 0, iterationLimit = 20;
      while(tableLayout.indexOf(HeaderTagOpen, i) > -1) {
        i = tableLayout.indexOf(HeaderTagOpen, i) + HeaderTagOpen.length;
        j = tableLayout.indexOf(HeaderTagClose, i);
        headerArr.push(tableLayout.slice(i, j));
        if(--iterationLimit < 1)
          break;
      };
      i = 0; j = 0; iterationLimit = 20;
      while(tableLayout.indexOf(ValueTagOpen, i) > -1) {
        i = tableLayout.indexOf(ValueTagOpen, i) + ValueTagOpen.length;
        j = tableLayout.indexOf(ValueTagClose, i);
        valueArr.push(tableLayout.slice(i, j));
        if(--iterationLimit < 1)
          break;
      }

      let reading = {}

      headerArr.forEach((header, i) => {
        let key = domovichekKlinkoffDictionary[header];
        if(key)
          reading[key] = valueArr[i];
      });

      return reading;
    }

    let tableLayout = message.substring(message.indexOf("<dl>"), message.indexOf("</dl>"));
    let reading = parceTable(tableLayout);

    return reading;
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

  convertNewDomovichekMessageObjToReading = (jsonObj) => {
    let reading = {
      Sender: jsonObj.senderFio,
      AccountID: jsonObj.senderAccount,
      Sent: jsonObj.sendingDate,
      // Month: jsonObj.month,
      Phone: jsonObj.senderPhone,
      KitchenColdValue: jsonObj.counters.kitchenCold,
      KitchenHotValue: jsonObj.counters.kitchenHot,
      BathColdValue: jsonObj.counters.bathCold,
      BathHotValue: jsonObj.counters.bathHot,
      Reverse: jsonObj.counters.sewage,
      Watering: jsonObj.counters.watering,
      Notes: jsonObj.counters.notes,
    }
    return reading;
  }

  exportToExcel = (data) => {
    let worksheet = XLSX.utils.json_to_sheet(data);
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "sheet");
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