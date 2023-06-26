import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Search from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  IconButton,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { useTable } from "react-table";
import "./QuickSearch.css";
import "./DataTable.css";
import { modalBox } from "../MuiStyles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Profile from "./Profile";

const checkDate = (d) => {
  let today = Date.now();
  return today > new Date(d);
};

const COLUMNS = [
  {
    Header: "Customer ID",
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
    accessor: (d) => {
      if (d.expiry_date != null) {
        // const is_banned = d.is_banned.toString();
        // return is_banned.charAt(0).toUpperCase() + is_banned.slice(1);
        return checkDate(d.expiry_date) ? (
          <Typography sx={{ color: "firebrick" }}>{d.expiry_date} </Typography>
        ) : (
          d.expiry_date
        );
      } else {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      }
    },
  },
  {
    Header: "Date of Birth",
    accessor: "birth_date",
    // Filter: FilterDates,
  },
];

const QuickSearch = () => {
  const [id, setId] = useState("");

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [error, setError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = useMemo(() => COLUMNS, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleSearch = () => {
    console.log("e");
    axios
      .get(`http://localhost:3000/customers/names/`, {
        params: {
          first_name: firstName,
          last_name: lastName,
          birth_date: dob,
        },
      })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setData(data);
      })
      .catch((e) => {
        setError(true);
      });
  };
  return (
    <>
      <div>
        <Typography variant="h2">Enter ID: </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOpen();
          }}
        >
          <OutlinedInput
            sx={{ width: "20rem" }}
            id="id"
            type="number"
            variant="outlined"
            placeholder="Customer ID"
            onChange={(e) => setId(e.target.value)}
            value={id}
          />
          <IconButton
            sx={{ width: "3rem", aspectRatio: "1/1" }}
            disabled={!id}
            onClick={handleOpen}
          >
            <CheckCircleIcon />
          </IconButton>
        </form>
      </div>
      <br />
      <Typography variant="h2">Quick Search:</Typography>
      <div className="formContainer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <OutlinedInput
            sx={{ width: "20rem" }}
            id="first_name"
            type="text"
            variant="outlined"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
          <OutlinedInput
            sx={{ width: "20rem" }}
            id="last_name"
            type="text"
            variant="outlined"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              format="DD/MM/YYYY"
              clearable
              value={dob || null}
              onChange={(e) => {
                if (e === null) {
                  setDob(undefined);
                } else {
                  setDob(e.format("yyyy-MM-DD"));
                }
              }}
              slotProps={{
                actionBar: {
                  actions: ["clear"],
                },
              }}
            />
          </LocalizationProvider>
          <IconButton sx={{ width: "4rem" }} type="submit">
            <Search />
          </IconButton>
        </form>
      </div>
      <br />

      {error && (
        <Alert severity="error">
          Something went wrong. Please contact the Development Team.
        </Alert>
      )}

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
                    handleOpen();
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
        <Box sx={modalBox}>
          <Profile customerID={id} closeModal={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default QuickSearch;
