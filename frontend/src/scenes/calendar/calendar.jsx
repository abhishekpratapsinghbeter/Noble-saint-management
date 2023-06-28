import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const history =useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isSidebar, setIsSidebar] = useState(true);
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
    const {membershipno,dop,fees,ped,pkg}=values;
    const res = await fetch("/receipt",{
      method:"POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        membershipno,dop,fees,ped,pkg
      })
    });
    const data =await res.json();
    if(res.status === 400 ||res.status === 422 || res.status === 500 || !data){
      window.alert("Invalid credential")
    }
    else{
      const receiptId = data.receiptId; 
      window.alert("Receipt created Successfully")
      history(`/preceipt/${receiptId}`);
    }
  };

  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      <Header title="CREATE INVOICE" subtitle="Create a New Invoice" />

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
            <label><b>About Member</b> </label><br/><br/>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Membership No."
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.membershipno}
                name="membershipno"
                error={!!touched.membershipno && !!errors.membershipno}
                helperText={touched.membershipno && errors.membershipno}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                        fullWidth
                        variant='filled'
                        type='number'
                        label='Pending Amount'
                        value={values.pd}
                        onChange={handleChange} 
                        name='ped'
                        sx={{ gridColumn: 'span 2' }} />
            </Box>
            <Box sx={{ gridColumn: "span 2" }}><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Fees:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"700"}
                name="fees"
                error={!!touched.fees && !!errors.fees}
                helperText={touched.fees && errors.fees}
                sx={{ width:20 }}
              />Rs.700 &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"800"}
                name="fees"
                error={!!touched.fees && !!errors.fees}
                helperText={touched.fees && errors.fees}
                sx={{ width:20 }}
              />Rs.800 &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
              fullWidth
              type="radio"
              onBlur={handleBlur}
              onChange={handleChange}
              value={"2100"}
              name="fees"
              error={!!touched.fees && !!errors.fees}
              helperText={touched.fees && errors.fees}
              sx={{ width:20 }}
            />Rs.2100 &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"3800"}
                name="fees"
                error={!!touched.fees && !!errors.fees}
                helperText={touched.fees && errors.fees}
                sx={{ width:20 }}
              />Rs.3800 &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"7000"}
                name="fees"
                error={!!touched.fees && !!errors.fees}
                helperText={touched.fees && errors.fees}
                sx={{ width:20 }}
              />Rs.7000 </Box>
            <Box sx={{ gridColumn: "span 2" }}><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>pkg:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"Monthly"}
                name="pkg"
                error={!!touched.pkg && !!errors.pkg}
                helperText={touched.pkg && errors.pkg}
                sx={{ width:20 }}
              />Monthly(1 Month) &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"Quaterly"}
                name="pkg"
                error={!!touched.pkg && !!errors.pkg}
                helperText={touched.pkg && errors.pkg}
                sx={{ width:20 }}
              />Quaterly(3 Months) &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
              fullWidth
              type="radio"
              onBlur={handleBlur}
              onChange={handleChange}
              value={"HalfYearly"}
              name="pkg"
              error={!!touched.pkg && !!errors.pkg}
              helperText={touched.pkg && errors.pkg}
              sx={{ width:20 }}
            />Half Yearly (6 Months) &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"Yearly"}
                name="pkg"
                error={!!touched.pkg && !!errors.pkg}
                helperText={touched.pkg && errors.pkg}
                sx={{ width:20 }}
              />Yearly(12 Months) &nbsp;&nbsp;&nbsp;&nbsp;
              </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Invoice
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
  membershipno: yup.string().required("required"),
  pkg:yup.string().required("required"),
  fees:yup.string().required("required"),
});
const current = new Date();
const date = `${current.getDate().toString().padStart(2, '0')}-${(current.getMonth()+1).toString().padStart(2, '0')}-${current.getFullYear()}`;
const initialValues = {
  membershipno: "",
  dop:  date,
};

export default Index;