import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "./Container";
import { Button, Divider, Grid, Paper, Stack, Typography, styled } from "@mui/material";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            style={{marginTop : 40}}
          >
            <Item>Open State</Item>
            <Item>To Do State</Item>
            <Item>Doing State</Item>
            <Item>Done State</Item>
            <Item>Closed State</Item>
          </Stack>
        </Grid>
      </Container>
    </div>
  );
}
