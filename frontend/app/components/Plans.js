import React, { useState, useEffect } from "react";
import Page from "./Page";
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

  // ******** WHOEVER WHO CAN CREATE PLANS IS THE ONE WITH THE APP_PERMIT_OPEN
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
          isEditMode: false,
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
    console.log("This will be for start date: ", plan_startdate);
    //console.log("This will be for start date", newValue.format("DD-MM-YYYY")); // Format date
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
    console.log("This will be for end date: ", plan_enddate);
    //console.log("This will be for end date", newValue.format("DD-MM-YYYY"));
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planData &&
                planData.map((plan, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={plan.plan_mvp_name}
                        size="small"
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="app_startdate"
                          label="Start Date"
                          disabled={!plan.isEditMode}
                          slotProps={{ textField: { size: "small" } }}
                          value={dayjs(plan.plan_startdate, "DD-MM-YYYY")}
                          onChange={(newValue) => {
                            const updatedPlans = planData.map((p, idx) => {
                              if (idx === index) {
                                return {
                                  ...p,
                                  plan_startdate: newValue
                                    ? newValue.format("DD-MM-YYYY")
                                    : "",
                                };
                              }
                              return p;
                            });
                            setPlanData(updatedPlans);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} size="small" />
                          )}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="app_enddate"
                          label="End Date"
                          disabled={!plan.isEditMode}
                          slotProps={{ textField: { size: "small" } }}
                          value={dayjs(plan.plan_enddate, "DD-MM-YYYY")}
                          onChange={(newValue) => {
                            const updatedPlans = planData.map((p, idx) => {
                              if (idx === index) {
                                return {
                                  ...p,
                                  plan_enddate: newValue
                                    ? newValue.format("DD-MM-YYYY")
                                    : "",
                                };
                              }
                              return p;
                            });
                            setPlanData(updatedPlans);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} size="small" />
                          )}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      {plan.isEditMode ? (
                        <>
                          <Button
                            onClick={() => handleSaveClick(index)}
                            variant="contained"
                            color="success"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => handleCancelClick(index)}
                            variant="outlined"
                            color="error"
                            style={{ marginLeft: 10 }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick(index)}
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
