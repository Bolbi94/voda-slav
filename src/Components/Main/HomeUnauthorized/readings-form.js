import React, { useRef, createRef, forwardRef } from 'react';
import { Button, Stepper, Step, StepLabel, Paper, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

// import { CountersTableConfig } from '../../Firebase/config';
import ContactData from './contact-data';
import ReadingsData from './readings-data';
import Review from './review';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = [
  "Контанти",
  "Показники",
  "Перевірка",
]

// function renderStepContent(step) {
//   switch(step) {
//     case 0:
//       return <ContactData />;
//     case 1:
//       return <ReadingsData />;
//     case 2:
//       return <Review />;
//     default:
//       console.log("unknown step ", step);
//       return null;
//   }
// }

const parceCountersData = (countersData) => {
  // let countersDictionary = CountersTableConfig.FieldsDictionary.dictionary
  // let counters = [], specialCounters = [];
  // Object.values(countersData).sort((a, b) => a.Placement.localeCompare(b.Placement)).forEach(counter => {
  //   if(counter.Placement && counter.Type) {
  //     if(counter.Placement === counter.Type) {
  //       specialCounters.push(counter);
  //     } else {
  //       counters.push(counter);
  //     }
  //   }
  // });
  let parcedCountersData = {};
  let countersPlacements = [], specialCounters = [];
  Object.values(countersData).forEach((counter, i) => {
    if(counter.Placement && counter.Type) {
      if(counter.Placement === counter.Type) {
        specialCounters.push({
          ...counter,
          dbName: Object.keys(countersData)[i],
        });
      } else {
        if(countersPlacements.indexOf(counter.Placement) === -1) {
          countersPlacements.push(counter.Placement);
        }
      }
    }
  });
  // countersPlacements.sort((a, b) => a.localeCompare(b)).forEach(place => {
  //   parcedCountersData[place] = countersData
  //     .filter(counter => counter.Placement === place)
  //     .sort((a, b) => a.Type.localeCompare(b.Type))
  // });
  countersPlacements.sort((a, b) => a.localeCompare(b)).forEach(place => {
    parcedCountersData[place] = [];
    for(let key in countersData) {
      if(countersData[key].Placement === place) {
        parcedCountersData[place].push({
          ...countersData[key],
          dbName: key,
        })
      }
    }
    parcedCountersData[place].sort((a, b) => a.Type.localeCompare(b.Type))
  });
  parcedCountersData.special = specialCounters.sort((a, b) => a.Type.localeCompare(b.Type));
  parcedCountersData.originalObj = {...countersData};
  return parcedCountersData;
}

const checkAccount = (account, db) => {
  // console.log("kek");
  // return new Promise((resolve, reject) => {
  //   db.collection("Accounts").doc(account).get()
  //   .then(doc => {
  //     if(doc.exists) {
  //       console.log("Document data:", doc.data());
  //       db.collection("Counters").doc(account).get()
  //       .then(countersDoc => {
  //         console.log("counters data:", countersDoc.data());
  //         resolve(countersDoc.data());
  //       })
  //       .catch(err => {
  //         console.log("Error getting document:", err);
  //         reject(err);
  //       })
  //     } else {
  //       console.log("No such document!");
  //       resolve(null);
  //     }
  //   })
  //   .catch(err => {
  //     console.log("Error getting document:", err);
  //     reject(err);
  //   });
  // });
  // return {
  //   BathCold: {
  //     ID: "280335",
  //     LastReading: "301",
  //     LastReadingsDate: "5November2020",
  //     LastReadingsMonthFor: "Жовтень",
  //     Name: "ХВС Ванна",
  //     Placement: "Ванна",
  //     Type: "Холодна",
  //   },
  //   BathHot: {
  //     ID: "51774",
  //     LastReading: "104",
  //     LastReadingsDate: "5November2020",
  //     LastReadingsMonthFor: "Жовтень",
  //     Name: "ГВС Ванна",
  //     Placement: "Ванна",
  //     Type: "Гаряча",
  //   }
  // }
  return {
    BathCold: {
      ID: "ХВС ВАННА НОМЕР",
      Name: "$ХВС Ванна",
      LastReading: "301",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Ванна",
      Type: "Холодна",
    },
    ToiletCold: {
      ID: "ХВС ТУАЛЕТ НОМЕР",
      Name: "234",
      LastReading: "234",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Туалет",
      Type: "Холодна",
    },
    KitchenCold: {
      ID: "ХВС КУХНЯ НОМЕР",
      Name: "332",
      LastReading: "332",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Кухня",
      Type: "Холодна",
    },
    Watering: {
      ID: "ПОЛИВ НОМЕР",
      Name: "662",
      LastReading: "662",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Полив",
      Type: "Полив",
    },
    BathHot: {
      ID: "ГВС ВАННА НОМЕР",
      Name: "104",
      LastReading: "104",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Ванна",
      Type: "Гаряча",
    },
    ToiletHot: {
      ID: "ГВС ТУАЛЕТ НОМЕР",
      Name: "55",
      LastReading: "55",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Туалет",
      Type: "Гаряча",
    },
    KitchenHot: {
      ID: "ГВС КУХНЯ НОМЕР",
      Name: "90",
      LastReading: "90",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Кухня",
      Type: "Гаряча",
    },
    Reverse: {
      ID: "ОБРАТКА НОМЕР",
      Name: "344",
      LastReading: "344",
      LastReadingsDate: "$5November2020",
      LastReadingsMonthFor: "$Жовтень",
      Placement: "Обратка",
      Type: "Обратка",
    },
  }
}

export default function ReadingsFormComponent(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(2);
  const [errorNotification, setErrorNotification] = React.useState({open: false, message: ""});

  const [tryProceedContactFormCounter, setTryProceedContactFormCounter] = React.useState(0);
  const [contactData, setContactData] = React.useState(null);
  // const [fireWrongInput, setFireWrongInput] = React.useState(false);
  const contactDataChangeHandler = (data) => setContactData(data);

  const [countersData, setCountersData] = React.useState({});
  const [readingsData, setReadingsData] = React.useState(null);
  const readingsDataChangeHandler = data => setReadingsData(data);

  const handleNext = () => {
    switch(activeStep) {
      case 0:
        setTryProceedContactFormCounter(tryProceedContactFormCounter + 1);
        console.log("main form counter", tryProceedContactFormCounter);
        if(contactData) {
          console.log("next click", contactData)
          // checkAccount(contactData.Account, props.firebase.firestore())
          // .then(countersData => {
          //   if(countersData) {
          //     setCountersData(countersData);
          //     setActiveStep(1);
          //   } else {
          //     setErrorNotification({open: true, message: "Такого особового рахунку не існує в базі"});
          //   }
          // })
          let countersData = checkAccount(contactData.Account, props.firebase.firestore());
          let parcedCountersData = parceCountersData(countersData);
          console.log("kekekekke", countersData, parcedCountersData)
          setCountersData(parcedCountersData);
          setActiveStep(1);
        } else {
          setErrorNotification({open: true, message: "Заповніть усі обов'зкові поля"});
        }
        break;
      case 1:
      case 2:
      default:
        setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const renderStepContent = (step) => {
    switch(step) {
      case 0:
        return <ContactData contactData = {contactData} onChange = {contactDataChangeHandler} counter = {tryProceedContactFormCounter} />;
      case 1:
        return <ReadingsData countersData = {countersData} readingsData = {readingsData} onChange = {readingsDataChangeHandler} />;
      case 2:
        return <Review />;
      default:
        console.log("unknown step ", step);
        return null;
    }
  }

  return(
    <main>
      <Snackbar 
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open = {errorNotification.open} 
        autoHideDuration = {2000} 
        onClose = {() => setErrorNotification({open: false, message: ""})}
      >
        <Alert
          severity = "error" 
          onClose = {() => setErrorNotification({open: false, message: ""})} 
          elevation={6} 
          variant="filled" 
        >
          {errorNotification.message}
        </Alert>
      </Snackbar>
      <Paper className = {classes.paper}>
        <Stepper activeStep = {activeStep}>
          {
            steps.map(label => 
              <Step key = {label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          }
        </Stepper>
        <div>
          {
            activeStep === steps.length ? 
            <div>finish</div>
            :
            <React.Fragment>
              {
                renderStepContent(activeStep)
              }
              <div className = {classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Назад
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Відправити показники' : 'Далі'}
                </Button>
              </div>
            </React.Fragment>
          }
        </div>
      </Paper>
    </main>
  )
}