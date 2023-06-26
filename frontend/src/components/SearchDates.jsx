import { useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import "./DataTable.css";
import "./SearchDates.css";

import "./SearchCustomers.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Alert, Button, Typography } from "@mui/material";
import axios from "axios";

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
  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState(
    "Please enter the date you want to search."
  );

  const checkEmpty = () => {
    return !date;
  };

  const fetchData = (allDates) => {
    setErrorMessage("There were no results for your search.");
    const URL = allDates
      ? `http://localhost:3000/dates/`
      : `http://localhost:3000/dates/${date}`;
    axios
      .get(URL)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setData(JSON.parse(data));
      })
      .catch((e) => {
        setError(true);
      });
  };

  const columns = useMemo(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 9 },
    },
    usePagination
  );

  return (
    <div>
      {error ? (
        <Alert severity="error">
          Something went wrong. Please contact the Development Team.
        </Alert>
      ) : (
        <>
          <Typography variant="h1">Dates & Customers</Typography>
          <div className={`dateInput ${data.length ? "" : "focused"}`}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Entry Date"
                onChange={(e) => {
                  setDate(e.format("yyyy-MM-DD"));
                }}
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
          {data.length ? (
            <div className="tableContainer">
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                          <div>
                            {column.canFilter ? column.render("Filter") : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr className="contentRow" {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="errorMessage">
              <Typography>{errorMessage}</Typography>
            </div>
          )}
          {data.length !== 0 && (
            <div>
              <div>
                <Typography>
                  Total visitors in search: <strong>{data.length}</strong>
                </Typography>
              </div>
              <div className="pagination">
                <Button
                  variant="outlined"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  {">"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </Button>
                <Typography>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>
                </Typography>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchDates;
