import { Box, Button, Modal, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "./CreateMember.css";
import { convertDate } from "../utils";
import { modalBox } from "../MuiStyles";

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
  const [coupleID, setCoupleID] = useState("");
  const [couples, setCouples] = useState([]);
  const [partnerProfile, setPartnerProfile] = useState(0);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (memberID !== null) {
      getUser();
      getCouples();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
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
    if (coupleID) {
      axios
        .post(`http://localhost:3000/couples`, {
          member_1: memberID,
          member_2: coupleID,
        })
        .then((response) => {
          console.log(response.data);
          setError("");
        });
    } else {
      setError("Please enter a member ID");
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
            sx={{ width: "15%" }}
          >
            Back
          </Button>
          <Button
            color="error"
            variant="container"
            onClick={deleteUser}
            sx={{ width: "15%" }}
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
                          setPartnerProfile(partner);
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
                  type="text"
                  variant="outlined"
                  placeholder="Couple ID"
                  onChange={(e) => setCoupleID(e.target.value)}
                />
                <Button onClick={addCouple}>Add Couple</Button>
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
              memberID={partnerProfile}
              closeModal={handleClose}
              nested={true}
            />
          </Box>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
