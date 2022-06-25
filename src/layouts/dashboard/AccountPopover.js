import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';

import axiosInstance from '../../axiosInstance';


export default function AccountPopover(props) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [patprof,setPatprof] = useState([])


  const handleOpen =async () => {
    await axiosInstance.get(`relative-list/${props.user.id}`)
      .then(response=>{
          if(response.data===""){
              console.log('gadbad jhala')
              setPatprof([])
          }
          else{
              setPatprof(response.data)
          }
      })
      .catch(err=>{
          console.log(err)
      })
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const changePatient=(id,name)=>{
    console.log(id)
    localStorage.removeItem('patientID');
    localStorage.removeItem('patientName');
    localStorage.setItem('patientID', id);
    localStorage.setItem('patientName', name);
    handleClose()
    location.reload();
  }

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={handleOpen}
        style={{width:'180px',alignSelf:'center'}}
        size="large"
        // sx={{
        //   padding: 0,
        //   width: 44,
        //   height: 44,
        //   ...(open && {
        //     '&:before': {
        //       zIndex: 1,
        //       content: "''",
        //       width: '100%',
        //       height: '100%',
        //       borderRadius: '50%',
        //       position: 'absolute',
        //       bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
        //     }
        //   })
        // }}
        variant='contained'
      >
        Choose Patient
        {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
      </Button>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        {/* <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {props.user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {props.user.email}
          </Typography>
        </Box> */}

        <Divider sx={{ my: 1 }} />

        {patprof.length!=0?
        patprof.map((option,index) => (
         
          <MenuItem
            key={index}
            to="#"
            component={RouterLink}
            onClick={()=>changePatient(option["id"],option["pname"])}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            {/* <Iconify icon="eva:person-fill" /> */}
            <span> </span>
            <Typography variant="body1">
              {option["id"]} - {option["pname"]}
            </Typography>
            
          </MenuItem>
        )):
        <MenuItem
            to="/patient"
            component={RouterLink}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            Add Patients
            
          </MenuItem>
        }

        
      </MenuPopover>
    </>
  );
}
