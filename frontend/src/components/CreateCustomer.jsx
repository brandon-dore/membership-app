import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useState } from "react";
import Webcam from "react-webcam";
import { sharpButton, textField } from "../MuiStyles";
import "./CreateCustomer.css";
import { convertDate, toBase64 } from "../utils";
import moment from "moment";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const CreateCustomer = (props) => {
  const [firstName, setFirstName] = useState(
    props.first_name ? props.first_name : ""
  );
  const [lastName, setLastName] = useState(
    props.last_name ? props.last_name : ""
  );
  const [dob, setDob] = useState(
    props.birth_date ? moment(props.birth_date, "YYYY-MM-DD") : null
  );
  const [exp, setExp] = useState(
    props.expiry_date ? convertDate(props.expiry_date) : null
  );
  console.log(props.is_member === "Yes");
  const [isMember, setIsMember] = useState(props.is_member === "Yes");
  const [sex, setSex] = useState(props.sex ? props.sex : "");
  const [pic, setPic] = useState(props.photo ? props.photo : null);
  const [notes, setNotes] = useState(props.notes ? props.notes : "");
  const [webcam, isWebcam] = useState("");
  const [webcamError, isWebcamError] = useState("");
  const [errorMsg, setErrorMsg] = useState(0);
  const [showError, setShowError] = useState(false);

  const checkEmpty = () => {
    if (isMember) {
      return !firstName || !lastName || !dob || !sex || !exp;
    }
    return !firstName || !lastName || !dob || !sex;
  };

  const calcExpiry = (increment) => {
    let date = new Date();
    let expiryDate = new Date(date.setMonth(date.getMonth() + increment));
    return expiryDate.toISOString().split("T")[0];
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleSubmit = () => {
    const formdata = {
      first_name: firstName,
      last_name: lastName,
      birth_date: dob,
      expiry_date: isMember ? exp : null,
      sex: sex,
      relationship_status: "Single",
      photo: pic,
      notes: notes ? notes : "",
      is_member: isMember ? "Yes" : "No",
      // Add this to the backend:
      // is_barred: false,
    };

    if (props.id) {
      axios
        .put(`http://localhost:3000/customers/${props.id}`, formdata)
        .then((res) => {
          props.closeModal();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .post("http://localhost:3000/customers", formdata)
        .then((res) => {
          location.reload();
        })
        .catch((e) => {
          if (e.response.status === 400) {
            setErrorMsg(e.response.data);
          } else {
            setErrorMsg(
              `There was an error on the backend with error code: ${e.data.error_code}`
            );
          }
          setShowError(true);
        });
    }
  };

  return (
    <>
      <Typography variant="h1">
        {props.id ? "Edit Customer" : "Create Customer"}
      </Typography>
      <div className="modalContent">
        <form className="formContainer">
          <div className="inputFields">
            <TextField
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              sx={textField}
              id="first_name"
              label="First Name"
              variant="outlined"
            />
            <TextField
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              sx={textField}
              id="last_name"
              label="Last Name"
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="D.O.B."
                onChange={(e) => {
                  setDob(e.format("yyyy-MM-DD"));
                }}
                value={dob}
              />
            </LocalizationProvider>
            <FormControl>
              <InputLabel variant="filled">Sex</InputLabel>
              <Select value={sex} onChange={(e) => setSex(e.target.value)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <div>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMember}
                      onChange={() => setIsMember(!isMember)}
                    />
                  }
                  label="This customer is a member."
                />
              </FormControl>
            </div>
            <div>
              <Typography style={{ marginTop: 0 }}>
                <strong>Expires in:</strong>
              </Typography>
              <div className="expiryPicker">
                <Button
                  disabled={!isMember}
                  variant={exp === calcExpiry(1) ? "contained" : "outlined"}
                  onClick={() => setExp(calcExpiry(1))}
                >
                  1 Months
                </Button>
                <Button
                  disabled={!isMember}
                  variant={exp === calcExpiry(3) ? "contained" : "outlined"}
                  onClick={() => setExp(calcExpiry(3))}
                >
                  3 Months
                </Button>
                <Button
                  disabled={!isMember}
                  variant={exp === calcExpiry(6) ? "contained" : "outlined"}
                  onClick={() => setExp(calcExpiry(6))}
                >
                  6 Months
                </Button>
                <Button
                  disabled={!isMember}
                  variant={exp === calcExpiry(12) ? "contained" : "outlined"}
                  onClick={() => setExp(calcExpiry(12))}
                >
                  1 Year
                </Button>
                {exp && (
                  <Typography>
                    <strong>Expires on {convertDate(exp)}</strong>
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="photoContainer">
            {pic ? (
              <>
                {pic.hasOwnProperty("data") ? (
                  <img
                    src={`data:image/jpeg;base64,${toBase64(pic.data)}`}
                    alt="Picture"
                  />
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${atob(pic)}`}
                    alt="Picture"
                  />
                )}
                <Button
                  sx={sharpButton}
                  onClick={() => setPic(null)}
                  variant="contained"
                >
                  Retake Picture
                </Button>
              </>
            ) : (
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={() => isWebcam(true)}
                onUserMediaError={() => isWebcamError(true)}
              >
                {({ getScreenshot }) => {
                  return (
                    <>
                      {webcam ? (
                        <Button
                          sx={sharpButton}
                          onClick={() =>
                            setPic(btoa(getScreenshot().split(",")[1]))
                          }
                          variant="contained"
                        >
                          Take Picture
                        </Button>
                      ) : (
                        <div className="messageContainer">
                          {webcamError ? (
                            <Typography>Camera Not Dectected </Typography>
                          ) : (
                            <CircularProgress />
                          )}
                        </div>
                      )}
                    </>
                  );
                }}
              </Webcam>
            )}
          </div>
          <div className="notesContainer">
            <TextField
              sx={{ width: "24.5rem" }}
              multiline
              label="Notes (Optional)"
              placeholder="Notes..."
              rows={2}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
        <Button
          disabled={checkEmpty()}
          onClick={handleSubmit}
          color="info"
          variant="contained"
        >
          {props.id ? "Edit Customer" : "Create Customer"}
        </Button>
      </div>
      <Snackbar
        sx={{ position: "absolute" }}
        autoHideDuration={5000}
        open={showError}
        onClose={handleCloseError}
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </>
  );
};

export default CreateCustomer;