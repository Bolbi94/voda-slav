import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useLocation, useParams } from "react-router-dom";
import Header from './header';
import CountersSend from './counters-send';
import Profile from './profile';
import HistoryCounters from './history-counters-old';
import HistoryPay from './history-pay';
import * as XLSXInterface from '../XlSXWorker/read-xlsx';

import './main.css';

const TABS = [
  "Передати показання",
  "Профіль",
  "Архів показань",
  "Архів платежів"
]

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0
    }
  }

  // componentDidMount() {
  //   XLSXInterface.ReadXLSX();
  // }

  renderTabPage = () => {
    switch(this.state.activeTab) {
      case 0:
        return(<CountersSend />);
      case 1:
        return (<Profile />);
      case 2:
        return (<HistoryCounters />);
      case 3:
        return (<HistoryPay />);
    }
  }

  render() {
    return(
      <div className = "main">
         <Header />
         {/* <input type = 'file' onChange = { e => XLSXInterface.ReadXLSX(e.target.files[0])}></input>
         <XLSXInterface.WriteXLS /> */}
         <div className = "main-tabs">
           <div className = {this.state.activeTab === 0 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 0})}}>{TABS[0]}</div>
           <div className = {this.state.activeTab === 1 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 1})}}>{TABS[1]}</div>
           <div className = {this.state.activeTab === 2 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 2})}}>{TABS[2]}</div>
           <div className = {this.state.activeTab === 3 ? "main-tabs-link-active" : "main-tabs-link"} onClick = {() => {this.setState({activeTab: 3})}}>{TABS[3]}</div>
         </div>
         <div className = "main-tab-page">
          {
            this.renderTabPage()
          }
         </div>
      </div>
    )
  }
}