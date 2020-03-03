import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { classes } from 'istanbul-lib-coverage';

const useStyles = makeStyles({
  table: {
    minWidth: 650, 
  },
  header: {
    fontWeight: 'bold'
  },
  container: {
    minHeight: '100%',
    height: '1px'
  }
});

const countersData = ['Ванна ХВС', 'Ванна ГВС', 'Кухня ХВС', 'Кухня ГВС', 'Полив ХВС'];

function createData(date, countersValues) {
  let dateFormatted = new Date(date).toDateString();
  return [dateFormatted, ...countersValues]
}

const rows = [
  createData('01/01/2019', [100, 106, 105, 101, 100]),
  createData('01/31/2019', [110, 112, 110, 102, 100]),
  createData('03/02/2019', [120, 118, 115, 103, 100]),
  createData('04/01/2019', [130, 124, 120, 104, 100]),
  createData('05/01/2019', [140, 130, 125, 105, 104]),
  createData('06/01/2019', [150, 136, 130, 106, 108]),
  createData('07/01/2019', [160, 142, 135, 107, 112]),
  createData('08/01/2019', [170, 148, 140, 108, 116]),
  createData('09/01/2019', [180, 154, 145, 109, 119]),
  createData('10/01/2019', [190, 160, 150, 110, 119]),
  createData('11/01/2019', [200, 166, 155, 111, 119]),
  createData('12/01/2019', [210, 172, 160, 112, 119]),
  createData('01/02/2020', [220, 178, 165, 113, 119]),
]

function Head(props) {
  const { order, sort } = props;

  const headCells = countersData.map(counter => {return ({id: counter, numeric: true, disablePadding: false, label: counter})});
  const headDateCell = { id: 'date', numeric: false, disablePadding: false, label: 'Дата передачі' };

  return(
    <TableHead>
      <TableRow>
        <TableCell 
          key = {headDateCell.id}
          style = {{fontWeight: 'bold'}}
          align = "left"
          sortDirection = {order ? order : false}
        >
          <TableSortLabel
            active = {order}
            direction = {order ? order : 'desc'}
            onClick = {sort}
          >
            {headDateCell.label}
          </TableSortLabel>
        </TableCell>
        {
          headCells.map(headCell => (
            <TableCell key = {headCell.id} style = {{fontWeight: 'bold'}} align={headCell.numeric ? 'right' : 'left'}>{headCell.label}</TableCell>
          ))
        }
      </TableRow>
    </TableHead>
  )
}

export default function HistoryCounters() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('');

  const sort = () => {

  }

  return (
    <div className = "main-history-pay">
      <TableContainer component={Paper} className = {classes.container}>
        <Table stickyHeader  className={classes.table} aria-label="history of paymant">
          <Head 
            order = {order}
            sort = {sort}
          />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {
                  row.map((col, i) => {
                    if(i === 0) {
                      return(
                        <TableCell component="th" scope="row">{col}</TableCell>
                      )
                    } else {
                      return(
                        <TableCell align="right">{col}</TableCell>
                      )
                    }
                  })
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
