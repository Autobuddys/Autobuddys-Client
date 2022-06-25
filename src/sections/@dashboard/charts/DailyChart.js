import React,{useEffect,useState} from 'react'
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';

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

export default function DailyChart(props) {

    let tempdata=[];
    let bpmdata=[];
    let bpdata=[];
    let spdata=[];
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

    const chartOptions = {
        series: [
            {
                name: 'Temperature',
                data: tempdata
              },
              {
                name: 'SPo2',
                data: spdata
              },
              {
                name: 'Pulse Rate',
                data: bpmdata
              },
              {
                name: 'Blood Pressure',
                data: bpdata
              }
        ],
        options: {
          chart: {
            background: "transparent"
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth"
          },
          xaxis: {
            categories: timedata
          },
          legend: {
            position: "bottom"
          },
          grid: {
            show: true
          }
        }
      };



  return (
    <>
    
      <Card>
        <CardHeader title="All Vitals Today" subheader={str1} />
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
            <ReactApexChart
              options={chartOptions.options}
              series={chartOptions.series}
              type="line"
              height={364}
              className="grafik"
            />
          {/* <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} /> */}
        </Box>
      </Card>
  </>
  );
}
