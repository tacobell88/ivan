import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GlobalContext from "../assets/GlobalContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CreateIcon from "@mui/icons-material/Create";

function PlansTest() {
  const [planData, setPlanData] = useState([]);
  const { appId } = useParams();
  const [planStartDate, setPlanStartDate] = useState();
  const [planEndDate, setPlanEndDate] = useState();
  const { handleAlerts } = useContext(GlobalContext);
  const [isEditMode, setIsEditMode] = useState();

  const fetchAllPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/app/plan/getAllPlans",
        {
          params: { plan_app_acronym: appId },
        }
      );
      console.log(response.data.data);
      if (response) {
        // const formatPlanStartDate = dayjs(
        //   response.data.data.plan_startdate,
        //   "DD-MM-YYYY"
        // );
        // const formatPlanEndDate = dayjs(
        //   response.data.data.plan_enddate,
        //   "DD-MM-YYYY"
        // );
        // setPlanData(
        //   response.data.data.map((plans) => ({
        //     ...plans,
        //     plan_startdate: formatStartDate,
        //     plan_enddate: formatEndDate,
        //   }))
        // );
        console.log(response.data.data);
        // setPlanStartDate(formatPlanStartDate);
        // setPlanEndDate(formatPlanEndDate);
        setPlanData(response.data.data);
      }
    } catch (error) {
      console.log("Catching error for app creation: ", error);
      const errMessage = error.response.data.errMessage;
      handleAlerts(errMessage, false);
    }
  };

  useEffect(() => {
    fetchAllPlans();
  }, []);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  return (
    <Container>
      <Grid
        container
        spacing={20}
        justifyContent="flex-end"
        style={{ marginTop: 45 }}
      >
        <form>
          <TextField
            label="Plan Name"
            size="small"
            style={{ marginRight: 20 }}
          ></TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              sx={{ width: 180, marginRight: 2 }}
              slotProps={{ textField: { size: "small" } }}
            ></DatePicker>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              sx={{ width: 180, marginRight: 2 }}
              slotProps={{ textField: { size: "small" } }}
            ></DatePicker>
          </LocalizationProvider>
          <Button variant="contained" style={{ marginRight: 100 }}>
            Add Plan
          </Button>
        </form>
      </Grid>
      <Grid>
        <Paper
          style={{
            padding: "20px",
            marginTop: 10,
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Plan Start Date</TableCell>
                <TableCell>Plan End Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planData &&
                planData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        size="small"
                        value={row.plan_mvp_name}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: 180 }}
                          slotProps={{ textField: { size: "small" } }}
                          value={dayjs(row.plan_startdate, "DD-MM-YYYY")}
                          disabled={!isEditMode}
                        ></DatePicker>
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: 180 }}
                          slotProps={{ textField: { size: "small" } }}
                          value={dayjs(row.plan_enddate, "DD-MM-YYYY")}
                          disabled={!isEditMode}
                        ></DatePicker>
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell style={{ width: "250px", textAlign: "center" }}>
                      {isEditMode ? (
                        <>
                          <Button
                            variant="outlined"
                            color="error"
                            style={{ marginRight: 10 }}
                            onClick={() => setIsEditMode(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="contained" color="success">
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleEditClick}
                          style={{ alignItems: "center" }}
                          startIcon={<CreateIcon />}
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Container>
  );
}

export default PlansTest;
