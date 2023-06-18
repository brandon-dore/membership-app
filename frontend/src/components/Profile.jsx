import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./CreateMember.css";
import "./Profile.css";
import { convertDate, toBase64 } from "../utils";
import { modalBox, sharpButton, smallModalBox } from "../MuiStyles";
import ProfilePreview from "./ProfilePreview";
import CreateMember from "./CreateMember";

const Profile = ({ memberID, closeModal, nested = false }) => {
  const [user, setUser] = useState(null);
  const [newCoupleID, setNewCoupleID] = useState("");
  const [coupleID, setCoupleID] = useState(0);
  const [couples, setCouples] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (memberID !== null) {
      getUser();
      getCouples();
    }
  }, []);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    getUser();
    setOpenEdit(false);
  };

  const handleClose = () => {
    setOpen(false);
    getCouples();
  };

  const handleOpenConfirm = () => {
    setConfirm(true);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleOpenPreview = () => {
    if (newCoupleID !== "") {
      setShowPreview(true);
      setError("");
      return;
    }
    setError("Please enter a member ID");
  };

  const getUser = () => {
    axios
      .get(`http://localhost:3000/members/${memberID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setUser(data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteUser = () => {
    axios
      .delete(`http://localhost:3000/members/${memberID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setUser(data[0]);
        handleClosePreview();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getCouples = () => {
    axios
      .get(`http://localhost:3000/couples/${memberID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setCouples(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addCouple = () => {
    if (newCoupleID) {
      axios
        .post(`http://localhost:3000/couples`, {
          member_1: memberID,
          member_2: newCoupleID,
        })
        .then((response) => {
          console.log(response.data);
          setError("");
          setShowPreview(false);
          getCouples();
        });
    } else {
      setError("Please enter a member ID");
    }
  };

  const deleteCouple = () => {
    if (coupleID) {
      axios
        .post("http://localhost:3000/couples/delete", {
          member_1: memberID,
          member_2: coupleID,
        })
        .then((response) => {
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getPartner = (idArr) => {
    return idArr[0] == memberID ? idArr[1] : idArr[0];
  };

  return (
    <>
      {user !== null ? (
        <div>
          <Button
            variant="contained"
            onClick={closeModal}
            sx={{ ...sharpButton, width: "15%" }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenEdit}
            sx={{ ...sharpButton, width: "15%" }}
          >
            Edit user
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenConfirm}
            sx={{ ...sharpButton, width: "15%" }}
          >
            Delete user
          </Button>
          <div>
            <Typography variant="h1">Profile</Typography>

            <Typography variant="h2">First Name</Typography>
            <Typography>{user.first_name}</Typography>
            <Typography variant="h2">Last Name</Typography>
            <Typography>{user.last_name}</Typography>
            <Typography variant="h2">D.O.B</Typography>
            <Typography>
              {convertDate(user.birth_date ? user.birth_date : "Unknown")}
            </Typography>
            <Typography variant="h2">Expiry Date</Typography>
            <Typography>{convertDate(user.expiry_date)}</Typography>
            {couples.length !== 0 && (
              <div>
                <Typography variant="h2">Partners</Typography>
                <div className="partnersContainer">
                  {couples.map((couple) => {
                    let partner = getPartner(Object.values(couple));
                    return !nested ? (
                      <div
                        className="partnerBox clickable"
                        onClick={() => {
                          setOpen(true);
                          setCoupleID(partner);
                        }}
                        key={partner}
                      >
                        <Typography className="partnerContent">
                          {partner}
                        </Typography>
                      </div>
                    ) : (
                      <div key={partner} className="partnerBox">
                        <Typography className="partnerContent">
                          {partner}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="photoContainer">
              {user.photo !== null && toBase64(user.photo.data) !== null ? (
                <img
                  key={user.membership_id}
                  src={`data:image/jpeg;base64,${toBase64(user.photo.data)}`}
                  alt="photo"
                />
              ) : (
                <Typography>No Photo Found</Typography>
              )}
            </div>
            <div className="coupleContainer">
              <Typography variant="h2">Add Couple</Typography>
              <div className="inputContainer">
                <OutlinedInput
                  sx={{ width: "20rem" }}
                  id="couple_id"
                  type="number"
                  variant="outlined"
                  placeholder="Couple ID"
                  onChange={(e) => setNewCoupleID(e.target.value)}
                />
                <Button onClick={handleOpenPreview}>Add Couple</Button>
              </div>
              {error && (
                <p className="errorMessage">Please enter a member ID</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Typography>No profile selected</Typography>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Open Profile"
        aria-describedby="Open Profile"
      >
        <div>
          <Box sx={modalBox}>
            <Profile
              memberID={coupleID}
              closeModal={handleClose}
              nested={true}
            />
            <br />
            <Button onClick={deleteCouple} variant="contained" color="error">
              Remove Partner
            </Button>
          </Box>
        </div>
      </Modal>
      <Modal
        open={showPreview}
        onClose={handleClosePreview}
        aria-labelledby="Couple Profile"
        aria-describedby="Couple Profile"
      >
        <div>
          <Box sx={smallModalBox}>
            <ProfilePreview
              memberID={newCoupleID}
              closeModal={handleClosePreview}
            />
            <div className="confirmContainer">
              <Typography>Is this the user you are looking for? </Typography>
              <div className="confirmButtons">
                <Button onClick={addCouple} variant="contained">
                  Confirm
                </Button>
                <Button onClick={handleClosePreview}>Cancel</Button>
              </div>
            </div>
          </Box>
        </div>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="Confirm Check In"
        aria-describedby="Confirm Check In"
      >
        <Box sx={modalBox}>
          <CreateMember {...user} closeModal={handleCloseEdit} />
        </Box>
      </Modal>

      <Dialog
        open={confirm}
        onClose={handleClose}
        aria-labelledby="confirm-delete-user"
        aria-describedby="confirm-delete-user"
      >
        <DialogTitle id="confirm-delete-user">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-user">
            Would you like to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirm}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={deleteUser} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
