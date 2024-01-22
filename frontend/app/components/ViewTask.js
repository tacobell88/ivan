import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import GlobalContext from "../assets/GlobalContext";

const ViewTask = React.forwardRef((props, ref) => {
  const taskId = props.taskId;
  const appAcronym = props.app_acronym;
  const { handleAlerts } = useContext(GlobalContext);
  const [taskData, setTaskData] = useState([]);
  const [allPlans, setAllPlans] = useState([]);

  const [editMode, setEditMode] = useState();

  const fetchTaskData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/app/task/getTask",
        {
          task_id: taskId,
        }
      );
      console.log(response.data.data);
      setTaskData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllPlans = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/app/task/getPlans",
        {
          app_acronym: appAcronym,
        }
      );
      const planData = response.data.data.map((plan) => plan.plan_mvp_name);
      setAllPlans(planData);
    } catch (error) {
      console.log(error);
    }
  };

  // handle change for input fields
  const handleChange = (event, newValue, name) => {
    if (name === "task_plan") {
      // Handle change for Autocomplete
      setTaskData((prev) =>
        prev.map((task, index) => {
          if (index === 0) {
            return { ...task, [name]: newValue };
          }
          return task;
        })
      );
    } else {
      // Handle change for other inputs
      const { target } = event;
      setTaskData((prev) =>
        prev.map((task, index) => {
          if (index === 0) {
            return { ...task, [target.name]: target.value };
          }
          return task;
        })
      );
    }
  };
  // const handleChange = (e, newValue) => {
  //   if (e.target.name === "task_plan") {
  //     // Handle change for Autocomplete (task_plan)
  //     setTaskData((currentTaskData) => {
  //       return currentTaskData.map((task, index) => {
  //         if (index === 0) {
  //           return { ...task, task_plan: newValue };
  //         }
  //         return task;
  //       });
  //     });
  //   } else {
  //     // Handle standard TextField changes
  //     const { name, value } = e.target;
  //     setTaskData((currentTaskData) => {
  //       return currentTaskData.map((task, index) => {
  //         if (index === 0) {
  //           return { ...task, [name]: value };
  //         }
  //         return task;
  //       });
  //     });
  //   }
  // };

  // Separate handler for additional notes
  const handleAdditionalNotesChange = (e) => {
    const { value } = e.target;
    setTaskData((currentTaskData) => {
      return currentTaskData.map((task, index) => {
        if (index === 0) {
          return { ...task, task_newNotes: value };
        }
        return task;
      });
    });
  };

  const handleEditClick = () => {
    console.log("clicked");
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    console.log("Save button clicked");
    try {
      //api to send to backend for edittask
      const response = await axios.post(
        "http://localhost:8000/app/task/editTask",
        {}
      );
    } catch (error) {
      const errMessage = error.response.data.errMessage;
      handleAlerts(errMessage, false);
    }
  };

  const handlePromoteSaveClick = async () => {
    try {
      //api to send to backend for edittask
      const response = await axios.post(
        "http://localhost:8000/app/task/editTask",
        {}
      );
    } catch (error) {
      const errMessage = error.response.data.errMessage;
      handleAlerts(errMessage, false);
    }
  };

  const handleDemoteSaveClick = async () => {
    try {
      //api to send to backend for edittask
      const response = await axios.post(
        "http://localhost:8000/app/task/editTask",
        {}
      );
    } catch (error) {
      const errMessage = error.response.data.errMessage;
      handleAlerts(errMessage, false);
    }
  };

  useEffect(() => {
    fetchTaskData();
    fetchAllPlans();
  }, []);

  //useEffect for debugging purposes
  useEffect(() => {
    // console.log("Updated task data: ", newTaskData)
    console.log(
      "This is the task_app_acronym used in viewTask page: ",
      appAcronym
    );
    console.log("This is the task_id used in viewTask page: ", taskId);

    console.log(
      "This is plans information for app in viewTask page: ",
      allPlans
    );
  }, [taskId, allPlans]);


  //debugging what information is being put when task is being edited
  useEffect(() => {
    console.log("This is task information in viewTask page: ", taskData);
    if(taskData) {}
  }, [taskData]);

  useEffect(() => {
    
  })


  return (
    <Paper
      style={{
        padding: "20px",
        marginTop: 75,
        width: "80%", // Adjust the width as needed
        marginLeft: "auto",
        marginRight: "auto",
        maxHeight: "80vh", // Adjust the height as needed
        overflowY: "auto", // Makes content scrollable if it exceeds the height
      }}
    >
      <Typography variant="h5" style={{ marginBottom: 40 }}>
        <b>View Task for {taskId}</b>
      </Typography>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={3}>
          {taskData.map((row, index) => (
            <>
              <Typography>
                <b> Task Name </b>
              </Typography>
              <TextField
                name="task_name"
                disabled={true}
                size="small"
                value={row.task_name || ""}
                fullWidth
                style={{ marginBottom: 15 }}
              />

              <Typography>
                <b>Task Description </b>
              </Typography>
              <TextField
                name="task_description"
                disabled={!editMode}
                size="small"
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: 15 }}
                value={row.task_description || ""}
              />
              <Typography>
                <b>Task Owner</b>
              </Typography>
              <TextField
                name="task_owner"
                disabled={true}
                size="small"
                fullWidth
                value={row.task_owner || ""}
                style={{ marginBottom: 15 }}
              />
              <Typography>
                <b>Task Status </b>
              </Typography>
              <TextField
                name="task_status"
                disabled={true}
                size="small"
                fullWidth
                style={{ marginBottom: 15 }}
                value={row.task_status || ""}
              />
              <Typography>
                <b>Task Create Date</b>
              </Typography>
              <TextField
                name="task_createdate"
                disabled={true}
                size="small"
                fullWidth
                style={{ marginBottom: 15 }}
                value={row.task_createdate || ""}
              />

              <Typography>
                <b>Task Creator</b>
              </Typography>
              <TextField
                name="task_creator"
                disabled={true}
                size="small"
                fullWidth
                value={row.task_creator || ""}
                style={{ marginBottom: 15 }}
              />
              <Typography>
                <b>Task Plan</b>
              </Typography>
              <Autocomplete
                name="task_plan"
                disabled={!editMode}
                options={allPlans}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} />}
                value={taskData[0]?.task_plan || ""}
                onChange={(event, newValue) =>
                  handleChange(event, newValue, "task_plan")
                }
                fullWidth
                style={{ marginBottom: 15 }}
              />
              {/* <Autocomplete
                name="task_plan"
                onChange={handleChange}
                disabled={!editMode}
                options={allPlans.map((plan) => plan)}
                renderInput={(params) => <TextField {...params} />}
                size="small"
                fullWidth
                value={row.task_plan || ""}
                style={{ marginBottom: 15 }}
              /> */}
            </>
          ))}
        </Grid>
        {/* Right Column */}
        <Grid item xs={7}>
          {taskData.map((row) => (
            <>
              <Typography>
                <b>Task Notes </b>
              </Typography>
              <TextField
                name="task_notes"
                multiline
                rows={18}
                fullWidth
                value={row.task_notes}
                disabled={true}
                style={{ width: 650 }}
              />
            </>
          ))}
        </Grid>
      </Grid>
      <Box>
        <Typography>
          <b>Additional Notes</b>
        </Typography>
        <TextField
          name="task_newNotes"
          multiline
          rows={20}
          fullWidth
          disabled={!editMode}
          onChange={handleAdditionalNotesChange}
        />
      </Box>
      <Box textAlign="center" sx={{ mt: 3 }}>
        {editMode ? (
          <>
            <Button
              variant="outlined"
              color="error"
              style={{ marginRight: 10 }}
              onClick={() => handleCancelClick()}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="success"
              style={{ marginRight: 10 }}
              onClick={() => handleSaveClick()}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="success"
              style={{ marginRight: 10 }}
              onClick={() => handlePromoteSaveClick()}
            >
              Save & Promote
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ marginRight: 10 }}
              onClick={() => handleDemoteSaveClick()}
            >
              Save & demote
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => handleEditClick()}>
            Edit
          </Button>
        )}
      </Box>
    </Paper>
  );
});

export default ViewTask;
