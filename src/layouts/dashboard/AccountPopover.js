// import { useRef, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// // components
// import Iconify from '../../components/Iconify';
// import MenuPopover from '../../components/MenuPopover';

// import axiosInstance from '../../axiosInstance';


// export default function AccountPopover(props) {
//   const anchorRef = useRef(null);
//   const [open, setOpen] = useState(false);
//   const [patprof,setPatprof] = useState([])


//   const handleOpen =async () => {
//     await axiosInstance.get(`relative-list/${props.user.id}`)
//       .then(response=>{
//           if(response.data===""){
//               console.log('gadbad jhala')
//               setPatprof([])
//           }
//           else{
//               setPatprof(response.data)
//           }
//       })
//       .catch(err=>{
//           console.log(err)
//       })
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const changePatient=(id,name)=>{
//     console.log(id)
//     localStorage.removeItem('patientID');
//     localStorage.removeItem('patientName');
//     localStorage.setItem('patientID', id);
//     localStorage.setItem('patientName', name);
//     handleClose()
//     location.reload();
//   }

//   return (
//     <>
//       <Button
//         ref={anchorRef}
//         onClick={handleOpen}
//         style={{width:'180px',alignSelf:'center'}}
//         size="large"
//         // sx={{
//         //   padding: 0,
//         //   width: 44,
//         //   height: 44,
//         //   ...(open && {
//         //     '&:before': {
//         //       zIndex: 1,
//         //       content: "''",
//         //       width: '100%',
//         //       height: '100%',
//         //       borderRadius: '50%',
//         //       position: 'absolute',
//         //       bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
//         //     }
//         //   })
//         // }}
//         variant='contained'
//       >
//         Choose Patient
//         {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
//       </Button>

//       <MenuPopover
//         open={open}
//         onClose={handleClose}
//         anchorEl={anchorRef.current}
//         sx={{ width: 220 }}
//       >
//         {/* <Box sx={{ my: 1.5, px: 2.5 }}>
//           <Typography variant="subtitle1" noWrap>
//             {props.user.name}
//           </Typography>
//           <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
//             {props.user.email}
//           </Typography>
//         </Box> */}

//         <Divider sx={{ my: 1 }} />

//         {patprof.length!=0?
//         patprof.map((option,index) => (
         
//           <MenuItem
//             key={index}
//             to="#"
//             component={RouterLink}
//             onClick={()=>changePatient(option["id"],option["pname"])}
//             sx={{ typography: 'body2', py: 1, px: 2.5 }}
//           >
//             {/* <Iconify icon="eva:person-fill" /> */}
//             <span> </span>
//             <Typography variant="body1">
//               {option["id"]} - {option["pname"]}
//             </Typography>
            
//           </MenuItem>
//         )):
//         <MenuItem
//             to="/patient"
//             component={RouterLink}
//             sx={{ typography: 'body2', py: 1, px: 2.5 }}
//           >
//             Add Patients
            
//           </MenuItem>
//         }

        
//       </MenuPopover>
//     </>
//   );
// }
import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import MenuPopover from '../../components/MenuPopover';
import axiosInstance from '../../axiosInstance';

export default function AccountPopover(props) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [patprof, setPatprof] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [filteredPatients, setFilteredPatients] = useState([]);

  
  const handleOpen = async () => {
    try {
      const response = await axiosInstance.get(`relative-list/${props.user.id}`);
      if (response.data === "") {
        setPatprof([]);
        setFilteredPatients([]);
      } else {
        setPatprof(response.data);
        setFilteredPatients(response.data);
      }
    } catch (err) {
      console.log(err);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changePatient = (id, name) => {
    localStorage.removeItem('patientID');
    localStorage.removeItem('patientName');
    localStorage.setItem('patientID', id);
    localStorage.setItem('patientName', name);
    handleClose();
    location.reload();
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patprof);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = patprof.filter((p) => {
      if (searchBy === 'name') return p.pname.toLowerCase().includes(term);
      if (searchBy === 'id') return p.id.toString().includes(term);
      return true;
    });
    setFilteredPatients(filtered);
  }, [searchTerm, searchBy, patprof]);

  return (
    <>
      
      <Button
        ref={anchorRef}
        onClick={handleOpen}
        style={{ width: '180px', alignSelf: 'center' }}
        size="large"
        variant="contained"
      >
        Choose Patient
      </Button>

      
      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 260 }}
      >
        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={`Search by ${searchBy}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              row
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <FormControlLabel value="name" control={<Radio />} label="Name" />
              <FormControlLabel value="id" control={<Radio />} label="ID" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            maxHeight: 280,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {filteredPatients.length !== 0 ? (
            filteredPatients.map((option, index) => (
              <MenuItem
                key={index}
                to="#"
                component={RouterLink}
                onClick={() => changePatient(option["id"], option["pname"])}
                sx={{ typography: 'body2', py: 1, px: 2.5 }}
              >
                <Typography variant="body1">
                  {option["id"]} - {option["pname"]}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem
              to="/patient"
              component={RouterLink}
              sx={{ typography: 'body2', py: 1, px: 2.5 }}
            >
              Add Patients
            </MenuItem>
          )}
        </Box>
      </MenuPopover>
    </>
  );
}