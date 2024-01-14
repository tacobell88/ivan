import React, { useState, useEffect } from "react";
import { Link, Route, useNavigate, useParams } from "react-router-dom";
import Page from "./Page";
import { Box, Button, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import MuiLink from '@mui/material/Link';

function HomePage () {
    const [ appData, setAppData ] = useState();
    const [ isPM, setIsPM ] = useState('');
    const navigate = useNavigate();
    //const { appId } = useParams();

    // useEffect in place to check user group to see if it's PM
    // only PM is allowed to have 'Add Application' button
    useEffect(() => {
        console.log('useEffect on Home Page running to verify user')
        const validateUser = async() => {
            try {
                const response = await axios.post('http://localhost:8000/checkGroup', {
                    groupname: 'pl'
                  });
                console.log('This is the response from group checking for homepage: ', response)
                if (response) {
                    console.log('User is authorised for add application button')
                    setIsPM(true);
                }
            } catch (error) {
                if(error.response.data.errMessage === "Checking group failed") {
                    console.log('User is not authorized for add application button')
                };
            }
        }
        validateUser();
    }, [])

    useEffect(()=> {
        const fetchAppData = async() => {
            try {
                const response = await axios.get('http://localhost:8000/app/showAllApps')
                console.log('This is the fetched application data: ', response)
                setAppData(response.data.data.map(application => ({
                    ...application,
                    app_description : application.app_description || ''
                })));
            } catch (error) {
                console.log(error);
            }
            
        }
        fetchAppData();
    }, [])

    const handleAdd = () => {
        //routing to create application page
        navigate('/app/create-app')
    }

    const handleView = (appId) => {
        navigate(`/app/${appId}`)
    }

    const handlePlans = (appId) => {
        navigate(`/app/${appId}/plans`)
    }


    return (
        <Page title="Home Page">
        {/* THIS APPLICATION BUTTON IS THE ROUTE TO PAGE TO ADD NEW APPLICATION */}
        {isPM ? <Button onClick={handleAdd} style={{marginTop : 30}}> Add Application </Button> : <></>}
        <Paper style={{marginTop : 20}}>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <TableContainer>
                <TableHead sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableRow>
                    <TableCell> Acronym </TableCell>
                    <TableCell> Start Date </TableCell>
                    <TableCell> End Date </TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {appData && appData.map((row) => (
                    <TableRow key={row.app_acronym}>
                        <TableCell>
                            {row.app_acronym}
                        </TableCell>
                        <TableCell>
                            {row.app_startdate}
                        </TableCell>
                        <TableCell>
                            {row.app_enddate}
                        </TableCell>
                        <TableCell>
                                <Button onClick={() => handleView(row.app_acronym)}>View</Button>
                        </TableCell>
                        <TableCell>
                            <Button onClick={() => handlePlans(row.app_acronym)}>Plans</Button>
                        </TableCell>    
                    </TableRow>
            ))}
            </TableBody>
            </TableContainer>
            </Box>
        </Paper>
        </Page>
    )
}

export default HomePage