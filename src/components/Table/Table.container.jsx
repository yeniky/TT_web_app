import React, { useState, useEffect, useMemo } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '@material-ui/core';

//components
import TableHead from './Head.component';
import Loading from 'components/Loading.hoc';

//utils
import { stableSort, getComparator } from './tableUtils';

const CustomTable = ({
  rows,
  tableHeaders,
  onRowClick,
  defaultOrder,
  orderDirection,
  orderByFunction,
  downloadData,
  handleChangePage,
  handleChangeRowsPerPage,
  page,
  rowsPerPage,
  total,
  total_pages,
  changingPage,
  showPagination,
}) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [order, setOrder] = useState(orderDirection || 'desc');
  const [orderBy, setOrderBy] = useState(defaultOrder);
  const [selectValue, setSelectValue] = useState('');
  // const [downloadedData, setDownloadedData] = useState([]);

  useEffect(() => setTableData(rows), [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setSelectValue('');
  };

  const handleSelectSort = (event, property, value) => {
    setOrder('asc');
    setOrderBy(property);
    setSelectValue(value);
  };

  useEffect(() => {
    if (selectValue === '') {
      setTableData(rows);
    } else {
      const filteredData = rows.filter((row) =>
        row[orderBy].includes(selectValue)
      );
      setTableData(filteredData);
    }
  }, [selectValue, rows, orderBy]);

  const emptyRows = rowsPerPage - rows?.length;
  const fill = emptyRows > 0 && (
    <TableRow style={{ height: 53 * emptyRows }}>
      <TableCell colSpan={tableHeaders.length} />
    </TableRow>
  );

  const downloadedData = tableData;
  // const downloadedData = useMemo(
  //   // () => stableSort(tableData, getComparator(order, orderBy)),
  //   () => tableData,
  //   [order, orderBy, tableData]
  // );

  useEffect(() => {
    if (orderByFunction) {
      orderByFunction(orderBy, order);
    }
  }, [orderBy, order]);

  useEffect(() => {
    if (downloadData) downloadData(downloadedData);
  }, [downloadData, downloadedData]);

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead
              headCells={tableHeaders}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onSelectSort={handleSelectSort}
            />
            <TableBody>
              {downloadedData.map((row, indexRow) => {
                return (
                  <TableRow
                    hover
                    onClick={() => (onRowClick ? onRowClick(row) : null)}
                    tabIndex={-1}
                    key={`${Object.keys(row)[0]}_${indexRow}`}
                  >
                    {Object.keys(row).map((key, index) =>
                      index === 0 ? (
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          align="center"
                          key={`${row[key]}_${index}`}
                        >
                          {row[key]}
                        </TableCell>
                      ) : (
                        <TableCell align="center" key={`${row[key]}_${index}`}>
                          {row[key]}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                );
              })}
              {fill}
            </TableBody>
          </Table>
        </TableContainer>
        {showPagination && (
          <TablePagination
            rowsPerPageOptions={[3, 5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por Página:"
            labelDisplayedRows={({ from, to, count }) =>
              `Página: ${
                Math.sign(rows.length) * (page + 1)
              } de ${total_pages}. Mostrando ${from}-${to} de ${count}`
            }
            nextIconButtonProps={changingPage ? { disabled: changingPage } : {}}
            nextIconButtonText={`${page + 2}`}
            backIconButtonProps={changingPage ? { disabled: changingPage } : {}}
            backIconButtonText={`${page}`}
          />
        )}
      </Paper>
      {/*       <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({}));

export default Loading(CustomTable);
