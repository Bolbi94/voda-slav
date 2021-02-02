import React from 'react';
import { Grid, TextField, Typography, Paper, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  
}));

const StreetSet = [
  "Таллiнський", 
  "Ризький", 
  "Вiльнюський", 
  "Київський", 
  "Єреванський", 
  "Бакинський", 
  "Тбiлiський", 
  "Белгородський", 
  "Невський", 
  "Печерський", 
  "Московський", 
  "Чернiгiвський", 
  "пр-т Дружби народiв", 
  "Добринiнський", 
  "Студентська", 
  "Майбутнього", 
  "Молодiжний", 
  "Вiйськ. будивельникiв",
];
const NoFlatStreetSet = [
  "Студентська", 
  "Майбутнього", 
  "Молодiжний",
]

// function checkInput(input, value) {
//   switch(input) {
//     case "Account":
//     case "Surname":
//     case "Name":
//     case "FName":
//     case "Street":
//     case "House":
//       return value ? false : true;
//     case "Flat":
//       return false;
//     default:
//       return false;
//   }
// }

export default function ContactData(props) {
  console.log("ContactData", props)
  const classes = useStyles();

  const [formData, setFormData] = React.useState(props.contactData ? props.contactData : {
    Account: '1212123434',
    Surname: 'asd',
    Name: 'asd',
    FName: 'asd',
    Street: 'Таллiнський',
    House: '4',
    Flat: '4',
  });
  // const [formData, setFormData] = React.useState(props.contactData ? props.contactData : {
  //   Account: '',
  //   Surname: '',
  //   Name: '',
  //   FName: '',
  //   Street: '',
  //   House: '',
  //   Flat: '',
  // });
  const [errorData, setErrorData] = React.useState(
    {
      showError: {
        Account: false,
        Surname: false,
        Street: false,
        House: false,
        Flat: false,
      }, 
      errorMessage: {
        Account: "",
        Surname: "",
        Street: "",
        House: "",
        Flat: "",
      },
    }
  );

  const handleChange = e => {
    console.log("handleChange");
    let field = e.target.name, value = e.target.value;
    if(errorData.showError[field]) {
      let newErrorData = checkValidity(field, value, errorData);
      setErrorData(newErrorData);
    }
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleOnBlur = e => {
    console.log("handleOnBlur");
    let field = e.target.name, value = e.target.value;
    let newErrorData = checkValidity(field, value, errorData);
    setErrorData(newErrorData);
  }

  const checkValidity = (field, value, errorDataObj) => {
    console.log("checkValidity", errorData);
    let newErrorData = {
      showError: {...errorDataObj.showError},
      errorMessage: {...errorDataObj.errorMessage},
    };
    if(value.length > 0) {
      switch(field) {
        case "Account":
          let acc = value.replace(/\s/g, '');
          if(acc.length === 10 && !isNaN(+acc)) {
            newErrorData.showError[field] = false;
            newErrorData.errorMessage[field] = "";
          } else {
            newErrorData.showError[field] = true;
            newErrorData.errorMessage[field] = "Невірний формат";
          }
          break;
        case "House":
          let house = +value;
          if(isNaN(house) || house < 1) {
            newErrorData.showError[field] = true;
            newErrorData.errorMessage[field] = "Невірний формат";
          } else if(house > 118) {
            newErrorData.showError[field] = true;
            newErrorData.errorMessage[field] = "Занадто велике значення";
          } else {
            newErrorData.showError[field] = false;
            newErrorData.errorMessage[field] = "";
          }
          break;
        case "Street":
        case "Flat":
        case "Surname":
          newErrorData.showError[field] = false;
          newErrorData.errorMessage[field] = "";
          break;
        default:
          break;
      }
    } else {
      switch(field) {
        case "Flat":
          if(NoFlatStreetSet.indexOf(formData.Street) > -1) {
            newErrorData.showError[field] = false;
            newErrorData.errorMessage[field] = "";
          } else {
            newErrorData.showError[field] = true;
            newErrorData.errorMessage[field] = "Поле не може бути пустим";
          }
        case "Account":
        case "Street":
        case "House":
        case "Surname":
          newErrorData.showError[field] = true;
          newErrorData.errorMessage[field] = "Поле не може бути пустим";
        default:
          break;
      }
    }
    return newErrorData;
  }

  const checkFormValidity = (shouldSetErrors) => {
    console.log("checkFormValidity");
    let newErrorData = {
      showError: {...errorData.showError}, 
      errorMessage: {...errorData.showError},
    };
    for(let field in formData) {
      newErrorData = checkValidity(field, formData[field], newErrorData);
    }
    if(Object.values(newErrorData.showError).includes(true)) {
      if(shouldSetErrors) {
        console.log("kek????");
        setErrorData(newErrorData);
      }
      return false;
    } else {
      return formData;
    }
  }

  // React.useEffect(() => {
  //   const isDataOk = !Object.keys(formData).map(input => isInputEmpty(input)).includes(true);
  //   console.log(Object.keys(formData).map(input => isInputEmpty(input)), isDataOk, formData);
  //   // if(isDataOk.indexOf(true) === -1)
  //   //   props.onChange(formData);
  //   isDataOk ? props.onChange(formData) : props.onChange(null);
  //   // props.onChange(isDataOk, formData);
  // })

  React.useEffect(() => {
    console.log("useeffect counter", props.counter);
    if(props.counter > 0) {
      console.log("kek");
      checkFormValidity(true);
    }
  }, [props.counter])

  React.useEffect(() => {
    console.log("kek kek kek", errorData);
    props.onChange(checkFormValidity(false));
    // console.log("kek kek kek 222", errorData)
  }, [formData])

  // const isInputEmpty = (input) => {
  //   switch(input) {
  //     case "Account":
  //     case "Surname":
  //     case "Street":
  //     case "House":
  //       return formData[input] ? false : true;
  //     case "Flat":
  //       if(NoFlatStreetSet.indexOf(formData.Street) > -1)
  //         return false;
  //       return formData[input] ? false : true;
  //     case "Name":
  //     case "FName":
  //     default:
  //       return false;
  //   }
  // }

  return(
    // <Paper elevation = {3}>
    <React.Fragment>
      <Grid container spacing = {6}>
        <Grid item xs = {12}>
          <Typography variant = "h6">
            Ваш особовий рахунок
          </Typography>
          <TextField
            required
            id="Account"
            name="Account"
            label="Особовий рахунок"
            fullWidth
            value = {formData.Account}
            onChange = {handleChange}
            onBlur={handleOnBlur}
            error={errorData.showError.Account}
            helperText={errorData.errorMessage.Account}
          />
        </Grid>
        <Grid item xs = {12}>
          <Typography variant = "h6">
            ПІБ
          </Typography>
          <Grid container spacing = {3}>
            <Grid item xs = {12} sm = {4} >
              <TextField
                required
                id="Surname"
                name="Surname"
                label="Прізвище"
                fullWidth
                value = {formData.Surname}
                onChange = {handleChange}
                onBlur={handleOnBlur}
                error={errorData.showError.Surname}
                helperText={errorData.errorMessage.Surname}
              />
            </Grid>
            <Grid item xs = {12} sm = {4}>
              <TextField
                id="Name"
                name="Name"
                label="Ім'я"
                fullWidth
                value = {formData.Name}
                onChange = {handleChange}
              />
            </Grid>
            <Grid item xs = {12} sm = {4}>
              <TextField
                id="FName"
                name="FName"
                label="По батькові"
                fullWidth
                value = {formData.FName}
                onChange = {handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {12}>
          <Typography variant = "h6">
            Адреса
          </Typography>
          <Grid container sx = {12} spacing = {3}>
            <Grid item xs = {12} sm = {8}>
              {/* <TextField
                required
                id="Street"
                name="Street"
                label="Квартал"
                fullWidth
              /> */}
              {/* <InputLabel id = "street-select-label">Квартал</InputLabel> */}
              {/* <FormControl fullWidth
                  error={errorData.showError.Street}
                  helperText={errorData.errorMessage.Street}>
                <InputLabel htmlFor="Street">Квартал</InputLabel>
                <Select
                  // labelId = "street-select-label"
                  id = "Street"
                  name = "Street"
                  value = {formData.Street}
                  onChange = {handleChange}
                  onBlur={handleOnBlur}
                >
                  {
                    StreetSet.sort((a, b) => a.localeCompare(b))
                      .map(street => <MenuItem value = {street}>{street}</MenuItem>)
                  }
                </Select>
              </FormControl> */}
              <TextField 
                required
                id="Street"
                name="Street"
                label="Квартал"
                fullWidth
                value = {formData.Street}
                onChange = {handleChange}
                onBlur={handleOnBlur}
                error={errorData.showError.Street}
                helperText={errorData.errorMessage.Street}
              >
                {
                  StreetSet.sort((a, b) => a.localeCompare(b))
                    .map(street => <MenuItem value = {street}>{street}</MenuItem>)
                }
              </TextField>
            </Grid>
            <Grid item xs = {6} sm = {2}>
              <TextField
                required
                type="number"
                id="House"
                name="House"
                label="Дім"
                fullWidth
                InputProps={{
                  inputProps: {
                    min: 0, 
                    max: 118,
                  }
                }}
                value = {formData.House}
                onChange = {handleChange}
                onBlur={handleOnBlur}
                error={errorData.showError.House}
                helperText={errorData.errorMessage.House}
              />
            </Grid>
            {
              NoFlatStreetSet.indexOf(formData.Street) === -1 && 
              <Grid item xs = {6} sm = {2}>
                <TextField
                  required
                  id="Flat"
                  name="Flat"
                  label="Квартира"
                  fullWidth
                  value = {formData.Flat}
                  onChange = {handleChange}
                  onBlur={handleOnBlur}
                  error={errorData.showError.Flat}
                  helperText={errorData.errorMessage.Flat}
                />
              </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    {/* </Paper> */}
    </React.Fragment>
  )
}