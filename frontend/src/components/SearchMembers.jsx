import Modal from "@mui/material/Modal";
import { useEffect, useMemo, useState } from "react";
import { useFilters, useTable } from "react-table";
import { modalBox } from "../MuiStyles";
import "./DataTable.css";
import Profile from "./Profile";
import "./SearchMembers.css";
import FilterDropdown from "./filters/FilterDropdown";
import FilterText from "./filters/FilterText";
import FilterDates from "./filters/FiterDates";
import Box from "@mui/material/Box";

const COLUMNS = [
  {
    Header: "Member ID",
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
    fetch("http://localhost:3000/members")
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
