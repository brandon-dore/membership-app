import Modal from "@mui/material/Modal";
import { useEffect, useMemo, useState } from "react";
import { useFilters, useTable } from "react-table";
import { modalBox } from "../MuiStyles";
import "./DataTable.css";
import Profile from "./Profile";
import "./SearchCustomers.css";
import FilterDropdown from "./filters/FilterDropdown";
import FilterText from "./filters/FilterText";
import FilterDates from "./filters/FiterDates";
import { Typography } from "@mui/material";

import Box from "@mui/material/Box";
const COLUMNS = [
  {
    Header: "Customer ID",
    accessor: "id",
    Filter: FilterText,
  },
  {
    Header: "First Name",
    accessor: "first_name",
    Filter: FilterText,
  },
  {
    Header: "Last Name",
    accessor: "last_name",
    Filter: FilterText,
  },
  {
    Header: "Date of Birth",
    accessor: "birth_date",
    Filter: FilterDates,
  },
  {
    Header: "Sex",
    accessor: "sex",
    Filter: FilterDropdown,
    filter: "equals",
    enableColumnFilter: true,
    options: [
      { value: undefined, label: "Unknown" },
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    Header: "Relationship",
    accessor: "relationship_status",
    Filter: FilterDropdown,
    filter: "equals",
    options: [
      { value: undefined, label: "Unknown" },
      { value: "Single", label: "Single" },
      { value: "Couple", label: "Couple" },
    ],
  },
  {
    Header: "Member",
    accessor: "is_member",
    Filter: FilterDropdown,
    filter: "equals",
    options: [
      { value: undefined, label: "Unknown" },
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
];

const SearchCustomers = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCustomerID, setCurrentCustomerID] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log(data);
    setOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/customers")
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
    useTable(
      {
        columns,
        data,
      },
      useFilters
    );

  return (
    <div>
      <Typography variant="h1">Search for Customer</Typography>
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
              <tr
                className="contentRow"
                onClick={(e) => {
                  setCurrentCustomerID(row.cells[0].value);
                  handleOpen();
                }}
                {...row.getRowProps()}
              >
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Open Profile"
        aria-describedby="Open Profile"
      >
        <div>
          <Box sx={modalBox}>
            <Profile customerID={currentCustomerID} closeModal={handleClose} />
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default SearchCustomers;
