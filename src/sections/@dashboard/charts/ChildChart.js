import React,{useEffect,useState} from 'react'
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';


export default function DailyChart(props) {
  const chartOptions = {
    series: [
        {
            name: props.name,
            data: props.values
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
        categories: props.categories
      },
      legend: {
        position: "bottom"
      },
      grid: {
        show: true
      }
    }
  };
  let title=`${props.name} - ${props.time}`

  return (
    <>
    
      <Card>
        <CardHeader title={title} />
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
            <ReactApexChart
              options={chartOptions.options}
              series={chartOptions.series}
              type="line"
              height={364}
              className="grafik"
            />
        </Box>
      </Card>
  </>
  );
}
