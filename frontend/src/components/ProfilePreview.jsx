import axios from "axios";
import { useEffect, useState } from "react";
import "./ProfilePreview.css";
import { Typography } from "@mui/material";

const ProfilePreview = ({ customerID, closeModal }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (customerID !== null) {
      getUser();
    }
  }, []);

  const getUser = () => {
    axios
      .get(`http://localhost:3000/customers/${customerID}`)
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
      {user != null ? (
        <div className="modalContent">
          {user.photo != null ? (
            <div className="photoContainer">
              <img
                key={user.customer_id}
                src={`data:image/jpeg;base64,${user.photo}`}
                alt="photo"
              />
            </div>
          ) : (
            <Typography>No Photo Found</Typography>
          )}
          <div className="namesContainer">
            {user.is_banned ? (
              <>
                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                  BANNED
                </Typography>
                <Typography>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                  BANNED
                </Typography>
              </>
            ) : (
              <Typography>
                {user.first_name} {user.last_name}
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <div className="modalContent">
          <Typography sx={{ color: "red", fontWeight: "bold" }}>
            NO USER FOUND
          </Typography>
        </div>
      )}
    </>
  );
};

export default ProfilePreview;
