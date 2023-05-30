import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./CreateMember.css";
import { textField } from "../MuiStyles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Webcam from "react-webcam";

const CreateMember = () => {
  const [x, setX] = useState(false);

  const [firstName, setFirstName] = useState("");

  const [pic, setPic] = useState("");

  useEffect(() => {
    getX();
  }, []);

  const getX = () => {
    fetch("")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setX(data);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="formHeader">
        <h1>Create</h1>
      </div>
      <div className="modalContent">
        <form className="formContainer">
          <div className="inputFields">
            <TextField
              onChange={() => setFirstName()}
              sx={textField}
              id="first_name"
              label="First Name"
              variant="outlined"
            />
            <TextField
              onChange={() => setFirstName()}
              sx={textField}
              id="last_name"
              label="Last Name"
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="D.O.B." />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="Expiry Date" />
            </LocalizationProvider>
          </div>
          <div className="photoContainer">
            <Webcam>
              {({ getScreenshot }) => {
                <Button
                  onClick={() => console.log(getScreenshot())}
                  variant="contained"
                >
                  Take Picture
                </Button>;
              }}
            </Webcam>
          </div>
        </form>
        <Button color="info" variant="outlined">
          Create Member
        </Button>
      </div>
    </>
  );
};

export default CreateMember;
