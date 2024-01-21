import { Autocomplete, Box, Button, Grid, Paper, Select, Table, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";


const ViewTask = React.forwardRef((props, ref) => {
  const taskId = props.taskId;
  const appAcronym = props.taskAcronym;
  const [taskData, setTaskData] = useState([])

  const fetchTaskData = async() => {
    try {
      const response = await axios.post("http://localhost:8000/app/task/getTask", {
        task_id : taskId
      })
      console.log(response.data.data)
      setTaskData(response.data.data)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    fetchTaskData()
  }, [])
  
  //useEffect for debugging purposes
  useEffect(()=> {
    // console.log("Updated task data: ", newTaskData)
    console.log("This is the task_app_acronym used in viewTask page: ", appAcronym);
    console.log("This is the task_id used in viewTask page: ", taskId);
    console.log("This is task information in viewTask page: ", taskData);
    
  },[taskId, taskData])

  return (
    <Paper
      style={{
        padding: "20px",
        marginTop: 75,
        width: 1000,
        marginLeft: "auto",
        marginRight: "auto",
        height: 1000,
      }}
    >
      <Typography variant="h5" style={{ marginBottom: 40 }}>
          <b>View Task for {taskId}</b>
      </Typography>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={6}>
          <TextField label="Task Name" size="small" fullWidth margin="normal" />
          <TextField label="Task Description" size="small" fullWidth margin="normal" />
          
          <TextField label="Task Owner" size="small" fullWidth margin="normal" />
          <TextField label="Task Status" size="small" fullWidth margin="normal" />
          <TextField label="Task Create Date" size="small" fullWidth margin="normal" />
          <TextField label="Task Creator" size="small" fullWidth margin="normal" />
          <Autocomplete
            
            renderInput={(params) => <TextField {...params} label="Task Plan" margin="normal" />}
            size="small"
            fullWidth
          />
        </Grid>
        {/* Right Column */}
        <Grid item xs={6}>
        <Typography>Task Notes</Typography>
          <TextField label="Task Notes" multiline rows={15} fullWidth />
        </Grid>
        
      </Grid>
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button type="submit" variant="contained">
          Edit
        </Button>
      </Box>
      </Paper>
  );
})

export default ViewTask
