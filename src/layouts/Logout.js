import React,{useEffect} from 'react'
import { Navigate } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';

const Logout = () => {
  useEffect(()=>{
      function logoutUser(){
          const response = axiosInstance.post('elder/auth/logout/blacklist/', {
              refresh_token: localStorage.getItem('refresh_token'),
          });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('patientID');
          localStorage.removeItem('patientName');
          axiosInstance.defaults.headers['Authorization'] = null;
          
        }
      logoutUser();
  })
  return (
   <Navigate to="/login"/>
  )
}

export default Logout