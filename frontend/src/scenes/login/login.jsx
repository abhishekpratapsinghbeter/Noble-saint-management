import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import l from "../../img/logo1.png";
import {useNavigate} from "react-router-dom";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import "./login.css"
import { useState } from "react";
const Login = () => {
  const history = useNavigate();
  const [showPassword, setShowPassword] = useState  (false);
  const handleFormSubmit = async (values) => {
    const {eid,password}=values;
    const res = await fetch("/",{
      method:"POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        eid,password
      })
    });
    const data =await res.json();
    if(res.status === 400 || !data){
      window.alert("Invalid credential")
    }
    else{
      window.alert("Login Successfull")
      history("/dashboard");
    }
      
  };
  return (
    <Box className="login" >
      <>
      <Box className="lb" >
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <img src={l} alt="logo" className="bg" width="120px" height="150px"/><br/><br/>
            <Box
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                variant="filled"
                type="text"
                label="User Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.eid}
                name="eid"
                error={!!touched.eid && !!errors.eid}
                helperText={touched.eid && errors.eid}
                sx={{ml:"20%", backgroundColor:"GrayText", width:"60%"}}
              />
              <br/><br/>
              <TextField
                variant="filled"
                type={showPassword ? "text" : "password"}
                label="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ml:"20%", backgroundColor:"GrayText",marginTop:"4 uu%", width:"60%"}}
                InputProps={{
              endAdornment: (
              <InputAdornment position="end">
                <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ?<VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon /> }
                  </IconButton>
                  </InputAdornment>),
                }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Login
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <br/>
      </Box></>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
  eid: yup.string().required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  eid: "",
  password: ""
};


export default Login
