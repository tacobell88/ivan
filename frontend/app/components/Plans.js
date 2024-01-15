import React, {useState, useEffect} from 'react'
import Page from './Page'
import { Button, Grid, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function Plans() {
    const { appId } = useParams

    useEffect(() => {
        const getPlan = async() => {
            try {
                const reponse = axios.get('http://localhost:8000/app/plan/getAllPlans')
            } catch (error) {
                
            }
        } 
        getPlan();
    }, [])

    const handleAdd = () => {

    }

  return (
    <Page title="Plans Page">
        <Grid container spacing={2} alignItems="center" justifyContent="flex-end" style={{marginTop : 30}}>
            <Button
                onClick={handleAdd}
                variant='contained'
                >
                Add Plan
            </Button>
        </Grid>
        <Grid>
            <TableContainer>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Plan Name
                        </TableCell>
                        <TableCell>
                            Start Date
                        </TableCell>
                        <TableCell>
                            End Date
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            
                        </TableCell>
                    </TableRow>
                </TableBody>
            </TableContainer>
        </Grid>
    </Page>
  )
}
