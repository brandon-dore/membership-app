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
import { capitalizeFirstLetter } from "../utils";
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
    id: "birth_date",
    Filter: FilterDates,
    accessor: (d) => {
      if (d.birth_date === null) {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      } else {
        return d.birth_date;
      }
    },
  },
  {
    Header: "Sex",
    id: "sex",
    Filter: FilterDropdown,
    filter: "equals",
    enableColumnFilter: true,
    accessor: (d) => {
      if (d.sex === null) {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      } else {
        return d.sex;
      }
    },
    options: [
      { value: undefined, label: "Unknown" },
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    Header: "Relationship",
    id: "relationship_status",
    Filter: FilterDropdown,
    filter: "equals",
    accessor: (d) => {
      if (d.relationship_status === null) {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      } else {
        return d.relationship_status;
      }
    },
    options: [
      { value: undefined, label: "Unknown" },
      { value: "Single", label: "Single" },
      { value: "Couple", label: "Couple" },
    ],
  },
  {
    Header: "Member",
    id: "is_member",
    Filter: FilterDropdown,
    filter: "equals",
    options: [
      { value: undefined, label: "Unknown" },
      { value: "True", label: "True" },
      { value: "False", label: "False" },
    ],
    accessor: (d) => {
      if (d.is_member != null) {
        const is_member = d.is_member.toString();
        return capitalizeFirstLetter(is_member);
      } else {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      }
    },
  },
  {
    Header: "Banned",
    id: "is_banned",
    Filter: FilterDropdown,
    filter: "equals",
    options: [
      { value: undefined, label: "Unknown" },
      { value: "True", label: "True" },
      { value: "False", label: "False" },
    ],
    accessor: (d) => {
      if (d.is_banned != null) {
        const is_banned = d.is_banned.toString();
        return is_banned.charAt(0).toUpperCase() + is_banned.slice(1);
      } else {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      }
    },
  },
];

const SearchCustomers = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCustomerID, setCurrentCustomerID] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
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
