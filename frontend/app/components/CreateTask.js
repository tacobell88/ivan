import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Page from "./Page";
import {
  Button,
  Paper,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Typography,
  makeStyles,
  Grid,
  Box,
} from "@mui/material";
import GlobalContext from "../assets/GlobalContext";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//     },
//   },
//   textarea: {
//     resize: "both",
//   },
// }));

export default function CreateTask() {
  //const classes = useStyles();

  const { appId } = useParams();
  const navigate = useNavigate();
  // used for showing errors in UI
  const { handleAlerts } = useContext(GlobalContext);
  const [isPermitted, setIsPermitted] = useState();

  const checkPermissions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/checkPerms",
        {
          app_state: "create",
        },
        {
          params: { app_acronym: appId },
        }
      );
      console.log(response);
      if (response.data.success === true) {
        setIsPermitted(true);
      }
    } catch (error) {
      if (error.response.data.success === false) {
        const errMessage = error.response.data.errMessage;
        setIsPermitted(false);
        handleAlerts(errMessage, false);
        navigate("/");
      }
      console.log("Error checking permissions: ", error);
    }
  };
  const handleSubmit = () => {};

  useEffect(() => {
    checkPermissions();
  }, []);
  return (
    <form>
      <Paper
        style={{
          padding: "20px",
          marginTop: 40,
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="h5" style={{ marginBottom: 40 }}>
          <b>Create Task for {appId}</b>
        </Typography>
        <Grid container spacing={2}>
          <Grid container item xs={6} direction="column">
            <Typography>Task Name</Typography>
            <TextField size="small"></TextField>
            <Typography style={{ marginTop: 20 }}>Task Description</Typography>
            <TextField size="small"></TextField>
            <Typography style={{ marginTop: 20 }}>Task Plan</Typography>
            <Select size="small"></Select>
          </Grid>
          <Grid container item xs={6} direction="column">
            <Typography>Task Notes</Typography>
            <TextField multiline rows={20}></TextField>
          </Grid>
        </Grid>
        <Box textAlign="center">
          <Button type="submit" variant="contained" style={{ marginTop: 25 }}>
            Create
          </Button>
        </Box>
      </Paper>
    </form>
  );
}
