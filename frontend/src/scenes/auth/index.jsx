import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from "react-router-dom";

const Auth = () => {
const isNonMobile = useMediaQuery("(min-width:600px)");
const [isSidebar, setIsSidebar] = useState(true);
const [showPassword, setShowPassword] = useState(false);
const history = useNavigate();
useEffect(() => {
  const fetchData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`,
        'Content-Type': 'application/json'
      };
      const response = await fetch('/protected', { headers });

      if (!response.ok) {
        history('/'); // Redirect to the login page if the user is not authenticated
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
const handleFormSubmit = async (values) => {
const { eid, password } = values;
const res = await fetch("/auth", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
eid,
password,
}),
});
const data = await res.json();
if(res.status === 422 || !data){
  window.alert("Invalid credential")
}
else{
  window.alert("Admin registered Successfully")
  history("/dashboard");
}
};
const handleFormSubmit2 = async (values) => {
  const { ba } = values;
  const res = await fetch("/branch", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  },
  body: JSON.stringify({
  ba
  }),
  });
  const data = await res.json();
  if(res.status === 422 || !data){
    window.alert("Invalid credential")
  }
  else{
    window.alert("Branch registered Successfully")
    history("/contacts");
  }
  };

return (
<div className="app">
<Sidebar isSidebar={isSidebar} />
<main className="content">
<Topbar setIsSidebar={setIsSidebar} />
<Box m="20px">
      <Header
         title="CREATE NEW ADMIN"
         subtitle="Create a New Supervisor Admin"
       />
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
          <form method="post" onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Eid."
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.eid}
                name="eid"
                error={!!touched.eid && !!errors.eid}
                helperText={touched.eid && errors.eid}
                sx={{ gridColumn: "span 3" }}
              />
             <TextField
             fullWidth
             variant="filled"
             type={showPassword ? "text" : "password"}
             label="Password"
             onBlur={handleBlur}
             onChange={handleChange}
             value={values.password}
             name="password"
             error={!!touched.password && !!errors.password}
             helperText={touched.password && errors.password}
             sx={{ gridColumn: "span 3", position: "relative" }}
             InputProps={{
              endAdornment: (
              <InputAdornment position="end">
                <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                  </InputAdornment>),
                }}/>
            </Box>
            
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Admin
              </Button>
             </Box>
          </form>
        )}
      </Formik>
</Box>
<Box m="20px">
<Header
         title="ADD NEW BRANCH"
         subtitle="Create a New Branch Id"
       />
      <Formik
        onSubmit={handleFormSubmit2}
        initialValues={initialValues}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form method="post" onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Branch Address."
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ba}
                name="ba"
                error={!!touched.ba && !!errors.ba}
                helperText={touched.ba && errors.ba}
                sx={{ gridColumn: "span 3" }}
              />
            </Box>
            
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                ADD New BRANCH
              </Button>
             </Box>
          </form>
        )}
      </Formik>
</Box>
    </main></div>
  );
}; 
const checkoutSchema = yup.object().shape({
  eid: yup.string().required("required"),
  password:yup.string().required("password")
});
const initialValues = {
  ba: "",
};

export default Auth;