import React,{ useRef,useContext,useState,useEffect} from 'react'
import { styled } from '@mui/material/styles';
import { TextField,Card, Stack,Container, Typography, CardContent,Button,Alert } from '@mui/material';
import axiosInstance from 'src/axiosInstance';
import { UserContext } from 'src/hooks/UserContext';
import Page from 'src/components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));


const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '47vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6, 0)
}));

const MyProfile = () => {
    const nameRef = useRef()
    const phoneRef=useRef();
    const ageRef = useRef();
    const dnameRef = useRef();
    const dphoneRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const pinRef = useRef();

    const relmailRef = useRef()
    const relnameRef = useRef()
    const relphoneRef = useRef()
    const [err,setErr] = useState()
    const [err1,setErr1] = useState()
    const [prof,setProf] = useState()

    const { user } = useContext(UserContext);
    const obj = JSON.parse(user)
    

    useEffect(()=>{
      // console.log(localStorage.getItem("patientName"),localStorage.getItem("patientID"))
      async function getData() {
        await axiosInstance.post('relpat_data/',{"patID":localStorage.getItem("patientID"),"relID":obj.id})
        .then((res)=>{
          // console.log(res.data)
          setProf(res.data)
        })

        }
        getData();  
      
    },[])

    const handleSubmitRel=(e)=>{
      e.preventDefault();
      console.log(obj.id)
      axiosInstance.patch(`profile/${obj.id}/`,{name:relnameRef.current.value,phone:relphoneRef.current.value,email:relmailRef.current.value})
        .then((res)=>{
            location.reload()
        })
        .catch((err)=>{
            
            setErr1(err.response.data)
        })
    }

    const handleSubmit=(e)=>{
      e.preventDefault();
      // console.log("called")

      axiosInstance.put(`patient/${localStorage.getItem("patientID")}/`,{patrel:obj['id'],pname:nameRef.current.value,pphone:phoneRef.current.value,page:ageRef.current.value,address:addressRef.current.value,city:cityRef.current.value,state:stateRef.current.value,pincode:pinRef.current.value,dname:dnameRef.current.value,dphone:dphoneRef.current.value})
        .then((res)=>{
            // console.log(res)
            location.reload()
        })
        .catch((err)=>{
            
            setErr(err.response.data)
        })
    }
  


  return (
    <RootStyle title="Profile | AutoBuddys">

      {prof?<>
        
      <Container maxWidth="sm">
      <Alert severity="info">Write in the fields to edit!</Alert>
        <Card style={{marginTop:'40px',marginBottom:'30px'}}>
          <CardContent>
          <ContentStyle>
            <Stack sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom style={{textAlign:'center'}}>
                Patient Details
              </Typography>
            </Stack>

           
              {err?<Alert severity="error" sx={{mb:2}}>{err}</Alert>:null}
              {!user?<Alert severity="error" sx={{mb:2}}>Log In first to add a patient.</Alert>:null}
              <form onSubmit={handleSubmit}>
            
                  <Stack spacing={3}>
                  <Stack direction="row" spacing={2}>
                  <TextField
                      fullWidth
                      inputRef={nameRef}
                      autoComplete="name"
                      type="text"
                      label="Patient Name"
                      defaultValue={prof[0]['pname']}
                  />
                  <TextField
                      fullWidth
                      autoComplete="ID"
                      type="number"
                      label="Patient ID"
                      defaultValue={prof[0]['id']}
                      inputProps={
                        { readOnly: true, }
                      }
                  />
                  </Stack>
                  
                  <Stack direction="row" spacing={2}>
                      <TextField
                          fullWidth
                          inputRef={phoneRef}
                          autoComplete="phone"
                          type="text"
                          label="Patient Phone"
                          defaultValue={prof[0]['pphone']}
                      />   
                      <TextField
                          fullWidth
                          inputRef={ageRef}
                          autoComplete="age"
                          type="number"
                          label="Patient Age"
                          defaultValue={prof[0]['page']}
                      />  
                  </Stack> 

                  <TextField
                      fullWidth
                      inputRef={addressRef}
                      autoComplete="address"
                      type="text"
                      label="Patient's Address"
                      defaultValue={prof[0]['address']}
                  />

                  <Stack direction="row" spacing={2}>
                      <TextField
                          fullWidth
                          inputRef={cityRef}
                          autoComplete="city"
                          type="text"
                          label="City"
                          defaultValue={prof[0]['city']}
                      />   
                      <TextField
                          fullWidth
                          inputRef={stateRef}
                          autoComplete="state"
                          type="text"
                          label="State"
                          defaultValue={prof[0]['state']}
                      />  
                  </Stack> 
                  
                  <TextField
                      fullWidth
                      inputRef={pinRef}
                      autoComplete="pincode"
                      type="number"
                      label="Pincode"
                      defaultValue={prof[0]['pincode']}
                  />
                  
                  <Stack direction="row" spacing={2}>
                      <TextField
                          fullWidth
                          inputRef={dnameRef}
                          autoComplete="doctor"
                          type="text"
                          label="Doctor Name"
                          defaultValue={prof[0]['dname']}
                      />   
                      <TextField
                          fullWidth
                          inputRef={dphoneRef}
                          autoComplete="phone"
                          type="text"
                          label="Doctor's Contact Detail"
                          defaultValue={prof[0]['dphone']}
                      />  
                  </Stack> 

                  <Button
                  style={{width:'150px',alignSelf:'center'}}
                  size="large"
                  type="submit"
                  variant="contained"
                  >
                  Submit
                  </Button>
                  </Stack>
              </form>

          </ContentStyle>
          </CardContent>
        </Card>
        </Container>
    
      <Container maxWidth="sm">
        <Card style={{marginTop:'40px',marginBottom:'30px'}}>
          <CardContent>
          <ContentStyle>
            <Stack sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom style={{textAlign:'center'}}>
                Relative Details
              </Typography>
            </Stack>

            
              {err1?<Alert severity="error" sx={{mb:2}}>{err1}</Alert>:null}
              {!user?<Alert severity="error" sx={{mb:2}}>Log In first to add a patient.</Alert>:null}
              <form onSubmit={handleSubmitRel}>
                  <Stack spacing={3}>
                  <TextField
                      fullWidth
                      inputRef={relmailRef}
                      autoComplete="email"
                      type="email"
                      label="Relative Email"
                      defaultValue={prof[1]['email']}
                  />
                  <Stack direction="row" spacing={2}>
                      <TextField
                          fullWidth
                          inputRef={relnameRef}
                          autoComplete="name"
                          type="text"
                          label="Relative Name"
                          defaultValue={prof[1]['name']}
                      />   
                      <TextField
                          fullWidth
                          inputRef={relphoneRef}
                          autoComplete="phone"
                          type="text"
                          label="Relative Phone"
                          defaultValue={prof[1]['phone']}
                      />  
                  </Stack> 

                  <Button
                  style={{width:'150px',alignSelf:'center'}}
                  size="large"
                  type="submit"
                  variant="contained"
                  >
                  Submit
                  </Button>
                  </Stack>
              </form>

          </ContentStyle>
          </CardContent>
        </Card>
      </Container>
      </>:null}
  </RootStyle>)
}

export default MyProfile