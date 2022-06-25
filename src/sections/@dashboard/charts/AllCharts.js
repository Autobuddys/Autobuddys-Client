import React from 'react'
// material
import { Grid } from '@mui/material';
import ChildChart from './ChildChart';



export default function AllCharts(props) {
  

  let tempdata=[];
  let bpmdata=[];
  let spdata=[];
  let bpdata=[];
  let timedata=[];
  let n=Object.keys(props.data).length

  // console.log(n)

  var monthNames = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
  };

  

  if(props.name=="Yearly"){
    let tempdata1=[];
    let bpmdata1=[];
    let spdata1=[];
    let bpdata1=[];
    let timedata1=[];
    for(let key in props.data){
      timedata1.push(key)
      timedata.push(key)
      tempdata1.push((props.data[key][0]/props.data[key][4]).toFixed())
      bpdata1.push((props.data[key][1]/props.data[key][4]).toFixed())
      bpmdata1.push((props.data[key][2]/props.data[key][4]).toFixed())
      spdata1.push((props.data[key][3]/props.data[key][4]).toFixed())
    }

    timedata.sort(function(a, b) {
      return monthNames[a] - monthNames[b];
    });
    
    for(let i=0;i<n;i++){
      let a=timedata1.indexOf(timedata[i])
      tempdata.push(tempdata1[a])
      bpdata.push(bpdata1[a])
      bpmdata.push(bpmdata1[a])
      spdata.push(spdata1[a])
    }
    
  }
  else{
    for(let key in props.data){
        timedata.push(key)
        tempdata.push((props.data[key][0]/props.data[key][4]).toFixed())
        bpdata.push((props.data[key][1]/props.data[key][4]).toFixed())
        bpmdata.push((props.data[key][2]/props.data[key][4]).toFixed())
        spdata.push((props.data[key][3]/props.data[key][4]).toFixed())
    }
  }
  

// name values categories time

  return (
    <>
    <Grid item xs={12} md={12} lg={6}>
        <ChildChart name="Temperature" values={tempdata} time={props.name} categories={timedata}/>
    </Grid>
    <Grid item xs={12} md={12} lg={6}>
        <ChildChart name="BPM" values={bpmdata} time={props.name} categories={timedata}/>
    </Grid>
    <Grid item xs={12} md={12} lg={6}>
        <ChildChart name="SpO2" values={spdata} time={props.name} categories={timedata}/>
    </Grid>
    <Grid item xs={12} md={12} lg={6}>
        <ChildChart name="Blood Pressure" values={bpdata} time={props.name} categories={timedata}/>
    </Grid>
      
  </>
  );
}
