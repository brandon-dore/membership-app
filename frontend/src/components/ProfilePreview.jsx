import axios from "axios";
import { useEffect, useState } from "react";
import "./ProfilePreview.css";
import { Typography } from "@mui/material";

const toBase64 = (arr) => {
  if (arr !== null) {
    const photo = atob(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return photo;
  }
};
const ProfilePreview = ({ memberID, closeModal }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (memberID !== null) {
      getUser();
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

  return (
    <>
      {user !== null ? (
        <div className="modalContent">
          <div className="pictureContainer">
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
          <div className="namesContainer">
            <Typography>
              {user.first_name} {user.last_name}
            </Typography>
          </div>
        </div>
      ) : (
        <Typography>No profile selected</Typography>
      )}
    </>
  );
};

export default ProfilePreview;
