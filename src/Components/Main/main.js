import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useLocation, useParams } from "react-router-dom";
import Header from './header';
import CountersSend from './counters-send';
import Profile from './profile';
import HistoryCounters from './history-counters-old';
import HistoryPay from './history-pay';
//import * as XLSXInterface from '../XlSXWorker/read-xlsx';
import HomePage from './home';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Home from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomePageUnauthorized from './HomeUnauthorized/home-unauthorized';

import './main.css';

const TABS = [
  "Домашня сторінка",
  "Профіль",
  "Лічильники",
  "Архів показань",
  "Архів платежів",
  "Вийти"
]

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,

      
      account: undefined, 
      accountName: undefined,
      accountAddress: undefined,
      accountCounters: [],
      accountAccruals: undefined
    }
  }

  setTestAccount = () => {
    this.setState({
      account: "1110030010",
      accountName: {
        Surname: "ДУШЕНОК",
        Name: "МАРИНА",
        FName: "ВЛАДИМИРОВНА",
      },
      accountAddress: {
        Street: "ТАЛЛIНСЬКИЙ",
        House: "3",
        Flat: "10",
      },
      accountCounters: [
        {
          type: "BathCold",
          ID: "280335",
          LastReading: "301",
          LastReadingsDate: "5November2020",
          LastReadingsMonthFor: "Жовтень",
          Name: "ХВС Ванна"
        },
        {
          type: "BathHot",
          ID: "51774",
          LastReading: "104",
          LastReadingsDate: "5November2020",
          LastReadingsMonthFor: "Жовтень",
          Name: "ГВС Ванна"
        }
      ],
      accountAccruals: {
        Accrued: "278.88",
        Debt: "278.88",
        Paid: "0.00"
      }
    })
  }

  componentDidMount() {
    // this.setTestAccount();
    // TODO
    // this.getAccountDetails()
  }
  // TODO
  // account value shoud come from props
  // account uses for fetching data from firestore and fill other account onfo
  // getAccountDetails = () => {

  // }

  renderTabPage = () => {
    switch(this.state.activeTab) {
      case 0:
        return (<HomePage />);
        // return(<CountersSend />);
      case 1:
        return (<Profile />);
      case 3:
        return (<HistoryCounters />);
      case 4:
        return (<HistoryPay />);
    }
  }

  render() {
    return(
      this.state.account ?
      <div className = "main">
         <Header />
         <div className = "main-tabs">
          <Tabs indicatorColor = "primary" textColor = "primary" value = {this.state.activeTab} onChange = {(e, newValue) => this.setState({activeTab: newValue})}>
            <Tab icon = {<Home />} />
            <Tab label = {TABS[1]} disabled />
            <Tab label = {TABS[2]} disabled />
            <Tab label = {TABS[3]} />
            <Tab label = {TABS[4]} />
            <Tab label = {<ExitToAppIcon />} disabled />
          </Tabs>
         </div>
         
         <div className = "main-tab-page">
           {
             this.renderTabPage()
           }
         </div>
      </div>
      :
      <div className = "main">
        <Header />
        <div className = "main-tab-page">
          <HomePageUnauthorized firebase = {this.props.firebase} />
        </div>
      </div>
    )
  }

  // render() {
  //   return(
  //     <div className = "main">
  //        <Header />
  //        {/* <input type = 'file' onChange = { e => XLSXInterface.ReadXLSX(e.target.files[0])}></input>
  //        <XLSXInterface.WriteXLS /> */}
  //        <div className = "main-tabs">
  //          <div className = {this.state.activeTab === 0 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 0})}}>{TABS[0]}</div>
  //          <div className = {this.state.activeTab === 1 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 1})}}>{TABS[1]}</div>
  //          <div className = {this.state.activeTab === 2 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 2})}}>{TABS[2]}</div>
  //          <div className = {this.state.activeTab === 3 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 3})}}>{TABS[3]}</div>
  //        </div>
  //        <div className = "main-tab-page">
  //         {
  //           this.renderTabPage()
  //         }
  //        </div>
  //     </div>
  //   )
  // }
}