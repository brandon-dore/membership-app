import { useMemo, useState } from "react";
import { useTable } from "react-table";
import "./DataTable.css";
import "./SearchDates.css";

import "./SearchMembers.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Button, Typography } from "@mui/material";

const COLUMNS = [
  {
    Header: "First Name",
    accessor: "first_name",
  },
  {
    Header: "Last Name",
    accessor: "last_name",
  },
  {
    Header: "Entry Date",
    accessor: "entry_date",
  },
];

const SearchDates = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");

  const checkEmpty = () => {
    return !date;
  };

  const fetchData = (allDates) => {
    const URL = allDates
      ? `http://localhost:3000/dates/`
      : `http://localhost:3000/dates/${date}`;
    fetch(URL)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setData(JSON.parse(data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(() => COLUMNS, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div>
      <Typography variant="h1">Dates & Members</Typography>
      <div className="dateInput">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Entry Date"
            onChange={(e) => setDate(e.format("yyyy-MM-DD"))}
          />
        </LocalizationProvider>
        <Button
          disabled={checkEmpty()}
          onClick={() => fetchData(false)}
          color="info"
          variant="contained"
        >
          Search Date
        </Button>
        <Typography>OR</Typography>
        <Button
          onClick={() => fetchData(true)}
          color="info"
          variant="contained"
        >
          Get all Dates
        </Button>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr className="contentRow" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchDates;
