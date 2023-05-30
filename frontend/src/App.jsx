import { useEffect, useState } from "react";
import SearchDates from "./components/SearchDates";
import SearchMember from "./components/SearchMembers";
import CheckInMember from "./components/CheckInMember";
import CreateMember from "./components/CreateMember";
import "./App.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "black",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
    <div>
      <div className="titleContainer">
        <h1 className="pageTitle">
          <img className="logo" src="public/cupid.png" alt="logo" />
          Cupid's
          <img className="logo" src="public/cupid.png" alt="logo" />
        </h1>
        {users}
      </div>
      <div className="buttons">
        <button
          className="primaryButton"
          onClick={() => {
            handleOpen();
            setComponent("x");
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
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>

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
    </div>
  );
}

export default App;
