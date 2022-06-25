import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {Grid,Container, Stack, Typography,Alert,Button,Box,Snackbar,IconButton,Collapse,TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Page from '../components/Page';
import axiosInstance from 'src/axiosInstance';


export default function Notification() {
  
  const [all,setAll] = useState([])
  const [err,setErr] = useState()
  const [acc,setAcc] = useState(0)
  const [resp,setResponse] = useState()
  const [open, setOpen] = useState(true);

  const [opensnack, setOpensnack] = useState(false);

  const handleClick = () => {
    setOpensnack(true);
  };

  const handleClose = (event,reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpensnack(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  
  

  useEffect(()=>{
    let patientID = localStorage.getItem("patientID")
    axiosInstance.get(`getMessages/${patientID}`)
    .then((res)=>{
      if(res.data!="False"){setAll(res.data)}
    })
    .catch(err=>setErr(err))
  },[])

  
  const acceptReq=async()=>{
    setOpen(false)

    const res=await axiosInstance.get(`getnotid/${localStorage.getItem("patientID")}`)
    if(res.data!=="False"){
      
      await axiosInstance.patch(`notification/${res.data[0]['id']}/`,{approved:true,approved_at:new Date()})
      .then((res)=>{
        setAcc(1)
        setResponse("The request has been approved successfully!")
        handleClick()
      })
      .catch(err=>setErr(err))
    }
    
  }

  const rejectReq=async()=>{
    setOpen(false)
    const res=await axiosInstance.get(`getnotid/${localStorage.getItem("patientID")}`)
    if(res.data!=="False"){
      
      await axiosInstance.patch(`notification/${res.data[0]['id']}/`,{rejected:true})
      .then((res)=>{
        setAcc(2)
        setResponse("The request has been rejected successfully!")
        handleClick()
      })
      .catch(err=>setErr(err))
    }
   
  }
  

  return (
    <Page title="Dashboard: Notifications | AutoBuddys">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Notifications
          </Typography>
          {err?<Alert>{err}</Alert>:null}
          
          
          
        </Stack>
        <Box sx={{ width: '100%' }}>
          {all?all.map((item,index)=>(
            <Collapse in={open} key={index}>
              <Alert
                sx={{ mb: 2 }}
              >
                
                {item.message}
                <Stack direction="row" sx={{paddingTop:'15px'}} spacing={6}>
                  <Button onClick={acceptReq} color="success">Accept</Button>
                  <Button onClick={rejectReq} color='error'>Reject</Button>
                </Stack>
              </Alert>
            </Collapse>
          )):null}
          

          
          
        </Box>
      </Container>
      {acc==1 || acc==2?
      <Snackbar
        open={opensnack}
        autoHideDuration={6000}
        onClose={handleClose}
        message={resp}
        action={action}
      />:null}
    </Page>
  );
}
