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

// function createData(date, calories, fat, carbs, protein) {
//   let dateFormatted = new Date(date).toDateString();
//   return { dateFormatted, calories, fat, carbs, protein };
// }
function createData(date, countersValues) {
  let dateFormatted = new Date(date).toDateString();
  return [dateFormatted, ...countersValues]
}

// const rows = [
//   createData('01/01/2019', 305, 3.7, 67, 4.3),
//   createData('01/31/2019', 452, 25.0, 51, 4.9),
//   createData('03/02/2019', 262, 16.0, 24, 6.0),
//   createData('04/01/2019', 159, 6.0, 24, 4.0),
//   createData('05/01/2019', 356, 16.0, 49, 3.9),
//   createData('06/01/2019', 408, 3.2, 87, 6.5),
//   createData('07/01/2019', 237, 9.0, 37, 4.3),
//   createData('08/01/2019', 375, 0.0, 94, 0.0),
//   createData('09/01/2019', 518, 26.0, 65, 7.0),
//   createData('10/01/2019', 392, 0.2, 98, 0.0),
//   createData('11/01/2019', 318, 0, 81, 2.0),
//   createData('12/01/2019', 360, 19.0, 9, 37.0),
//   createData('01/02/2020', 437, 18.0, 63, 4.0),
// ];
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

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

// const headCells = [
//   { id: 'date', numeric: false, disablePadding: false, label: 'Дата передачі' },
//   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];
const countersTest = ['Ванна ХВС', 'Ванна ГВС', 'Кухня ХВС', 'Кухня ГВС', 'Полив ХВС']

function EnhancedTableHead(props) {
  const { classes, order, orderBy, rowCount, onRequestSort, counters } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  const headCells = countersTest.map(counter => {return ({id: counter, numeric: true, disablePadding: false, label: counter})});
  const headDataCells = { id: 'date', numeric: false, disablePadding: false, label: 'Дата передачі' };
  //headCells.unshift({ id: 'date', numeric: false, disablePadding: false, label: 'Дата передачі' })

  return (
    <TableHead>
      <TableRow>
        {/* {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))} */}
        <TableCell
          key={headDataCells.id}
          align={headDataCells.numeric ? 'right' : 'left'}
          sortDirection={orderBy === headDataCells.id ? order : false}
        >
          <TableSortLabel
            active={orderBy === headDataCells.id}
            direction={orderBy === headDataCells.id ? order : 'asc'}
            onClick={createSortHandler(headDataCells.id)}
          >
            {headDataCells.label}
          </TableSortLabel>
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: false,
      })}
    >
      {
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Ваші попередні показання
        </Typography>
      }

      {
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      }
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: 'calc(100% - 50px)',
    height: 'auto',
    padding: '25px',
    backgroundColor: '#f5f5f5'
  },
  container: {
    minHeight: 'calc(100% - 116px)',
    height: '1px'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    minHeight: '100%',
    height: '1px'
  },
  table: {
    minWidth: 300,
  }
}));

export default function HistoryCounters(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('');//React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');//React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer className = {classes.container}>
          <Table
            className={classes.table}
            size='medium'
            aria-label="history of counter readings"
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              counters = {props.counters}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                    >
                      {/* <TableCell component="th" scope="row">{row.dateFormatted}</TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell> */}
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
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
