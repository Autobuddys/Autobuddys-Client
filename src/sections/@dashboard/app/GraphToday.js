import React from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';
// ----------------------------------------------------------------------

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function convertMsToHM(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;

  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}


const d = new Date();
let str1=`Until ${d.toDateString()} - ${convertMsToHM(d.getTime())}`;

export default function GraphToday(props) {

  let tempdata=[];
  let bpmdata=[];
  let spdata=[];
  let bpdata=[];
  let timedata=[];
  let n=props.data.length

  

  for(let i=0;i<n;i++){
    tempdata.push(props.data[i]['tempval'])
    bpmdata.push(props.data[i]['spo2val'])
    spdata.push(props.data[i]['bpmval'])
    bpdata.push(props.data[i]['bpval'])
    let t=props.data[i]['entered_at'].indexOf('T')
    timedata.push(props.data[i]['entered_at'].slice(t+1,t+6))
  }

  const CHART_DATA = [
    {
      name: 'Temperature',
      type: 'column',
      data: tempdata
    },
    {
      name: 'SPo2',
      type: 'column',
      data: spdata
    },
    {
      name: 'Pulse Rate',
      type: 'column',
      data: bpmdata
    },
    {
      name: 'Blood Pressure',
      type: 'column',
      data: bpdata
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '40%', borderRadius: 4 } },
    fill: { type: ['solid', 'solid', 'solid'] },
    labels: timedata,
    xaxis: { type: 'time' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <>
    
      <Card>
        <CardHeader title="All Vitals" subheader={str1} />
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
        </Box>
      </Card>
  </>
  );
}
