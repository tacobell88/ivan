import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import Page from "./Page";
import { Button, Paper, Select, Table, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Typography } from "@mui/material";
import GlobalContext from "../assets/GlobalContext";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { replaceInvalidDateByNull } from "@mui/x-date-pickers/internals";


function CreateApp () {
    const { handleAlerts } = useContext(GlobalContext);
    const [groupData, setGroupData] = useState([]);
    const [appData, setAppData] = useState({
        app_acronym: '', 
        app_description: '', 
        app_rnumber: '', 
        app_startdate: '', 
        app_enddate: '', 
        app_permit_create: '', 
        app_permit_open: '', 
        app_permit_todolist: '', 
        app_permit_doing: '', 
        app_permit_done: ''
    });
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    
    const navigate = useNavigate();

    //fetch user groups to populate for drop down list for app permissions
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
            }
        };
        fetchGroups();
    }, []);

   //trying out different ways to save date
    const handleStartDateChange = (newValue) => {
        setStartDate(newValue);
        setAppData(prevData => ({
            ...prevData,
            app_startdate: newValue ? newValue.format('DD-MM-YYYY') : ''
        }))
        console.log(newValue.format('DD-MM-YYYY')); // Format date
        console.log('This is trying to see what is app data for start date: ', appData.app_startdate)
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
        setAppData(prevData => ({
            ...prevData,
            app_enddate: newValue ? newValue.format('DD-MM-YYYY') : ''
        }));
        console.log(newValue.format('DD-MM-YYYY'));
        console.log('This is trying to see what is app data for end date: ', appData.app_enddate)
    }

    const handleChange = (e) => {
        setAppData({...appData, [e.target.name]: e.target.value});
        console.log('This is trying to see what is in app data start date: ', appData.app_startdate)
        console.log('This is trying to see what is in app data end date: ', appData.app_enddate)
        console.log('This is trying to see what is in app data: ', appData);
    }

     // handle cancellation of form to bring user back to applications main page
    const handleCancel = async() => {
        navigate('/');
    }

    // handle creating of new application
    const handleSubmit = async(e) => {
        e.preventDefault();

        const newData = {
            app_acronym: appData.app_acronym,
            app_description: appData.app_description,
            app_rnumber: appData.app_rnumber,
            app_startdate: appData.app_startdate,
            app_enddate: appData.app_enddate,
            app_permit_create: appData.app_permit_create,
            app_permit_open: appData.app_permit_open,
            app_permit_todolist: appData.app_permit_todolist,
            app_permit_doing: appData.app_permit_doing,
            app_permit_done: appData.app_permit_done
        }
        console.log('This is the data to be sent to createApp API: ', newData)
        try {
            const response = axios.post('http://localhost:8000/app/createApp', newData)
            console.log(response.data)
            handleAlerts('Application created', true)
            setAppData({
                app_acronym: '', 
                app_description: '', 
                app_rnumber: '', 
                app_startdate: null, 
                app_enddate: null, 
                app_permit_create: '', 
                app_permit_open: '', 
                app_permit_todolist: '', 
                app_permit_doing: '', 
                app_permit_done: ''
            })
        } catch (error) {
            // handle error message
            console.log(error.data.error)
            if (response.data.error.errMessage == " ") {
                handleAlerts('', false)
            }
        }
    }

    return (
        <Page title="Application Page">
            <Paper>
                <form onSubmit={handleSubmit}>
                    <TableContainer style={{marginTop: 40}}>
                    <TableRow>
                        <TableHead>
                            <TableCell>
                                <Typography variant="h5">
                                    <b>Create Application</b>   
                                </Typography>  
                            </TableCell>
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead>
                            <TableCell >
                                <Typography variant="h7">
                                    App Details
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h7">
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
                                label ="Enter app acronym"
                                value={appData.app_acronym}
                                onChange={handleChange}
                                size="small"
                            />
                        </TableCell>
                        <TableCell> 
                            Create Tasks: 
                        </TableCell>
                        <TableCell>
                            <Select
                                name="app_permit_create"
                                value={appData.app_permit_create}
                                onChange={handleChange}
                                size="small"
                            >
                                {groupData.map((group, index) => (
                                    <MenuItem key={index} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell> 
                            App R number: 
                        </TableCell>
                        <TableCell> 
                            <TextField
                                name="app_rnumber"
                                label="Enter a number"
                                value={appData.app_rnumber}
                                onChange={handleChange}
                                size="small"
                            />
                        </TableCell>
                        <TableCell> 
                        Edit Open Tasks: 
                        </TableCell>
                        <TableCell>
                            <Select
                                name="app_permit_open"
                                label="app_permit_open"
                                value={appData.app_permit_open}
                                onChange={handleChange}
                                size="small"
                            >
                                {groupData.map((group, index) => (
                                    <MenuItem key={index} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell> 
                            Description: 
                        </TableCell>
                        <TableCell> 
                            <TextField
                                name="app_description"
                                label="Enter a description"
                                multiline
                                rows={5}
                                value={appData.app_description}
                                onChange={handleChange}
                                size="small"
                            />
                        </TableCell>
                        <TableCell> 
                            Edit To-Do Tasks: 
                        </TableCell>
                        <TableCell>
                            <Select
                                name="app_permit_todolist"
                                label="app_permit_todolist"
                                value={appData.app_permit_todolist}
                                onChange={handleChange}
                                size="small"
                            >
                                {groupData.map((group, index) => (
                                    <MenuItem key={index} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell> 
                            Start Date: 
                        </TableCell>
                        <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name="app_startdate"
                                    label="Start Date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    // renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </TableCell>
                        <TableCell> 
                            Edit Doing Tasks: 
                        </TableCell>
                        <TableCell>
                            <Select
                                name="app_permit_doing"
                                label="app_permit_doing"
                                value={appData.app_permit_doing}
                                onChange={handleChange}
                                size="small"
                            >
                                {groupData.map((group, index) => (
                                    <MenuItem key={index} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell> 
                            End Date: 
                        </TableCell>
                        <TableCell> 
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name="app_enddate"
                                    label="End Date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </TableCell>
                        <TableCell> 
                            Edit Done Tasks: 
                        </TableCell>
                        <TableCell>
                            <Select
                                name="app_permit_done"
                                label="app_permit_done"
                                value={appData.app_permit_done}
                                onChange={handleChange}
                                size="small"
                            >
                                {groupData.map((group, index) => (
                                    <MenuItem key={index} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="right">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCancel()}>
                                Cancel
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Button
                                type="submit"
                                variant="contained" 
                                color="success">
                                Save
                            </Button>
                        </TableCell>
                    </TableRow>
                    </TableContainer>
                </form>
            </Paper>
        </Page>
    )
}

export default CreateApp;