import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "./Container";
import { Button, Grid, Typography } from "@mui/material";

export default function TaskHomePage() {
  const { appId } = useParams();
  const navigate = useNavigate();

  const handlePlan = (appId) => {
    navigate(`/app/${appId}/plans`);
  };

  return (
    <div>
      <Container>
        <Grid>
          <Grid item style={{ marginTop: 20 }}>
            <Typography variant="h5">
              <b>{appId} </b>Task Page
            </Typography>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            style={{ marginTop: 30 }}
          >
            <Button
              variant="contained"
              style={{ marginRight: 20 }}
              onClick={() => handlePlan(appId)}
            >
              Edit Plans
            </Button>
            <Button variant="contained">Add Task</Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
