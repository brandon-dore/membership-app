import { useState, useEffect, useMemo } from "react";
import { useTable, useFilters } from "react-table";
import FilterText from "./FilterText";
import FilterDates from "./FiterDates";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./SearchMembers.css";
import "./DataTable.css";
import { modalBox } from "../MuiStyles";
import Profile from "./Profile";
const COLUMNS = [
  {
    Header: "Member ID",
    accessor: "membership_id",
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
    Header: "Expiry Date",
    accessor: "expiry_date",
    Filter: FilterDates,
  },
  {
    Header: "Date of Birth",
    accessor: "dob",
    Filter: FilterDates,
  },
];

const SearchMembers = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMemberID, setCurrentMemberID] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/users")
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
    useTable({ columns, data }, useFilters);

  return (
    <div>
      <h1>Search</h1>
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
                  setCurrentMemberID(row.cells[0].value);
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
            <Profile memberID={currentMemberID} closeModal={handleClose} />
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default SearchMembers;
