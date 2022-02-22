import React, { useState } from "react";

//styles components
import { makeStyles } from "@material-ui/styles";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";

import Select from "components/Select.component";

const CustomTableHead = ({
  headCells,
  orderBy,
  order,
  onRequestSort,
  onSelectSort,
}) => {
  const classes = useStyles({ columnWidth: 100 / headCells.length });
  const [selectValue, setSelectValue] = useState("");
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
    setSelectValue("");
  };

  const createSelectHandler = (property) => (event) => {
    setSelectValue(event.target.value);
    onSelectSort(event, property, event.target.value);
  };

  return (
    <TableHead className={classes.container}>
      <TableRow className={classes.rowContainer}>
        {headCells.map((headCell, index) => (
          <TableCell
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
            className={`${
              headCells.length !== index + 1 ? classes.cellContainer : undefined
            } ${classes.column}`}
            key={index}
          >
            {headCell.options && orderBy === headCell.id ? (
              <Select
                className={classes.selectInput}
                placeholder={headCell.label}
                value={selectValue}
                handleChange={createSelectHandler(headCell.id)}
                options={headCell.options}
              />
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className={classes.columnTitle}
              >
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.blue,
  },
  rowContainer: {
    border: `1px solid ${theme.palette.common.blue}`,
    height: "3rem",
  },
  cellContainer: {
    borderRight: "1px solid white",
  },
  column: {
    width: (props) => `${props.columnWidth}%`,
  },
  columnTitle: {
    fontSize: "1rem",
    color: "white",
    "&:hover": {
      color: "white",
    },
    "&.MuiTableSortLabel-active": {
      color: "white",
    },
    "& svg": {
      "&.MuiTableSortLabel-icon": {
        fill: "white",
      },
    },
    height: "2rem",
  },
  selectInput: {
    color: "white",
    width: "100%",
    height: "2rem",
  },
}));

export default CustomTableHead;
