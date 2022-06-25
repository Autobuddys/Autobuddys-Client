import * as Yup from 'yup';
import { useState,useRef } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Switch, Alert,FormGroup,FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import useAuth from "../../../hooks/useAuth"
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const nameRef = useRef();
  const hospnameRef = useRef();
  const stateRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();
  const pinRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const [pat,setPat] = useState(false)
  const [load,setLoad] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser, err } = useAuth();

  const RegisterSchema = Yup.object().shape({
    Name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name required'),
    phone: Yup.string().min(10, 'Invalid!').max(11, 'Invalid!').required('Phone number required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    // hospname: Yup.string().required('Hospital name is required'),
    // address: Yup.string().required('Hospital address is required'),
    // city: Yup.string().required('Hospital city is required'),
    // state: Yup.string().required('Hospital state is required'),
    // pin: Yup.number().required('Pincode required'),
});

  const formik = useFormik({
    initialValues: {
      Name: '',
      phone: '',
      email: '',
      password: '',
      hospname: '',
      state: '',
      city: '',
      pin: '',
      address: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      if(pat){
        registerUser(nameRef.current.value,emailRef.current.value,phoneRef.current.value,passwordRef.current.value,pat,hospnameRef.current.value,addressRef.current.value,cityRef.current.value,stateRef.current.value,pinRef.current.value)
      }
      else{
        registerUser(nameRef.current.value,emailRef.current.value,phoneRef.current.value,passwordRef.current.value,pat)
      }
      
      
      if(err){setLoad(true)}

    }

  });

  const handleChange=()=>{
    setPat(!pat)
  }

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      {err?<Alert severity="error" sx={{mb:2}}>{err}</Alert>:null}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Name"
              inputRef={nameRef}
              {...getFieldProps('Name')}
              error={Boolean(touched.Name && errors.Name)}
              helperText={touched.Name && errors.Name}
            />

            <TextField
              fullWidth
              label="Phone"
              inputRef={phoneRef}
              type="text"
              {...getFieldProps('phone')}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
            />
          </Stack>

          <TextField
            fullWidth
            inputRef={emailRef}
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            inputRef={passwordRef}
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <FormGroup>
            <FormControlLabel
              onChange={handleChange}
              control={<Switch defaultChecked/>}
              label="I am the patient's relative."
            />
          </FormGroup>

          {pat?
          <>
          <TextField
            fullWidth
            inputRef={hospnameRef}
            autoComplete="hospital name"
            type="text"
            label="Hospital Name"
            {...getFieldProps('hospname')}
            error={Boolean(touched.hospname && errors.hospname)}
            helperText={touched.hospname && errors.hospname}
          />

          <TextField
            fullWidth
            inputRef={addressRef}
            autoComplete="hospital address"
            type="text"
            label="Hospital Address"
            {...getFieldProps('hospaddr')}
            error={Boolean(touched.hospaddr && errors.hospaddr)}
            helperText={touched.hospaddr && errors.hospaddr}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="City"
              inputRef={cityRef}
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
            />

            <TextField
              fullWidth
              label="Pincode"
              inputRef={pinRef}
              {...getFieldProps('pin')}
              error={Boolean(touched.pin && errors.pin)}
              helperText={touched.pin && errors.pin}
            />

            
          </Stack>

          <TextField
              fullWidth
              label="State"
              inputRef={stateRef}
              type="text"
              {...getFieldProps('state')}
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state && errors.state}
            />
          </>
          
          :null}
          

          <LoadingButton
            style={{width:'150px',alignSelf:'center'}}
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting && load}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
