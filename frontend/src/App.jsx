import { useEffect, useState } from "react";
import SearchDates from "./components/SearchDates";
import SearchMember from "./components/SearchMembers";
import CheckInMember from "./components/CheckInMember";
import CreateMember from "./components/CreateMember";
import "./App.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import cupidImg from "./assets/cupid.png";
import { modalBox } from "./MuiStyles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [users, setUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [component, setComponent] = useState("CreateMember");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch("http://localhost:3000/users")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setUsers(data);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="titleContainer">
        <h1 className="pageTitle">
          <img className="logo" src={cupidImg} alt="logo" />
          Cupid's
          <img className="logo" src={cupidImg} alt="logo" />
        </h1>
        {users}
      </div>
      <div className="buttons">
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("SearchMember");
          }}
        >
          <div className="buttonContent">Search for Member</div>
        </button>
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("CheckInMember");
          }}
        >
          <div className="buttonContent">Check-in Member</div>
        </button>
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("CreateMember");
          }}
        >
          <div className="buttonContent">Create New Member</div>
        </button>
      </div>
      <div className="secondaryButtons">
        <button
          className="secondaryButton"
          onClick={() => {
            handleOpen();
            setComponent("SearchDates");
          }}
        >
          Dates
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <p>t</p> */}
        <div>
          <Box sx={modalBox}>
            {
              {
                CreateMember: <CreateMember />,
                CheckInMember: <CheckInMember />,
                SearchDates: <SearchDates />,
                SearchMember: <SearchMember />,
              }[component]
            }
          </Box>
        </div>
      </Modal>
    </ThemeProvider>
  );
}

export default App;
