import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./CreateMember.css";
import { sharpButton, textField } from "../MuiStyles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Webcam from "react-webcam";
import axios from "axios";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const CreateMember = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [exp, setExp] = useState("");
  const [pic, setPic] = useState("");

  const handleSubmit = () => {
    console.log(firstName, lastName, dob, exp);
    const formdata = {
      first_name: firstName,
      last_name: lastName,
      dob: dob,
      expiry_date: exp,
      photo: pic,
    };
    axios
      .post("http://localhost:3000/users", formdata)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div>
        <h1>Create</h1>
      </div>
      <div className="modalContent">
        <form className="formContainer">
          <div className="inputFields">
            <TextField
              onChange={(e) => setFirstName(e.target.value)}
              sx={textField}
              id="first_name"
              label="First Name"
              variant="outlined"
            />
            <TextField
              onChange={(e) => setLastName(e.target.value)}
              sx={textField}
              id="last_name"
              label="Last Name"
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="D.O.B."
                onChange={(e) => setDob(e.format("yyyy-MM-DD"))}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Expiry Date"
                onChange={(e) => setExp(e.format("yyyy-MM-DD"))}
              />
            </LocalizationProvider>
          </div>
          <div className="photoContainer">
            {pic == "" ? (
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              >
                {({ getScreenshot }) => {
                  return (
                    <Button
                      sx={sharpButton}
                      onClick={() => setPic(getScreenshot())}
                      variant="contained"
                    >
                      Take Picture
                    </Button>
                  );
                }}
              </Webcam>
            ) : (
              <>
                <img src={pic} alt="Picture" />
                <Button
                  sx={sharpButton}
                  onClick={() => setPic("")}
                  variant="contained"
                >
                  Retake Picture
                </Button>
              </>
            )}
          </div>
        </form>
        <Button onClick={handleSubmit} color="info" variant="contained">
          Create Member
        </Button>
      </div>
    </>
  );
};

export default CreateMember;
