import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';


export function GeneralTile(tile) {
  switch(tile.Type) {
    case "CurrentPay":
      const data = {
        labels: [
          'Нарахування',
          'Борг'
        ],
        datasets:[{
          data: [tile.NewPay, tile.Debt],
          backgroundColor: ['#FFCE56', '#FF6384']
        }]
      }
      return(
        <Grid item>
          <Paper className = "home-block-paper">
            <div className = "home-block-paper-title">
              <span>{tile.Title}</span>
              <span></span>
            </div>
            <div className = "home-block-paper-body">
              <Doughnut data = {data} height = {200} options = {{legend: {position: "right", labels: {padding: 10, boxWidth: 20}}}} />
            </div>
          </Paper>
        </Grid>
      )
    case "LastReadings":
      return(
        <Grid item>
          <Paper className = "home-block-paper">
            <div className = "home-block-paper-title">
              <span>{tile.Title}</span>
              <a href = {tile.TitleLink}>Деталі</a>
            </div>
            <div className = "home-block-paper-body">
              <div className = "home-block-paper-body-top">
                <div className = "home-block-paper-body-line">
                  {tile.LastReading.date}
                </div>
                <div className = "home-block-paper-body-line">
                  <div className = "home-block-paper-body-line-color-blue"></div>
                  <div className = "home-block-paper-body-line-value">
                    {tile.LastReading.cold}
                  </div>
                  <div className = "home-block-paper-body-line-text">
                    {tile.LastReading.coldText}
                  </div>
                </div>
                <div className = "home-block-paper-body-line">
                  <div className = "home-block-paper-body-line-color-red"></div>
                  <div className = "home-block-paper-body-line-value">
                    {tile.LastReading.hot}
                  </div>
                  <div className = "home-block-paper-body-line-text">
                    {tile.LastReading.hotText}
                  </div>
                </div>
              </div>
              <div className = "home-block-paper-body-bottom">
                <div className = "home-block-paper-body-line">
                  {tile.PreLastReading.date}
                </div>
                <div className = "home-block-paper-body-line">
                  <div className = "home-block-paper-body-line-color-blue"></div>
                  <div className = "home-block-paper-body-line-value">
                    {tile.PreLastReading.cold}
                  </div>
                  <div className = "home-block-paper-body-line-text">
                    {tile.PreLastReading.coldText}
                  </div>
                </div>
                <div className = "home-block-paper-body-line">
                  <div className = "home-block-paper-body-line-color-red"></div>
                  <div className = "home-block-paper-body-line-value">
                    {tile.PreLastReading.hot}
                  </div>
                  <div className = "home-block-paper-body-line-text">
                    {tile.PreLastReading.hotText}
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        </Grid>
      )
    case "PersonalInfo":
      return(
        <Grid item>
          <Paper className = "home-block-paper">
            <div className = "home-block-paper-title">
              <span>{tile.Title}</span>
              <a href = {tile.TitleLink}>Редагувати</a>
            </div>
            <div className = "home-block-paper-body">
              <div className = "home-block-paper-body-line">
                {`Ім'я: ${tile.Name}`}
              </div>
              <div className = "home-block-paper-body-line">
                {`Адреса: ${tile.Address}`}
              </div>
              <div className = "home-block-paper-body-line">
                {`Телефон: ${tile.Phone}`}
              </div>
              <div className = "home-block-paper-body-line">
                {`Імейл: ${tile.Email}`}
              </div>
            </div>
          </Paper>
        </Grid>
      )
  }
}

export function CounterTile(tile) {
  return(
    <Grid item>
      <Paper className = "home-block-paper">
        <div className = "home-block-paper-title">
          <div className = "home-block-paper-title-counter">
            <FontAwesomeIcon className = {tile.Type === "cold" ? "home-block-paper-title-icon-blue" : "home-block-paper-title-icon-red"} icon = {faFire} />
            {tile.Title}
          </div>
          <a href = {tile.TitleLink}>Деталі</a>
        </div>
        <div className = "home-block-paper-body">
          <div className = "home-block-paper-body-top">
            <div>Попередній показник:</div>
            <div className = "home-block-paper-body-line-counter">
              <div>
                {tile.LastReading.date}
              </div>
              <div>
                {tile.LastReading.value}
              </div>
            </div>
          </div>
          <div className = "home-block-paper-body-bottom">
            <TextField 
              label = "Новий показник" 
              // value = {tile.CurrentReading}
              className = "home-block-paper-body-counter-input"
              size = "medium"
              InputProps={{
                endAdornment: <InputAdornment position="end">куб. м.</InputAdornment>,
              }}
              // endAdornment = {<InputAdornment position = "end"><p>м<sup>3</sup></p></InputAdornment>}
            />
          </div>
        </div>
      </Paper>
    </Grid>
  )
}