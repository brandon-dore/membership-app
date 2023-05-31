import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import "./CreateMember.css";
import axios from "axios";

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
    console.log(memberID);
    if (memberID !== null) {
      console.log(memberID);
      getUser(memberID);
    }
  }, []);

  const getUser = (memberID) => {
    axios
      .get(`http://localhost:3000/users/${memberID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log(data[0]);
        setUser(data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {user !== null ? (
        <div className="profileModal">
          <Button
            color="info"
            variant="contained"
            onClick={closeModal}
            sx={{ width: "15%" }}
          >
            Back
          </Button>
          <div>
            <h1>Profile</h1>

            <h2>First Name</h2>
            {user.first_name}
            <h2>Last Name</h2>
            {user.last_name}
            <h2>D.O.B</h2>
            {user.dob}
            <h2>Expiry Date</h2>
            {user.expiry_date}
            <div className="photoContainer">
              {user.photo !== null || toBase64(user.photo.data) !== null ? (
                <img
                  key={user.membership_id}
                  src={`data:image/jpeg;base64,${toBase64(user.photo.data)}`}
                  alt="photo"
                />
              ) : (
                <p>No Photo Found</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>No profile selected</p>
      )}
    </>
  );
};

export default Profile;
