import React from 'react';
import Counter from './counter';

import './counters-send.css';

export default class CountersSend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return(
      <div className = "main-counters-send">
        <div className = 'main-counters-send-cold-column'>
          <Counter type = 'cold' serialNumber = '111111' location = 'Ванна ХВС' lastReadings = '220' />
          <Counter type = 'cold' serialNumber = '333333' location = 'Кухня ХВС' lastReadings = '165' />
          <Counter type = 'cold' serialNumber = '555555' location = 'Полив ХВС' lastReadings = '119' />
        </div>
        <div className = 'main-counters-send-hot-column'>
          <Counter type = 'hot' serialNumber = '222222' location = 'Ванна ГВС' lastReadings = '178' />
          <Counter type = 'hot' serialNumber = '444444' location = 'Кухня ГВС' lastReadings = '113' />
        </div>
      </div>
    )
  }
}