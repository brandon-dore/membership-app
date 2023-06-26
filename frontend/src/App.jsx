import { useState } from "react";
import SearchDates from "./components/SearchDates";
import SearchCustomers from "./components/SearchCustomers";
import CreateCustomer from "./components/CreateCustomer";
import "./App.css";
import Modal from "@mui/material/Modal";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import cupidImg from "./assets/cupid.png";
import { closeButton, modalBox } from "./MuiStyles";
import SearchIcon from "@mui/icons-material/Search";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CreateIcon from "@mui/icons-material/Create";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchMenu from "./components/SearchMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#B22222",
      main: "#B22222",
      dark: "#B22222",
      contrastText: "#fff",
    },
    secondary: {
      light: "#B22222",
      main: "#B22222",
      dark: "#B22222",
      contrastText: "#000",
    },
  },
  typography: {
    allVariants: {
      color: "white",
    },
    h1: {
      fontFamily: ["Bebas Neue", "sans-serif"].join(","),
      fontSize: 75,
    },
    h2: {
      fontSize: 30,
    },
    h3: {
      fontSize: 40,
    },
    fontWeightMedium: 650,
    fontSize: 15,
    fontFamily: [
      "Inter",
      "system-ui",
      "Avenir",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  const [open, setOpen] = useState(false);
  const [component, setComponent] = useState("CreateCustomer");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="titleContainer">
        <h1 className="pageTitle">
          <img className="logo" src={cupidImg} alt="logo" />
          <Typography variant="h1">Cupid's</Typography>
          <img className="logo" src={cupidImg} alt="logo" />
        </h1>
      </div>
      <div className="buttons">
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("SearchDates");
          }}
        >
          <div className="buttonContent">
            <CalendarMonthIcon sx={{ fontSize: "6rem", color: "white" }} />
            <Typography>Check-In Dates</Typography>
          </div>
        </button>
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("CheckInCustomer");
          }}
        >
          <div className="buttonContent">
            <SearchIcon sx={{ fontSize: "6rem", color: "white" }} />
            <Typography>Search for Customer</Typography>
          </div>
        </button>
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("CreateCustomer");
          }}
        >
          <div className="buttonContent">
            <CreateIcon sx={{ fontSize: "6rem", color: "white" }} />
            <Typography>Create New Customer</Typography>
          </div>
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box sx={modalBox}>
            <Button onClick={handleClose} sx={closeButton}>
              <CloseIcon />
            </Button>
            {
              {
                CreateCustomer: <CreateCustomer />,
                CheckInCustomer: <SearchMenu />,
                SearchDates: <SearchDates />,
                SearchCustomer: <SearchCustomers />,
              }[component]
            }
          </Box>
        </div>
      </Modal>
    </ThemeProvider>
  );
}

export default App;
