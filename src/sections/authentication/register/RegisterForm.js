import * as Yup from "yup";
import { useState, useRef } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, getAuth } from "firebase/auth";
import { firebaseApp } from "src/firebase";

import {
  signInWithPhoneNumber,
  initializeAuth,
  browserSessionPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";

import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Switch,
  Alert,
  FormGroup,
  FormControlLabel,
  Button as MButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import Iconify from "../../../components/Iconify";
import useAuth from "../../../hooks/useAuth";

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
  const otpRef = useRef();
  const passwordRef = useRef();
  const [pat, setPat] = useState(false);
  const [load, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser, err } = useAuth();
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isCaptchaVerified, SetIsCaptchaVerified] = useState(false);

  const RegisterSchema = Yup.object().shape({
    Name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Name required"),
    phone: Yup.string()
      .min(10, "Invalid!")
      .max(11, "Invalid!")
      .required("Phone number required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    otp: Yup.string().required("Phone number verification required"),
  });

  const formik = useFormik({
    initialValues: {
      Name: "",
      phone: "",
      email: "",
      password: "",
      hospname: "",
      state: "",
      city: "",
      pin: "",
      address: "",
      otp: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      if (!isPhoneVerified) {
        alert("Please Verify Your Phone Number");
        return;
      }

      if (pat) {
        registerUser(
          nameRef.current.value,
          emailRef.current.value,
          phoneRef.current.value,
          passwordRef.current.value,
          pat,
          hospnameRef.current.value,
          addressRef.current.value,
          cityRef.current.value,
          stateRef.current.value,
          pinRef.current.value
        );
      } else {
        registerUser(
          nameRef.current.value,
          emailRef.current.value,
          phoneRef.current.value,
          passwordRef.current.value,
          pat
        );
      }

      if (err) {
        setLoad(true);
      }
    },
  });

  const handleChange = () => {
    setPat(!pat);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const recaptchaRef = useRef();

  function onChange(value) {
    console.log("Capcha value:", value);
  }

  const captchaRef = useRef(null);

  const auth = initializeAuth(firebaseApp, {
    persistence: browserSessionPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });

  const [shouldShowCaptcha, setShouldShowCaptcha] = useState(false);
  const [sendOtpDisabled, SetsendOtpDisabled] = useState(true);
  const [verifyOtpDisabled, SetverifyOtpDisabled] = useState(true);

  return (
    <FormikProvider value={formik}>
      {err ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      ) : null}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            inputRef={nameRef}
            {...getFieldProps("Name")}
            error={Boolean(touched.Name && errors.Name)}
            helperText={touched.Name && errors.Name}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Phone"
              inputRef={phoneRef}
              type="text"
              {...getFieldProps("phone")}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              onKeyUp={(e) => {
                SetsendOtpDisabled(phoneRef.current.value.length < 10);
                setIsPhoneVerified(false);
                SetIsCaptchaVerified(false);
                SetverifyOtpDisabled(true);
              }}
            />

            <MButton
              id="send_otp_btn"
              style={{ width: "150px", alignSelf: "start", marginTop: "4px" }}
              size="large"
              variant="contained"
              disabled={sendOtpDisabled}
              onClick={() => {
                if (phoneRef.current.value.length != 10) {
                  return;
                }

                setShouldShowCaptcha(true);
                console.log("here", shouldShowCaptcha);

                const appVerifier = new RecaptchaVerifier(
                  "my_recaptcha_container",
                  {},
                  auth
                );
                window.recaptchaVerifier = appVerifier;
                console.log(appVerifier);

                const phoneNumber = "+91" + phoneRef.current.value;
                signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                  .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    SetIsCaptchaVerified(true);
                  })
                  .catch((error) => {
                    SetIsCaptchaVerified(false);
                    s;
                  });
              }}
            >
              Send OTP
            </MButton>
          </Stack>
          <div id="my_recaptcha_container"></div>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            style={{
              display: `${!shouldShowCaptcha ? "none" : "flex"}`,
            }}
          >
            <TextField
              fullWidth
              label="OTP"
              inputRef={otpRef}
              type="text"
              {...getFieldProps("otp")}
              error={Boolean(touched.otp && errors.otp)}
              helperText={touched.otp && errors.otp}
              onKeyUp={(e) => {
                SetverifyOtpDisabled(
                  otpRef.current.value.length < 6 || !isCaptchaVerified
                );
              }}
            />
            <MButton
              style={{ width: "150px", alignSelf: "start", marginTop: "4px" }}
              size="large"
              variant="contained"
              onClick={() => {
                const code = otpRef.current.value;
                confirmationResult
                  .confirm(code)
                  .then((result) => {
                    const user = result.user;

                    setIsPhoneVerified(true);
                  })
                  .catch((error) => {
                    setIsPhoneVerified(false);
                  });
              }}
              disabled={verifyOtpDisabled}
            >
              {isPhoneVerified ? "✔️" : "Verify"}
            </MButton>
          </Stack>

          <TextField
            fullWidth
            inputRef={emailRef}
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            style={
              !shouldShowCaptcha
                ? {
                    marginTop: "0",
                  }
                : {}
            }
          />

          <TextField
            fullWidth
            inputRef={passwordRef}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <FormGroup>
            <FormControlLabel
              onChange={handleChange}
              control={<Switch defaultChecked />}
              label="I am the patient's relative."
            />
          </FormGroup>

          {pat ? (
            <>
              <TextField
                fullWidth
                inputRef={hospnameRef}
                autoComplete="hospital name"
                type="text"
                label="Hospital Name"
                {...getFieldProps("hospname")}
                error={Boolean(touched.hospname && errors.hospname)}
                helperText={touched.hospname && errors.hospname}
              />

              <TextField
                fullWidth
                inputRef={addressRef}
                autoComplete="hospital address"
                type="text"
                label="Hospital Address"
                {...getFieldProps("hospaddr")}
                error={Boolean(touched.hospaddr && errors.hospaddr)}
                helperText={touched.hospaddr && errors.hospaddr}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="City"
                  inputRef={cityRef}
                  {...getFieldProps("city")}
                  error={Boolean(touched.city && errors.city)}
                  helperText={touched.city && errors.city}
                />

                <TextField
                  fullWidth
                  label="Pincode"
                  inputRef={pinRef}
                  {...getFieldProps("pin")}
                  error={Boolean(touched.pin && errors.pin)}
                  helperText={touched.pin && errors.pin}
                />
              </Stack>

              <TextField
                fullWidth
                label="State"
                inputRef={stateRef}
                type="text"
                {...getFieldProps("state")}
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && errors.state}
              />
            </>
          ) : null}

          <LoadingButton
            style={{ width: "150px", alignSelf: "center" }}
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting && load}
            disabled={!isPhoneVerified}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
