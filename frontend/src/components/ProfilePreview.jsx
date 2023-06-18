import axios from "axios";
import { useEffect, useState } from "react";
import "./ProfilePreview.css";

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
        <div className="modalContent">
          {/* <Button
            color="info"
            variant="contained"
            onClick={closeModal}
            sx={{ width: "15%" }}
          >
            Back
          </Button> */}
          <div className="pictureContainer">
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
          <div className="namesContainer">
            {user.first_name} {user.last_name}
          </div>
        </div>
      ) : (
        <p>No profile selected</p>
      )}
    </>
  );
};

export default ProfilePreview;
