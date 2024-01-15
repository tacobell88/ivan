import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Page from "./Page";
import { Button, Paper, Select, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

function ViewApplication () {
    const { appId } = useParams();
    const [ appData, setAppData ] = useState([])
    const [ isEditMode, setIsEditMode ] = useState(false);
    const [ groupData, setGroupData ] = useState([]);
    const [ isPL, setIsPL ] = useState('');
    
    console.log('This is appId taken from HomePage to be used on ViewApplication: ', appId)

    // This useEffect is running on view applciation page to verify if the user is PL to see edit button
    useEffect(() => {
        console.log('useEffect on View Application running to verify user')
        const validateUser = async() => {
            try {
                const response = await axios.post('http://localhost:8000/checkGroup', {
                    groupname: 'pl'
                  });
                console.log('This is the response from group checking for homepage: ', response)
                if (response) {
                    console.log('User is authorised for add application button')
                    setIsPL(true);
                }
            } catch (error) {
                if(error.response.data.errMessage === "Checking group failed") {
                    console.log('User is not authorized for add application button')
                };
            }
        }
        validateUser();
    }, [])

    useEffect(() => {
        console.log('Running useEffect on View Application page to get specific app info')
        const fetchAppData = async() => {
            try {
                const response = await axios.get('http://localhost:8000/app/showApp', {
                    params: { app_acronym : appId }//use params id here
                });
                console.log(response.data.data)
                setAppData(response.data.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAppData();
    }, [appId])

    //useEffect to fetch all roles to populate the permissions field
    useEffect(() => {
        // API call to fetch user group data
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/getAllRoles');
                console.log(response.data.message)
                const userGroups = response.data.message.map(group => group.groupname);
                setGroupData(userGroups);
            } catch (error) {
                console.error('Error fetching group data:', error);
                // Handle errors as appropriate
            }
        };
        fetchGroups();
    }, [appId]);

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleSaveClick = async () => {
        // Implement API call to update the data
        // axios.post('API_ENDPOINT', updatedData);
        setIsEditMode(false);
    };

    const handleChange = (e) => {
        setAppData({ ...appData, [e.target.name]: e.target.value });
    };

    // this useEffect is just to see what is contained in appData
    useEffect(() => {
        console.log("appData has been updated:", appData);
        console.log("groupData has been updated:", groupData);
    }, [appData, groupData]);

    return (
        <Page title="Application Page">
            <Paper>
                <TableContainer style={{marginTop: 40}}>
                <TableRow>
                    <TableHead>
                        <TableCell>
                            <Typography variant ="h5">
                                <b>View Application</b>
                            </Typography>
                        </TableCell>
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>
                        <TableCell>
                            <Typography variant="h6">
                                App Details
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h6">
                                Permissions
                            </Typography>
                        </TableCell>
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableCell> 
                        Acronym: 
                    </TableCell>
                    <TableCell> 
                        <TextField
                            name="app_acronym"
                            value={appData ? appData.app_acronym : ''}
                            size="small"
                            disabled={true}
                        />
                    </TableCell>
                    <TableCell> 
                        Create Tasks: 
                    </TableCell>
                    <TableCell>
                    <Select
                        name="app_permit_create"
                        size="small"
                        defaultValue={appData.app_permit_create}
                        disabled = {!isEditMode}
                    />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell> 
                        App R number:
                    </TableCell>
                    <TableCell> 
                        <TextField
                            name="app_rnumber"
                            value={appData ? appData.app_rnumber : ''}
                            size="small"
                            disabled = {!isEditMode}
                        />
                    </TableCell>
                    <TableCell> 
                        Edit Open Tasks: 
                    </TableCell>
                    <TableCell>
                    <Select
                        name="app_permit_open"
                        value={appData ? appData.app_permit_open : ''}
                        size="small"
                        disabled = {!isEditMode}
                    />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell> 
                        Description: 
                    </TableCell>
                    <TableCell> 
                        <TextField
                            name="app_description"
                            value={appData ? appData.app_description : ''}
                            size="small"
                            disabled = {!isEditMode}
                        />
                    </TableCell>
                    <TableCell> 
                        Edit To-Do Tasks: 
                    </TableCell>
                    <TableCell>
                        <Select
                            size="small"
                            disabled = {true}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell> 
                        Start Date: 
                    </TableCell>
                    <TableCell> 
                        <TextField
                            name="app_startdate"
                            value={appData ? appData.app_startdate : ''}
                            size="small"
                            disabled = {!isEditMode}
                        />
                    </TableCell>
                    <TableCell> 
                        Edit Doing Tasks: 
                    </TableCell>
                    <TableCell>
                        <Select
                            name="app_permit_doing"
                            value={appData ? appData.app_permit_doing : ''}
                            size="small"
                            disabled = {!isEditMode}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell> 
                        End Date: 
                    </TableCell>
                    <TableCell> 
                        <TextField
                            name="app_enddate"
                            value={appData ? appData.app_enddate : ''}
                            size="small"
                            disabled = {!isEditMode}
                        />
                    </TableCell>
                    <TableCell> 
                        Edit Done Tasks: 
                    </TableCell>
                    <TableCell>
                        <Select
                            size="small"
                            disabled = {true}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {isPL ? <Button 
                                    onClick={isEditMode ? handleSaveClick : handleEditClick}
                                    variant="contained"
                                    color={isEditMode ? "success" : "primary"}
                                >
                                    {isEditMode ? "Save" : "Edit"}
                                </Button> : ''}
                    </TableCell>
                </TableRow>
                </TableContainer>
            </Paper>
        </Page>
    )
}

export default ViewApplication;