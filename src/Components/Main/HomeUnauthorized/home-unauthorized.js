import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReadingsForm from './readings-form';

import '../main.css';

const useStyles = makeStyles((theme) => ({
  authorizationButtons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function HomePageUnauthorized(props) {
  const classes = useStyles();

  return(
    <div className = "home">
      <div className = "home-header">
        <h2>{`Вітаємо!`}</h2>
      </div>
      <div className = "home-description">
        <span>{`Для більш зрунчого користування сайтом пропонуємо`}</span>
        <div className = {classes.authorizationButtons}>
          <Button variant="outlined" color="primary" href="/signup">
            Зареєструватись
          </Button>
            <span>{`  або  `}</span>
          <Button variant="outlined" color="primary" href="/signin">
            Увійти
          </Button>
        </div>
      </div>
      <div className = "home-grid-title">
        <h3>{`Для передачі показань заповніть форму нижче`}</h3>
        <ReadingsForm firebase = {props.firebase}/>
      </div>
    </div>
  )
}