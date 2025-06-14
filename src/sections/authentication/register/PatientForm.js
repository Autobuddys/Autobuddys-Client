import React,{ useRef,useContext,useState,useCallback} from 'react'
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { TextField,Card, Stack,Container, Typography, CardContent,Button,Alert } from '@mui/material';
import axiosInstance from '../../../axiosInstance';
import { UserContext } from '../../../hooks/UserContext';
import Page from "../../../components/Page"
import Webcam from "react-webcam";
import axios from 'axios';

// const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 180,
    height: 200,
    facingMode: "user"
};


// function b64toBlob(b64Data, contentType, sliceSize) {
//   contentType = contentType || '';
//   sliceSize = sliceSize || 512;

//   var byteCharacters = atob(b64Data); // window.atob(b64Data)
//   var byteArrays = [];

//   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//       var slice = byteCharacters.slice(offset, offset + sliceSize);

//       var byteNumbers = new Array(slice.length);
//       for (var i = 0; i < slice.length; i++) {
//           byteNumbers[i] = slice.charCodeAt(i);
//       }

//       var byteArray = new Uint8Array(byteNumbers);

//       byteArrays.push(byteArray);
//   }

//   var blob = new Blob(byteArrays, {type: contentType});
//   return blob;
// }

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  }));
  
  const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 570,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(18, 0, 2, 2)
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

  export default function PatientForm () {
    const navigate = useNavigate();
    const nameRef = useRef()
    const phoneRef = useRef();
    const ageRef = useRef();
    const dnameRef = useRef();
    const dphoneRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const pinRef = useRef();
    const webcamRef = useRef(null);
    const [err,setErr] = useState();
    const [image,setImage] = useState('');
    const [pat,setPat]=useState()

    const { user } = useContext(UserContext);
    const obj = JSON.parse(user)
    
    const capture = useCallback(
      () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      console.log("Image Source: ", imageSrc);
     
    });

    const PatientSchema = Yup.object().shape({
        name: Yup.string().required('Patient name is required'),
        age: Yup.number().min(20).required('Patient age is required'),
        address: Yup.string().required('Patient address is required'),
        city: Yup.string().required('Patient city is required'),
        state: Yup.string().required('Patient state is required'),
        dname: Yup.string().required('Doctor name is required'),
        dphone: Yup.string().min(10, 'Invalid!').max(11, 'Invalid!').required('Doctor/Hospital contact detail required'),
        pincode: Yup.number().required('Pincode required'),
    });

    const formik = useFormik({
        initialValues: {
        name: '',
        age: '',
        phone:'',
        dname:'',
        dphone:'',
        address:'',
        city:'',
        state:'',
        pincode:'',
        image:'',
        remember: true
        },
        validationSchema: PatientSchema,
        onSubmit: () => {
          var ImageURL = image;
          var block = ImageURL.split(";");
          var contentType = block[0].split(":")[1];
          var realData = block[1].split(",")[1];
        
          axiosInstance.post('elder/patient/',{patrel:obj['id'],pname:nameRef.current.value,pphone:phoneRef.current.value,page:ageRef.current.value,address:addressRef.current.value,city:cityRef.current.value,state:stateRef.current.value,pincode:pinRef.current.value,dname:dnameRef.current.value,dphone:dphoneRef.current.value})
          .then((res)=>{
           
              axiosInstance.post('elder/imagepost/',{pname:res.data.pname,patid:res.data.id,imgstr:realData,type:contentType})
              .then((res)=>{
                navigate('/dashboard/app')
              })
              .catch((err)=>{    
                setErr(err.response.data)
              })

              navigate('/dashboard/app')
          })
          .catch((err)=>{
              
              setErr(err.response.data)
          })
      }
    })


    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;


  return (
    <RootStyle title="Patient | AutoBuddys">
        <SectionStyle sx={{ display: { xs: 'none', md: 'flex' },pt:2 }}>
        <img alt="patient" src="/static/illustrations/patient.jfif" />
        <Button
            style={{width:'150px',alignSelf:'center'}}
            size="large"
            onClick={()=>navigate('/dashboard/app')}
            variant="contained"
            >
            Home
          </Button>
      </SectionStyle>
    
      <Container maxWidth="sm">
      <Card style={{marginTop:'40px',marginBottom:'30px'}}>
        <CardContent>
        <ContentStyle>
          <Stack sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom style={{textAlign:'center'}}>
              Patient Details
            </Typography>
          </Stack>

          <FormikProvider value={formik}>
            {err?<Alert severity="error" sx={{mb:2}}>{err}</Alert>:null}
            {!user?<Alert severity="error" sx={{mb:2}}>Log In first to add a ptient.</Alert>:null}
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                <TextField
                    fullWidth
                    inputRef={nameRef}
                    autoComplete="name"
                    type="text"
                    label="Patient Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                />
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        inputRef={phoneRef}
                        autoComplete="phone"
                        type="text"
                        label="Patient Phone"
                        {...getFieldProps('phone')}
                        error={Boolean(touched.phone && errors.phone)}
                        helperText={touched.phone && errors.phone}
                    />   
                    <TextField
                        fullWidth
                        inputRef={ageRef}
                        autoComplete="age"
                        type="number"
                        label="Patient Age"
                        {...getFieldProps('age')}
                        error={Boolean(touched.age && errors.age)}
                        helperText={touched.age && errors.age}
                    />  
                </Stack> 

                <TextField
                    fullWidth
                    inputRef={addressRef}
                    autoComplete="address"
                    type="text"
                    label="Patient's Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                />

                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        inputRef={cityRef}
                        autoComplete="city"
                        type="text"
                        label="City"
                        {...getFieldProps('city')}
                        error={Boolean(touched.city && errors.city)}
                        helperText={touched.city && errors.city}
                    />   
                    <TextField
                        fullWidth
                        inputRef={stateRef}
                        autoComplete="state"
                        type="text"
                        label="State"
                        {...getFieldProps('state')}
                        error={Boolean(touched.state && errors.state)}
                        helperText={touched.state && errors.state}
                    />  
                </Stack> 
                
                <TextField
                    fullWidth
                    inputRef={pinRef}
                    autoComplete="pincode"
                    type="number"
                    label="Pincode"
                    {...getFieldProps('pincode')}
                    error={Boolean(touched.pincode && errors.pincode)}
                    helperText={touched.pincode && errors.pincode}
                />
                
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        inputRef={dnameRef}
                        autoComplete="doctor"
                        type="text"
                        label="Doctor Name"
                        {...getFieldProps('dname')}
                        error={Boolean(touched.dname && errors.dname)}
                        helperText={touched.dname && errors.dname}
                    />   
                    <TextField
                        fullWidth
                        inputRef={dphoneRef}
                        autoComplete="phone"
                        type="text"
                        label="Doctor's Contact Detail"
                        {...getFieldProps('dphone')}
                        error={Boolean(touched.dphone && errors.dphone)}
                        helperText={touched.dphone && errors.dphone}
                    />  
                </Stack> 
                

                <Stack direction="row" >
                    {image == '' ? 
                    <Webcam
                        audio={false}
                        height={180}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={200}
                        videoConstraints={videoConstraints}
                    /> : <img src={image} />}


                    {image != '' ?
                    <Button
                      style={{width:'150px',alignSelf:'flex-end', marginLeft:'3rem', marginBottom:'2rem'}}
                      size="large"
                      variant="contained"
                      onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                      }}
                    >
                    Retake Image
                    </Button>:
                    <Button
                    style={{width:'150px',alignSelf:'flex-end',  marginLeft:'3rem', marginBottom:'4rem'}}
                    size="large"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      capture();
                    }}
                    >
                    Capture Image
                    </Button>
                    }
                </Stack>

                <Button
                  style={{width:'150px',alignSelf:'center'}}
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                Submit
                </Button>
                </Stack>
            </Form>
            </FormikProvider>

        </ContentStyle>
        </CardContent>
      </Card>
      </Container>
      
    </RootStyle>
  );
}