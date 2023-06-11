import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Search from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { useFilters, useTable } from "react-table";
import "./CheckInMember.css";
import "./DataTable.css";
import Profile from "./Profile";
import FilterText from "./filters/FilterText";
import FilterDates from "./filters/FiterDates";
import ProfilePreview from "./ProfilePreview";
import { modalBox, smallModalBox } from "../MuiStyles";

const COLUMNS = [
  {
    Header: "Member ID",
    accessor: "id",
    // Filter: FilterText,
  },
  {
    Header: "First Name",
    accessor: "first_name",
    // Filter: FilterText,
  },
  {
    Header: "Last Name",
    accessor: "last_name",
    // Filter: FilterText,
  },
  {
    Header: "Expiry Date",
    accessor: "expiry_date",
    // Filter: FilterDates,
  },
  {
    Header: "Date of Birth",
    accessor: "birth_date",
    // Filter: FilterDates,
  },
];

const CheckInMember = () => {
  const [id, setId] = useState("");

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMemberID, setCurrentMemberID] = useState(null);

  const [filters, setFilters] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = useMemo(() => COLUMNS, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const addFilter = (label, value) => {
    const temp = filters;
    if (value === "") {
      delete temp[label];
      setFilters(temp);
      return;
    }
    temp[label] = value;
    setFilters(temp);
  };

  const handleSearch = () => {
    axios
      .get("http://localhost:3000/filter", { params: filters })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setData(data);
      });
  };

  const handleCheckIn = () => {
    console.log(id);
    axios
      .post(`http://localhost:3000/dates/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <h1>Check In</h1>
      <div className="">
        <h2>Check in member: </h2>
        <OutlinedInput
          sx={{ width: "20rem" }}
          id="id"
          type="number"
          variant="outlined"
          placeholder="Membership ID"
          onChange={(e) => setId(e.target.value)}
          value={id}
          endAdornment={<InputAdornment position="end"></InputAdornment>}
        />
        <IconButton
          sx={{ width: "3rem", aspectRatio: "1/1" }}
          disabled={!id}
          onClick={handleCheckIn}
        >
          <CheckCircleIcon />
        </IconButton>
      </div>
      <h2>Search Member:</h2>
      <div className="formContainer">
        {/* Replace this with various searchable fields to update state object */}
        <OutlinedInput
          sx={{ width: "20rem" }}
          id="first_name"
          type="text"
          variant="outlined"
          placeholder="First Name"
          onChange={(e) => addFilter("first_name", e.target.value)}
        />
        <OutlinedInput
          sx={{ width: "20rem" }}
          id="last_name"
          type="text"
          variant="outlined"
          placeholder="Last Name"
          onChange={(e) => addFilter("last_name", e.target.value)}
        />
        <IconButton sx={{ width: "4rem" }} onClick={handleSearch}>
          <Search />
        </IconButton>
      </div>
      <br />

      {data.length > 0 && (
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
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  className="contentRow"
                  onClick={(e) => {
                    setOpen(true);
                    setId(row.cells[0].value);
                  }}
                  {...row.getRowProps()}
                  style={{ cursor: "pointer" }}
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
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Confirm Check In"
        aria-describedby="Confirm Check In"
      >
        <Box sx={smallModalBox}>
          <ProfilePreview memberID={id} closeModal={handleClose} />
          <div className="confirmContainer">
            <p>Would you like to check in this user? </p>
            <div className="confirmButtons">
              <Button onClick={handleCheckIn} variant="contained">
                Confirm
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CheckInMember;
