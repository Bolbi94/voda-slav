import React from 'react';
import { Grid, TextField, Typography, Paper, InputLabel, Select, MenuItem, FormControl, InputAdornment } from '@material-ui/core';
import { Whatshot } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: "16px",
  },
  iconHot: {
    color: "red",
  },
  iconCold: {
    color: "blue",
  }
}));

const DateNow = new Date();
const MonthsSet = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];
const MaxReadingIncrease = 100;

const buildInitialObj = (countersData) => {
  let initialObj = {};
  Object.values(countersData).forEach(arr => {
    if(typeof(arr) !== "object") {
      arr.forEach(counter => {
        initialObj[counter.dbName] = undefined;
      });
    }
  });
  initialObj.Month = DateNow.getDate() > 19 ? 
    MonthsSet[DateNow.getMonth()] : MonthsSet[DateNow.getMonth() - 1];
  return initialObj
}

export default function ReadingsData(props) {
  const classes = useStyles();
  
  const [formData, setFormData] = React.useState(
    props.readingsData ? props.readingsData : buildInitialObj(props.countersData)
  );
  const [errorData, setErrorData] = React.useState(
    {
      showError: {}, 
      errorMessage: {},
    }
  );
  const handleChange = e => {
    let field = e.target.name, value = e.target.value;
    if(errorData.showError[field]) 
      checkValidity(e);
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  const checkValidity = e => {
    let field = e.target.name, value = e.target.value;
    let lastReading = +props.countersData.originalObj[field].LastReading;
    let newReading = +value;
    let newErrorData = {...errorData};
    if(value.length === 0) {
      newErrorData.showError[field] = false;
      newErrorData.errorMessage[field] = "";
    } else if(!isNaN(lastReading)) {
      if(isNaN(newReading)) {
        newErrorData.showError[field] = true;
        newErrorData.errorMessage[field] = "Неправильний формат";
      } else {
        if(lastReading > newReading) {
          newErrorData.showError[field] = true;
          newErrorData.errorMessage[field] = "Менше, ніж за минулий місяць";
        } else if(lastReading + MaxReadingIncrease < newReading) {
          newErrorData.showError[field] = true;
          newErrorData.errorMessage[field] = "Занадто велике значення";
        } else {
          newErrorData.showError[field] = false;
          newErrorData.errorMessage[field] = "";
        }
      }
    }
    setErrorData(newErrorData);
  }

  React.useState(() => {
    if(Object.values(errorData.showError).includes(true)) {
      props.onChange(null)
    } else {
      props.onChange(formData);
    }
  }, [formData])

  return(
    <React.Fragment>
      <Grid container spacing = {6}>
        {
          props.countersData && Object.keys(props.countersData).map(countersPlace => {
            if(countersPlace === "special") {
              if(props.countersData[countersPlace].length > 0) {
                return(
                  <Grid item xs = {12}>
                    <Grid container spacing = {3}>
                      {
                        props.countersData[countersPlace].map(counter => 
                          <Grid item xs = {6}>
                            <Typography variant = "h6">{counter.Type}</Typography>
                            <Grid container spacing = {1}>
                              <Grid item className = {classes.iconContainer}>
                                <Whatshot 
                                  fontSize = "large" 
                                  className = {
                                    counter.dbName.toLowerCase().includes("hot") ? 
                                    classes.iconHot : 
                                    counter.dbName.toLowerCase().includes("cold") ? 
                                    classes.iconCold :
                                    ""
                                  } 
                                />  
                              </Grid>
                              <Grid item xs>
                                <TextField
                                  type="number"
                                  id={counter.dbName}
                                  name={counter.dbName}
                                  label={counter.Type}
                                  value={formData[counter.dbName]}
                                  onChange={handleChange}
                                  onBlur={checkValidity}
                                  fullWidth
                                  InputProps={{
                                    inputProps: {
                                      min: +props.countersData.originalObj[counter.dbName].LastReading, 
                                      max: +props.countersData.originalObj[counter.dbName].LastReading + MaxReadingIncrease,
                                    },
                                    endAdornment: <InputAdornment position="end">куб. м</InputAdornment>,
                                  }}
                                  error={errorData.showError[counter.dbName]}
                                  helperText={errorData.errorMessage[counter.dbName]}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                      }
                    </Grid>
                  </Grid>
                )
              }
            } else if(countersPlace !== "originalObj") {
              return (
                <Grid item xs = {12}>
                  <Typography variant = "h6">{countersPlace}</Typography>
                  <Grid container spacing = {3}>
                    {
                      props.countersData[countersPlace].map(counter => 
                        <Grid item xs = {6}>
                          <Grid container spacing = {1}>
                            <Grid item className = {classes.iconContainer}>
                              <Whatshot 
                                fontSize = "large" 
                                className = {
                                  counter.dbName.toLowerCase().includes("hot") ? 
                                  classes.iconHot : 
                                  counter.dbName.toLowerCase().includes("cold") ? 
                                  classes.iconCold :
                                  ""
                                } 
                              />  
                            </Grid>
                            <Grid item xs>
                              <TextField 
                                type="number"
                                id={counter.dbName}
                                name={counter.dbName}
                                label={counter.Type}
                                value={formData[counter.dbName]}
                                onChange={handleChange}
                                onBlur={checkValidity}
                                fullWidth
                                InputProps={{
                                  inputProps: {
                                    min: +props.countersData.originalObj[counter.dbName].LastReading, 
                                    max: +props.countersData.originalObj[counter.dbName].LastReading + MaxReadingIncrease,
                                  },
                                  endAdornment: <InputAdornment position="end">куб. м</InputAdornment>,
                                }}
                                error={errorData.showError[counter.dbName]}
                                helperText={errorData.errorMessage[counter.dbName]}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )
                    }
                  </Grid>
                </Grid>
              )
            }
          })
        }
        <Grid item xs = {12}>
          <Typography variant = "h6">
            {"За який місяць"}
          </Typography>
          <Select
            id = "Month"
            name = "Month"
            value = {formData.Month}
            onChange = {handleChange}
            fullWidth
          >
            {
              MonthsSet.map((month, i) => 
                <MenuItem 
                  key = {month}
                  disabled = {DateNow.getMonth() -1 > i || DateNow.getMonth() < i} 
                  value = {month}>
                    {month}
                </MenuItem>
              )
            }
          </Select>
        </Grid>
        <Grid item xs = {12}>
        <Typography variant = "subtitle1">
          {"Незаповнені показники будуть вважатися рівніми попередньому місяцю"}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}