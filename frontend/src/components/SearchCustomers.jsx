import Modal from "@mui/material/Modal";
import { useEffect, useMemo, useState } from "react";
import { useFilters, usePagination, useTable } from "react-table";
import { modalBox } from "../MuiStyles";
import "./DataTable.css";
import Profile from "./Profile";
import "./SearchCustomers.css";
import FilterDropdown from "./filters/FilterDropdown";
import FilterText from "./filters/FilterText";
import FilterDates from "./filters/FiterDates";
import { Alert, Button, Typography } from "@mui/material";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import Box from "@mui/material/Box";
import axios from "axios";
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
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
    accessor: (d) => {
      if (d.is_member != null) {
        const is_member = d.is_member.toString();
        return d.is_member ? "Yes" : "No";
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
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
    accessor: (d) => {
      if (d.is_banned != null) {
        return d.is_banned ? "Yes" : "No";
      } else {
        return <Typography sx={{ opacity: "0.5" }}>Unknown</Typography>;
      }
    },
  },
];

const SearchCustomers = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
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
    axios
      .get("http://localhost:3000/customers")
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setData(data);
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
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
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
                  <tr
                    className={`contentRow ${
                      row.original.is_banned ? "banned" : ""
                    }`}
                    onClick={(e) => {
                      setCurrentCustomerID(row.original.id);
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
          <div className="pagination">
            <Button
              variant="outlined"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <FirstPageIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <NavigateBeforeIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <NavigateNextIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <LastPageIcon />
            </Button>
            <Typography>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </Typography>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Open Profile"
            aria-describedby="Open Profile"
          >
            <div>
              <Box sx={modalBox}>
                <Profile
                  customerID={currentCustomerID}
                  closeModal={handleClose}
                />
              </Box>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default SearchCustomers;
