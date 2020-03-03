import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import './history-pay.css';

// export default class HistoryPay extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {}
//   }

//   render() {
//     return(
//       <div className = "main-history-pay"></div>
//     )
//   }
// }

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

function createData(date, summ, balance) {
  return { date, summ, balance };
}

const rows = [
  createData(new Date('09/10/2019'), 200, 150),
  createData(new Date('10/01/2019'), 200, 350),
  createData(new Date('11/02/2019'), 200, 550),
  createData(new Date('12/15/2019'), 200, 750),
  // createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  // createData('Eclair', 262, 16.0, 24, 6.0),
  // createData('Cupcake', 305, 3.7, 67, 4.3),
  // createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function HistoryPay() {
  const classes = useStyles();

  return (
    <div className = "main-history-pay">
      <TableContainer component={Paper} className = {classes.container}>
        <Table stickyHeader  className={classes.table} aria-label="history of paymant">
          <TableHead>
            <TableRow>
              <TableCell className = {classes.header}>Дата зарахування</TableCell>
              <TableCell className = {classes.header} align="right">Сумма (грн.)</TableCell>
              <TableCell className = {classes.header} align="right">Стан рахунку (грн.)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.date}>
                <TableCell>{row.date.toDateString()}</TableCell>
                <TableCell align="right">{row.summ}</TableCell>
                <TableCell align="right">{row.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}