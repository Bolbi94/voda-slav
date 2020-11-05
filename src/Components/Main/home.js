import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { GeneralTile, CounterTile } from './home-block';
import './home.css';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }
  }

  handleCounterValueChange = (data) => {
    console.log(data);
  }

  render() {
    const GeneralTiles = [
      {
        Type: "CurrentPay",
        Title: "До оплати",
        NewPay: "100",
        Debt: "200"
      },
      {
        Type: "LastReadings",
        Title: "Останні показання",
        TitleLink: "",
        LastReading: {
          date: "28-02-2020",
          cold: "10.1",
          coldText: "Холодна вода",
          hot: "5.5",
          hotText: "Гаряча вода"
        },
        PreLastReading: {
          date: "25-01-2020",
          cold: "11.5",
          coldText: "Холодна вода",
          hot: "5.4",
          hotText: "Гаряча вода"
        }
      },
      {
        Type: "PersonalInfo",
        Title: "Особисті дані",
        TitleLink: "",
        Name: "Шановний",
        Address: "дім",
        Phone: "088-888-88-88",
        Email: "kek@kek.org"
      }
    ];
    const CountersTiles = [
      {
        Type: "cold",
        Title: "Туалет Холодна",
        SerialNumber: "1",
        LastReading: {
          date: "28-02-2020",
          value: "314"
        },
        CurrentReading: "314",
        CurrentReadingChangeHandler: this.handleCounterValueChange
      },
      {
        Type: "hot",
        Title: "Туалет Гаряча",
        SerialNumber: "2",
        LastReading: {
          date: "28-02-2020",
          value: "132"
        },
        CurrentReading: "132",
        CurrentReadingChangeHandler: this.handleCounterValueChange
      },
      {
        Type: "cold",
        Title: "Кухня Холодна",
        SerialNumber: "3",
        LastReading: {
          date: "28-02-2020",
          value: "314"
        },
        CurrentReading: "314",
        CurrentReadingChangeHandler: this.handleCounterValueChange
      },
      {
        Type: "hot",
        Title: "Кухня Гаряча",
        SerialNumber: "4",
        LastReading: {
          date: "28-02-2020",
          value: "132"
        },
        CurrentReading: "132",
        CurrentReadingChangeHandler: this.handleCounterValueChange
      },
      {
        Type: "cold",
        Title: "Туалет Холодна",
        SerialNumber: "1",
        LastReading: {
          date: "28-02-2020",
          value: "314"
        },
        CurrentReading: "314",
        CurrentReadingChangeHandler: this.handleCounterValueChange
      },
      {
        Type: "hot",
        Title: "Туалет Гаряча",
        SerialNumber: "2",
        LastReading: {
          date: "28-02-2020",
          value: "132"
        },
        CurrentReading: "132",
        CurrentReadingChangeHandler: this.handleCounterValueChange
      }
    ];

    return(
      <div className = "home">
        <div className = "home-header">
          <h2>{`Вітаємо, Шановний`}</h2>
        </div>
        <div className = "home-description">
          <span>{`Це Ваш персональний кабінет із особовим рахунком №1`}</span>
        </div>
        <div className = "home-grid-title">
          <h3>Загальна інформація</h3>
        </div>
        <Grid container spacing = {2} className = "home-grid">
          <Grid item xs = {12}>
            <Grid container justify = "flex-start" spacing = {5}>
              {
                GeneralTiles.map(tile => GeneralTile(tile))
              }
            </Grid>
          </Grid>
          {/* <Grid item></Grid> */}
        </Grid>
        <div className = "home-grid-title">
          <h3>Показники</h3>
        </div>
        <Grid container spacing = {2} className = "home-grid">
          <Grid item xs = {12}>
            <Grid container justify = "flex-start" spacing = {5}>
              {
                CountersTiles.map(tile => CounterTile(tile))
              }
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}