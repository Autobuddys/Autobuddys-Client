import React,{ useContext,useState,useRef } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink,useNavigate} from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Button, Snackbar,Collapse, Alert } from '@mui/material';
import Iconify from '../../components/Iconify';
import AccountPopover from './AccountPopover';
import CloseIcon from '@mui/icons-material/Close';
// import LanguagePopover from './LanguagePopover';
// import NotificationsPopover from './NotificationsPopover';

import axiosInstance from 'src/axiosInstance';
import useAuth from 'src/hooks/useAuth';

import { UserContext } from 'src/hooks/UserContext';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12]
}));



DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const { user } = useContext(UserContext);
  const {userlist,getUserList} = useAuth()
  const navigate = useNavigate();
  const idRef = useRef()
  const [err,setErr] = useState([]);
  // console.log(typeof user)
  const obj = JSON. parse(user)

  const [openAlert, setOpenAlert] = useState(true);

  const ismed = obj['is_medical']
  const [open, setOpen] = useState(false);
  const [opensnack, setOpensnack] = useState(false);

  

  const handleClosesnack = (event,reason) => {
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
        onClick={handleClosesnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    getUserList()
  };

  const checkNavigate=()=>{
    if(ismed){
      handleClickOpen();
    }
    else{
      navigate('/patient')
    }
  }

  const handleGotid=async ()=>{
    if(idRef.current.value){
    // to check if the hospital exists or not
    const hospdetail=await axiosInstance.get(`getHosp/${obj['id']}`)


    // to check if a request has already been sent to the patient
    const canadd = await axiosInstance.get(`checkhospID/${idRef.current.value}`)
    
    if(canadd.data=="Not there"){
      // console.log("not there")
      handleClose()
      setErr(["This patient does not exist!","error"])
      setOpenAlert(true);
      return
    }
    else{
      if(hospdetail && canadd.data){
        axiosInstance.post('notification/',{patid:idRef.current.value,staffid:hospdetail.data['id'],message:`${hospdetail.data['hospname']} has sent a joining request. If not valid, reject the request else approve.`})
        .then((res)=>{
            
            axiosInstance.post('email/',{patid:idRef.current.value,doctid:obj['id']})
            .then((res)=>{
                
                // navigate('/dashboard/staff')
                
                // navigate('/dashboard/staff')
                location.reload()
                handleClose()
                setOpensnack(true)

            })
            .catch((err)=>{
                setErr([err.response.data,"error"])
                setOpenAlert(true);
            })
            
  
        })
        .catch((err)=>{
            setErr([err.response.data,"error"])
            setOpenAlert(true);
        })
      }
      else{
        handleClose()
        setErr(["Patient has already been added!","info"])
        setOpenAlert(true);
      }

    }
    }
    else{
      handleClose()
      setErr(["Please input a valid Patient ID!","warning"])
      setOpenAlert(true);
    }
    

        

    
  }

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          
          
          {err[0]?
              <Collapse in={openAlert} sx={{mt:2}}>
                  <Alert
                    severity={err[1]}
                    variant="filled"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {err[0]}
                  </Alert>
                </Collapse>
          :null}

          <Button
            style={{width:'150px',alignSelf:'center'}}
            size="large"
            onClick={checkNavigate}
            variant="contained"
            >
            Add Patient
          </Button>
          {!ismed?<AccountPopover user={obj}/>:null}
          <Box sx={{ mb: 2, mx: 2.5,mt:2 }}>
            {/* {obj?<Link underline="none" component={RouterLink} to="/dashboard/user">
              <AccountStyle>
                <Avatar src={account.photoURL} alt="photoURL" />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {obj.name}
                  </Typography>
                  
                </Box>
              </AccountStyle>
            </Link>:null} */}
          </Box>

          
          
        </Stack>
      </ToolbarStyle>
        <Dialog open={open} onClose={handleClose} maxWidth="md">
          <DialogTitle>Add Patient</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the Patient ID :
            </DialogContentText>
            <TextField
              inputRef={idRef}
              autoFocus
              margin="dense"
              id="id"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGotid}>Done</Button>
            {/* <Button onClick={handleClose}>Subscribe</Button> */}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={opensnack}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Request has been sent successfully!"
          action={action}
        />
    </RootStyle>
  );
}
