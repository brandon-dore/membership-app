import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./CreateMember.css";

const toBase64 = (arr) => {
  if (arr !== null) {
    const photo = atob(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return photo;
  }
};
const Profile = ({ memberID, closeModal }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (memberID !== null) {
      getUser(memberID);
    }
  }, []);

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

  return (
    <>
      {user !== null ? (
        <div>
          <Button
            variant="contained"
            onClick={closeModal}
            sx={{ width: "15%" }}
          >
            Back
          </Button>
          <Button onClick={deleteUser} sx={{ width: "15%" }}>
            Delete user
          </Button>
          <div>
            <Typography variant="h1">Profile</Typography>

            <Typography variant="h2">First Name</Typography>
            <Typography>{user.first_name}</Typography>
            <Typography variant="h2">Last Name</Typography>
            <Typography>{user.last_name}</Typography>
            <Typography variant="h2">D.O.B</Typography>
            <Typography>{user.dob ? user.dob : "Unknown"}</Typography>
            <Typography variant="h2">Expiry Date</Typography>
            <Typography>{user.expiry_date}</Typography>
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
          </div>
        </div>
      ) : (
        <Typography>No profile selected</Typography>
      )}
    </>
  );
};

export default Profile;
