import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import {
  Button,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Plans() {
  const { appId } = useParams();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [newPlan, setNewPlan] = useState({
    plan_mvp_name: "",
    plan_startdate: "",
    plan_enddate: "",
    plan_app_acronym: "",
  });
  const [planData, setPlanData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  //   const [planData, setPlanData] = useState({
  //     plan_mvp_name: "",
  //     plan_startdate: "",
  //     plan_enddate: "",
  //     plan_app_acronym: "",
  //   });
  //const [planName, setPlanName] = useState();

  console.log(
    "This is appId taken from KanbanPage to be used on Plan Page: ",
    appId
  );

  useEffect(() => {
    console.log(
      "UseEffect running on plans page to get all plans related to task"
    );
    console.log("Plan_app_acronym", appId);

    const getPlan = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/app/plan/getAllPlans",
          {
            params: { plan_app_acronym: appId },
          }
        );
        const formatData = response.data.data.map((plan) => ({
          ...plan,
          plan_startdate: dayjs(plan.plan_startdate, "DD-MM-YYYY"),
          plan_enddate: dayjs(plan.plan_enddate, "DD-MM-YYYY"),
        }));
        setPlanData(formatData);
        console.log("This is plan information: ", response.data.data);
      } catch (error) {
        console.log("UseEffect Error: ", error.response.data.errMessage);
      }
    };
    getPlan();
  }, []);

  // handling start date change for adding a task
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setNewPlan((prevData) => ({
      ...prevData,
      plan_startdate: newValue ? newValue.format("DD-MM-YYYY") : "",
    }));
    console.log("This will be for start date", newValue.format("DD-MM-YYYY")); // Format date
    // console.log(
    //   "This is trying to see what is plan data for start date: ",
    //   appData.app_startdate
    // );
  };

  // handling end date change for adding a task
  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setNewPlan((prevData) => ({
      ...prevData,
      plan_enddate: newValue ? newValue.format("DD-MM-YYYY") : "",
    }));
    console.log("This will be for end date", newValue.format("DD-MM-YYYY"));
    // console.log(
    //   "This is trying to see what is plan data for end date: ",
    //   appData.app_enddate
    // );
  };

  //handling plan change in the table
  const handlePlanChange = (e) => {
    setNewPlan({
      ...newPlan,
      [e.target.name]: e.target.value,
    });
    console.log("This is trying to see what is in app data: ", newPlan);
  };

  // to create a new plan
  const handleSubmit = async (e) => {
    e.preventDefault();

    //logging what the new app data is being sent to create an app
    try {
      const response = await axios.post(
        "http://localhost:8000/app/plan/createPlan",
        {
          plan_mvp_name: "",
          plan_startdate: "",
          plan_enddate: "",
          params: { plan_app_acronym: appId },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = () => {};

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
  };

  return (
    <Page title="Plans Page">
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="flex-end"
        style={{ marginTop: 45 }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            name="plan_app_name"
            label="Plan Name"
            size="small"
            onChange={handlePlanChange}
            style={{ width: 200, marginRight: 20 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="app_startdate"
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              sx={{ width: 200, marginRight: 2.5 }}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="app_enddate"
              label="End Date"
              value={endDate}
              sx={{ width: 200, marginRight: 2.5 }}
              slotProps={{ textField: { size: "small" } }}
              onChange={handleEndDateChange}
            />
          </LocalizationProvider>
          <Button type="submit" variant="contained">
            Add Plan
          </Button>
        </form>
      </Grid>
      <Grid item>
        <Paper style={{ marginTop: 20 }}>
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planData &&
                planData.map((plan, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={row.plan_mvp_name}
                        size="small"
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="app_startdate"
                          label="Start Date"
                          disabled={!isEditMode}
                          value={startDate}
                          onChange={handleStartDateChange}
                          sx={{ width: 200 }}
                          slotProps={{ textField: { size: "small" } }}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="app_enddate"
                          label="End Date"
                          disabled={!isEditMode}
                          value={endDate}
                          sx={{ width: 200, marginRight: 2.5 }}
                          slotProps={{ textField: { size: "small" } }}
                          onChange={handleEndDateChange}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      {isEditMode ? (
                        <>
                          <Button
                            onClick={handleSaveClick}
                            variant="contained"
                            color="success"
                            style={{ marginLeft: 20 }}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelClick}
                            variant="outlined"
                            color="error"
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleEditClick}
                          variant="contained"
                          color="primary"
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableContainer>
        </Paper>
      </Grid>
    </Page>
  );
}
