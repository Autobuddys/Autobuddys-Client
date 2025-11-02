// material
import React,{useContext,useEffect,useState} from 'react'
import { Box, Grid, Container,  MenuItem, List, ListItem, Typography,Alert, Button, ListItemText, ListItemButton, Divider } from '@mui/material';

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
  
  const [patprof,setPatprof] = useState([])

  // const listPatients = async () => {
  //   console.log(`relative-list/${obj.id}`)
  //   await axiosInstance.get(`relative-list/${obj.id}`)
  //     .then(response=>{
  //         if(response.data===""){
  //             console.log('gadbad jhala')
  //             setPatprof([])
  //         }
  //         else{
  //             console.log(response)
  //             setPatprof(response.data)
  //         }
  //     })
  //     .catch(err=>{
  //         console.log(err)
  //     })
  // };


  useEffect(() =>{
        async function listPatients() {
        console.log(`relative-list/${obj.id}`)
    await axiosInstance.get(`relative-list/${obj.id}`)
      .then(response=>{
          if(response.data===""){
              console.log('gadbad jhala')
              setPatprof([])
          }
          else{
              console.log(response)
              setPatprof(response.data)
          }
      })
      .catch(err=>{
          console.log(err)
      })

        }
        
        listPatients();  
    }, []);
  
  const changePatient=(id,name)=>{
    console.log(id)
    localStorage.removeItem('patientID');
    localStorage.removeItem('patientName');
    localStorage.setItem('patientID', id);
    localStorage.setItem('patientName', name);
    location.reload();
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
      </Grid>:
      
      <div>
        {/* Display the alert */}
        {alert}
        
        
        {console.log(patprof)}

        {/* Conditionally render the patient profiles if there are any */}
        {patprof && patprof.length > 0 && (
          <List>
            {patprof.map((option, index) => (
              <Box key={index}>
                <ListItem
                  onClick={() => changePatient(option.id, option.pname)} 
                  to="#"
                  sx={{
                    py: 1,
                    px: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    textDecoration: 'none', // Optional: remove default link styling
                  }}
                >
                  <ListItemButton 
                    divider={true}>

                  <ListItemText
                    primary={`${option.id} - ${option.pname} (${option.pphone})`} // Showing ID and Name
                    primaryTypographyProps={{
                      variant: 'body1',
                    }}
                  />
                  </ListItemButton>
                </ListItem>

              </Box>
            ))}
          </List>
        )}
      </div>

      }
        
      </Container>
    </Page>
  );
}
export default DashboardApp

// const defaultSize = {
//   fontSize: 50
// }