import { useState, useEffect, useContext } from 'react';
import { Container, Stack, Typography, Grid,Menu, Button, MenuItem, Alert } from '@mui/material';
// components
import Page from '../components/Page';
// import {ChartSort} from '../sections/@dashboard/charts';
import DailyChart from 'src/sections/@dashboard/charts/DailyChart';
import { makeStyles } from '@mui/styles';
import Iconify from '../components/Iconify';
import AllCharts from '../sections/@dashboard/charts/AllCharts'
import axiosInstance from 'src/axiosInstance';
import { UserContext } from 'src/hooks/UserContext';


const useStyles = makeStyles({
  customWidth: {
    '& div': {
        width: '150px',
    }
}
});

const SORT_BY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];


export default function Charts() {
  const classes = useStyles();
  const { user,isLoading } = useContext(UserContext);
  const [open, setOpen] = useState(null);
  const [nottoday,setNottoday] = useState()
  const [graph,setGraph] = useState()
  const [chart,setChart] = useState()
  const [option,setOption] = useState("Daily");



  let patientID = localStorage.getItem("patientID")
  const obj = JSON. parse(user)
  let alert;
  if(patientID){
    alert=null;
  }
  else{
    alert=<Alert severity="error" style={{width:'500px'}}>Click on the choose a patient button!</Alert>;
  }

  useEffect(()=>{
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
    getGraphVital();

  },[patientID])

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleShow = async (item) =>{

    if(item=="Weekly"){
      await axiosInstance.get(`chart-data/W${patientID}`)
        .then((res)=>{
          if(res.data=="No readings for the week!"){
            setNottoday(res.data)
          }
          else{
            setNottoday(null)
            setChart(res.data)
          }
        })
    }
    else if(item=="Yearly"){
      await axiosInstance.get(`chart-data/Y${patientID}`)
        .then((res)=>{
          if(res.data=="No readings for the year!"){
            setNottoday(res.data)
          }
          else{
            setNottoday(null)
            setChart(res.data)
          }
      })
    }
    else if(item=="Monthly"){
      await axiosInstance.get(`chart-data/M${patientID}`)
        .then((res)=>{
          if(res.data=="No readings for the month!"){
            setNottoday(res.data)
          }

          else{
            setNottoday(null)
            setChart(res.data)
          }
      })
    }
    else{
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
   
    setOption(item)
    setOpen(null)
  }


  return (
    <Page title="Dashboard: Charts | AutoBuddys">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Charts
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-center"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ChartSort /> */}
            <Button
              color="inherit"
              variant="contained"
              disableRipple
              onClick={handleOpen}
              endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              style={{height:'60px',width:'300px',fontSize:'20px'}}
            >
              Choose&nbsp;:&nbsp;&nbsp;
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary',fontSize:'20px' }}>
                {option}
              </Typography>
            </Button>
            <Menu
              keepMounted
              anchorEl={open}
              open={Boolean(open)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              className={classes.customWidth}
            >
              {SORT_BY_OPTIONS.map((item) => (
                <MenuItem
                  key={item.value}
                  selected={item.label === option}
                  onClick={()=>handleShow(item.label)}
                  sx={{ typography: 'h5' }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>
        {!alert?<Grid container spacing={3}>
          
            {option=="Daily"?
            <Grid item xs={12} md={12} lg={12}>
              {!nottoday && graph?<DailyChart data={graph}/>:<Alert severity='info' style={{width:'400px',fontSize:'20px'}}>{nottoday}</Alert>}
            </Grid>:!nottoday && chart?<AllCharts data={chart} name={option}/>:<Alert severity='info' style={{width:'400px',fontSize:'20px'}}>{nottoday}</Alert>}

        </Grid>:alert}
      </Container>
    </Page>
  );
}
