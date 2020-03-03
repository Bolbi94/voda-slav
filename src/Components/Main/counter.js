import React from 'react';
import CounterCold from './counter-cold.png';
import CounterHot from './counter-hot.png';

import './counter.css';

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentReadings: ''
    }
  }

  handleReadingsChange = (e) => {
    this.setState({
      currentReadings: e.target.value
    })
  }

  render() {
    return(
      <div className = "counter">
        <div className = "counter-image">
          <img src = {this.props.type === 'hot' ? CounterHot : CounterCold} />
        </div>
        <div className = "counter-description">
          <div className = "counter-description-row">
            <span className = "counter-description-row-title">Розташування</span>
            <span className = "counter-description-row-value">{`${this.props.location}`}</span>
          </div>
          <div className = "counter-description-row">
            <span className = "counter-description-row-title">Номер лічильника</span>
            <span className = "counter-description-row-value">{`${this.props.serialNumber}`}</span>
          </div>
          <div className = "counter-description-row">
            <span className = "counter-description-row-title">Минулий показник</span>
            <span className = "counter-description-row-value">{`${this.props.lastReadings}`}</span>
          </div>
          <div className = "counter-description-row">
            <span className = "counter-description-row-title">Новий показник</span>
            <input className = "counter-description-row-value" value = {this.state.currentReadings} onChange = {this.handleReadingsChange}></input>
          </div>
        </div>
      </div>
    )
  }
}