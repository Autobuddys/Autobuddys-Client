// material
import React,{useContext,useEffect,useState} from 'react'
import { Box, Grid, Container, Typography,Alert, Button } from '@mui/material';

// components
import Page from '../components/Page';
import {
  AppTasks,
  Bpm,
  BloodPressure,
  Spo2,
  AppNewsUpdate,
  Temperature,
  AppOrderTimeline,
  AppCurrentVisits,
  GraphToday,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../sections/@dashboard/app';

import axiosInstance from "../axiosInstance" 

import {UserContext} from "../hooks/UserContext"
import useAuth from "../hooks/useAuth"
// ----------------------------------------------------------------------

const DashboardApp=()=> {
  const { user } = useContext(UserContext);
  const {fontSize, changeFont} = useAuth()
  const [vital,setVital] = useState()
  const [nottoday,setNottoday] = useState()
  const [graph,setGraph] = useState()
  
  let patientID = localStorage.getItem("patientID")
  let patientName = localStorage.getItem("patientName")
  const obj = JSON. parse(user)
  let alert=null;
  if(patientID){
    alert=null;
  }
  else if(!patientID && !obj['is_medical']){
    alert=<Alert severity="error" style={{width:'500px'}}>Click on the choose a patient button!</Alert>;
  }

  useEffect(()=>{
    
    if(patientID){
      async function getData() {
        await axiosInstance.get(`vitals/${patientID}`)
        .then((res)=>{
          if(res.data=="No readings for today!"){
            setNottoday(res.data)
          }
          else{
            setVital(JSON.parse(res.data))
          }
          
        })

      }

      async function getGraphVital() {
        await axiosInstance.get(`graph-dashboard/${patientID}`)
        .then((res)=>{
          if(res.data=="No readings for today!"){
            setNottoday(res.data)
          }
          else{
            setGraph(res.data)
          }
        })

      }
      getData();
      getGraphVital();



    }
  },[patientID])
  
  return (
      <Page title="AutoBuddys">
      <Container maxWidth="xl">
        {/* FOR TEXT SIZE INCREASING DYNAMIC FEATURE */}
        {/* <Button 
        onClick={() => {
          changeFont('big')
        }}
        >
          Large Size
        </Button> */}
        <Box sx={{ pb: 5 }}>
          {user?
          <>
          <Typography variant="h3" >{`Hi, ${obj["name"]} Welcome back!`}</Typography></>:null}
          {patientName?
          <Typography sx={{paddingTop:'10px'}} style={fontSize}>{`You are viewing ${patientName}'s data`}</Typography>:null}
          
          
        </Box>
        
        
        {!alert?
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {vital?<Temperature vitalpar={vital['tempavg']}/>:<Alert severity='info'>{nottoday}</Alert>}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {vital?<Bpm vitalpar={vital['bpmavg']}/>:null}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {vital?<Spo2 vitalpar={vital['spavg']}/>:null}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {vital?<BloodPressure vitalpar={vital['bpavg']}/>:null}
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          {graph?<GraphToday data={graph}/>:null}
        </Grid>

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits />
        </Grid> */}

        {/* <Grid item xs={12} md={6} lg={8}>
          <AppConversionRates />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentSubject />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppNewsUpdate />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppOrderTimeline />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppTrafficBySite />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppTasks />
        </Grid> */}
      </Grid>:alert
      }
        
      </Container>
    </Page>
  );
}
export default DashboardApp

// const defaultSize = {
//   fontSize: 50
// }