import { Box, Button, Modal, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "./CreateMember.css";
import "./Profile.css";
import { convertDate } from "../utils";
import { modalBox, sharpButton, smallModalBox } from "../MuiStyles";
import ProfilePreview from "./ProfilePreview";

const toBase64 = (arr) => {
  if (arr !== null) {
    const photo = atob(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return photo;
  }
};
const Profile = ({ memberID, closeModal, nested = false }) => {
  const [user, setUser] = useState(null);
  const [newCoupleID, setNewCoupleID] = useState("");
  const [coupleID, setCoupleID] = useState(0);
  const [couples, setCouples] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (memberID !== null) {
      getUser();
      getCouples();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
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
        closeModal();
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
            color="info"
            variant="contained"
            onClick={closeModal}
            sx={{ ...sharpButton, width: "15%" }}
          >
            Back
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={deleteUser}
            sx={{ ...sharpButton, width: "15%" }}
          >
            Delete user
          </Button>
          <div>
            <h1>Profile</h1>
            <h2>First Name</h2>
            {user.first_name}
            <h2>Last Name</h2>
            {user.last_name}
            <h2>D.O.B</h2>
            {convertDate(user.birth_date)}
            <h2>Expiry Date</h2>
            {/* Highlight this if out of date */}
            {convertDate(user.expiry_date)}
            {couples.length && (
              <div>
                <h2>Partners</h2>
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
                        <p className="partnerContent">{partner}</p>
                      </div>
                    ) : (
                      <div key={partner} className="partnerBox">
                        <p className="partnerContent">{partner}</p>
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
                <p>No Photo Found</p>
              )}
            </div>
            <div className="coupleContainer">
              <h2>Add Couple</h2>
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
        <p>No profile selected</p>
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
              <p>Is this the user you are looking for? </p>
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
    </>
  );
};

export default Profile;
