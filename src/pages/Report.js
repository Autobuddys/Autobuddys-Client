import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {Grid,Container, Stack, Typography,Alert,Button,Snackbar,IconButton,Collapse,TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Page from '../components/Page';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axiosInstance from 'src/axiosInstance';
import axios from 'axios';
import ReportComp from '../components/ReportComp';


export default function Report() {
  const [open, setOpen] = useState(true);
  const [able1,setAble1] = useState(false);
  const [able2,setAble2] = useState(false);
  const [fromto,setFromto] = useState(false);
  const [from,setFrom] = useState(null)
  const [to,setTo] = useState(null)
  const [year,setYear] = useState(null)
  const [monyear,setMonyear] = useState(null)
  const [snack, setSnack] = useState(false);
  const [snackmsg,setSnackmsg] = useState(false)
  const [alertDur,setAlertDur] = useState('')
  const [openalert,setOpenalert] = useState(false);

  let patientID = localStorage.getItem("patientID")



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack(false);
    setSnackmsg(false);
  };

  const notvalidDur=(r)=>{
    setAlertDur(r)
    setOpenalert(true)
  }

  


  const handleReport = async (e)=>{
    e.preventDefault();
    let now = new Date();
    if(from && to){
      
      if(((from.getFullYear()-to.getFullYear()<0) 
      || (from.getFullYear()==to.getFullYear() && (from.getMonth()<to.getMonth() || (from.getMonth()==to.getMonth() && from.getDate()<to.getDate()))) 
      || (from.getFullYear()==to.getFullYear() && from.getMonth()==to.getMonth() && from.getDate()==to.getDate()) )
      && (((from.getFullYear()<now.getFullYear()) && (to.getFullYear()<now.getFullYear())) || ((from.getFullYear()==now.getFullYear()) && (to.getFullYear()==now.getFullYear()) && ((from.getMonth()<now.getMonth()) && (to.getMonth()<now.getMonth()) || (from.getMonth()==now.getMonth()) && (to.getMonth()==now.getMonth()) && (from.getDate()<=now.getDate()) && (to.getDate()<=now.getDate()))))
      ){
        // console.log(from.getDate(),to.getDate())
        await axiosInstance.post('/report-data/', {
          type:"dates",
          fromY:from.getFullYear(),
          toY:to.getFullYear(),
          fromM:from.getMonth(),
          toM:to.getMonth(),
          fromD:from.getDate(),
          toD:to.getDate(),
          dur:"total",
          patID:patientID
        })
        .then((res)=>{
          if(res.data==='done!'){
            axios.get(`https://autobuddys-server.herokuapp.com/elder/report-data/3`,{
            headers: {
              Authorization: localStorage.getItem('access_token')? ('JWT ' + localStorage.getItem('access_token')): null,
            },
            responseType: 'blob'
          }).then((response) => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          })
          }
          else notvalidDur(res.data)
          
        })
      }
      else{
        setSnackmsg(true)
      }
    }
    else if(monyear){
      if(monyear.getFullYear()<=now.getFullYear() && monyear.getMonth()<=now.getMonth()){
        await axiosInstance.post('/report-data/', {
          type:"dates",
          fromY:monyear.getFullYear(),
          fromM:monyear.getMonth(),
          dur:"monyear",
          patID:patientID
        })
        .then((res)=>{
          if(res.data==='done!'){
            axios.get(`https://autobuddys-server.herokuapp.com/elder/report-data/3`,{
            headers: {
              Authorization: localStorage.getItem('access_token')? ('JWT ' + localStorage.getItem('access_token')): null,
            },
            responseType: 'blob'
          }).then((response) => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          })
          }
          else notvalidDur(res.data)
        })
      }
      else{
        setSnackmsg(true)
      }
    }
    else if(year){
      if(year.getFullYear()<=now.getFullYear()){
        await axiosInstance.post('/report-data/', {
          type:"dates",
          fromY:year.getFullYear(),
          dur:"year",
          patID:patientID
        })
        .then((res)=>{
          if(res.data==='done!'){
            axios.get(`https://autobuddys-server.herokuapp.com/elder/report-data/3`,{
            headers: {
              Authorization: localStorage.getItem('access_token')? ('JWT ' + localStorage.getItem('access_token')): null,
            },
            responseType: 'blob'
          }).then((response) => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          })
          }
          else notvalidDur(res.data)
        })
        

      }
      else{
        setSnackmsg(true)
      }
    }
    else{
      setSnack(true);
    }
  }

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


  return (
    <Page title="Dashboard: Report | AutoBuddys">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>

          <Collapse in={open}>
            <Alert
            severity='info'
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Either choose "date FROM and TO" or "YEAR and MONTH" or just "YEAR".
            </Alert>
          </Collapse>
          
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <DatePicker
                disabled={fromto}
                openTo="year"
                views={['year', 'month', 'day']}
                label="FROM : "
                value={from}
                onChange={(newValue) => {
                  setFrom(newValue);
                  setAble1(true)
                  setAble2(true)
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <DatePicker
                  openTo="year"
                  disabled={fromto}
                  views={['year', 'month', 'day']}
                  label="TO : "
                  value={to}
                  onChange={(newValue) => {
                    setTo(newValue);
                    setAble1(true)
                    setAble2(true)
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Grid>
              {/* <h5>OR</h5> */}
              <Grid item xs={12} sm={6} lg={3}>
                <DatePicker
                  disabled={able1}
                  views={['year', 'month']}
                  label="YEAR AND MONTH :"
                  minDate={new Date('2012-03-01')}
                  maxDate={new Date('2023-06-01')}
                  value={monyear}
                  onChange={(newValue) => {
                    setMonyear(newValue);
                    setFromto(true)
                    setAble2(true)
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Grid>
              {/* <h5>OR</h5> */}

              <Grid item xs={12} sm={6} lg={3}>
                <DatePicker
                  disabled={able2}
                  views={['year']}
                  label="YEAR : "
                  value={year}
                  onChange={(newValue) => {
                    setYear(newValue);
                    setFromto(true)
                    setAble1(true)
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Grid>
            
            </Grid>
          {/* </Stack> */}
        </LocalizationProvider>

        <Stack direction="row" spacing={2} sx={{marginTop:5}}>
          <Button
              style={{width:'150px',alignSelf:'center',fontSize:'17px'}}
              size="large"
              variant="contained"
              onClick={handleReport}
              >
              Get Report
            </Button>

            <Button
              style={{width:'150px',alignSelf:'center',fontSize:'17px'}}
              size="large"
              variant="contained"
              onClick={()=>{
                setMonyear(null)
                setYear(null)
                setTo(null)
                setFrom(null)
                setFromto(false)
                setAble1(false)
                setAble2(false)
                setOpenalert(false)
              }}
              >
              Reset All
            </Button>
        </Stack>
        
        <ReportComp />

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}

        {/* <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid> */}
        {alertDur?
        <Collapse in={openalert}>
            <Alert
            severity='warning'

              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenalert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2, width:'500px'}}
            >
              {alertDur}
            </Alert>
          </Collapse>:null}
        <Snackbar
          open={snack}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Please select a duration!"
          action={action}
      />
      <Snackbar
        open={snackmsg}
        autoHideDuration={6000}
        onClose={handleClose}
        message="The duration entered is invalid!"
        action={action}
      />
      </Container>
    </Page>
  );
}
