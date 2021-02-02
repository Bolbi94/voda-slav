import React from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  
}));

export default function Review() {
  const classes = useStyles();

  return(
    <React.Fragment>
      <Grid container>
        <Grid item xs = {12}>
          <Grid container spacing = {3}>
            <Grid item xs = {5}>
              <Typography variant = "subtitle1">Особовий рахунок</Typography>
            </Grid>
            <Grid item xs = {7}>
              <Typography variant = "body1">1212123434</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {12}>
          <Grid container spacing = {3}>
            <Grid item xs = {5}>
              <Typography variant = "subtitle1">ПІБ</Typography>
            </Grid>
            <Grid item xs = {7}>
              <Typography variant = "body1">1212123434</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {12}>
          <Grid container spacing = {3}>
            <Grid item xs = {5}>
              <Typography variant = "subtitle1">Адреса</Typography>
            </Grid>
            <Grid item xs = {7}>
              <Typography variant = "body1">1212123434</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}