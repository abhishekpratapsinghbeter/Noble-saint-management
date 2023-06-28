import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, TextareaAutosize } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Resizer from 'react-image-file-resizer';


const Index = () => {
  const history  = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isSidebar, setIsSidebar] = useState(true);
  const [photo, setPhoto] = useState("");
  const [fdocument, setFDocument] = useState("");
  const [bdocument, setBDocument] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [centers, setCenters] = useState([]);
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
  const fetchCenters = async () => {
    try {
      const res = await fetch('/b', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await res.json();
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
      setCenters(data);
    } catch (err) {
      console.log(err);
    }  
        
  };
  useEffect(() => {
    fetchCenters();
  }, []);
  
  console.log(centers)
  const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      "JPEG",
      60,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const handleChange1 = async (event) => {
    try {
      const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setPhotoError("File size exceeds the maximum limit.");
      return;
    }
    setPhotoError("");
    const image = await resizeFile(file);
      setPhoto(image);
    } catch (err) {
      console.log(err);
    } 
  };
  const handleChange2 = (event) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setDocumentError("File size exceeds the maximum limit.");
      return;
    }
    setDocumentError("");
    // Handle document upload logic here
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFDocument(reader.result); // Base64
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };
  const handleChange3 = (event) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setDocumentError("File size exceeds the maximum limit.");
      return;
    }
    setDocumentError("");
    // Handle document upload logic here
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBDocument(reader.result); // Base64
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const handleFormSubmit = async (values) => {
    const {membership, name, gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2}=values;
  const res = await fetch("/form",{
  method:"POST",
  headers:{
  "Content-Type" : "application/json"
  },
  body: JSON.stringify({
  base64:photo,
  file2:fdocument,
  file3:bdocument,
  membership, name, gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2
  })
  });
  const data =await res.json();
  if(res.status === 422 || res.status === 500 || !data){
  window.alert("Fill all the details")
  }
  else{
    const memberId = data.memberId;
  window.alert("Member registered Successfully")
  history(`/prform/${memberId}`);
  };
  };
  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

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
                label="MemberShip No."
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.membership}
                name="membership"
                error={!!touched.membership && !!errors.membership}
                helperText={touched.membership && errors.membership}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur} 
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <Box sx={{ gridColumn: "span 2" }} variant="filled"><b>Gender:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"male"}
                name="gender"
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ width:20 }}
              />Male &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                fullWidth
                type="radio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={"female"}
                name="gender"
                sx={{width:20 }}
                />Female</Box>
                <TextField fullWidth
                variant="filled"
                type="Date"
                label="Date Of Birth"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dob}
                name="dob"
                error={!!touched.dob && !!errors.dob}
                helperText={touched.dob && errors.dob}
                sx={{ gridColumn: "span 2" }}
                />
                
                <TextField
  fullWidth
  variant="filled"
  type="file"
  label="Photo"
  onBlur={handleBlur}
  onChange={event => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      // Display an error message if file size exceeds the limit
      setPhotoError("File size exceeds the maximum limit.");
    } else {
      // Reset the error message if the file is within the limit
      setPhotoError("");
      // Proceed with handling the file
      handleChange1(event);
    }
  }}
  value={values.photo}
  name="photo"
  error={!!touched.photo && !!photoError}
  helperText={touched.photo && photoError}
  sx={{ gridColumn: "span 2" }}
/>

<TextField
  fullWidth
  variant="filled"
  type="file"
  label=" Front Document"
  onBlur={handleBlur}
  onChange={event => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      // Display an error message if file size exceeds the limit
      setDocumentError("File size exceeds the maximum limit.");
    } else {
      // Reset the error message if the file is within the limit
      setDocumentError("");
      // Proceed with handling the file
      handleChange2(event);
    }
  }}
  value={values.document}
  name="fdocument"
  error={!!touched.document && !!documentError}
  helperText={touched.document && documentError}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="file"
  label="Back Document"
  onBlur={handleBlur}
  onChange={event => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      // Display an error message if file size exceeds the limit
      setDocumentError("File size exceeds the maximum limit.");
    } else {
      // Reset the error message if the file is within the limit
      setDocumentError("");
      // Proceed with handling the file
      handleChange3(event);
    }
  }}
  value={values.document}
  name="ndocument"
  error={!!touched.document && !!documentError}
  helperText={touched.document && documentError}
  sx={{ gridColumn: "span 2" }}
/>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 2" }}
              />
              
              <TextareaAutosize
                fullWidth
                minRows={3}
                maxRows={4}
                placeholder="Physical Condition"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.PhysicalCondition}
                name="PhysicalCondition"
                error={!!touched.PhysicalCondition && !!errors.PhysicalCondition}
                helperText={touched.PhysicalCondition && errors.PhysicalCondition}
                style={{ gridColumn: "span 2",background:"rgba(41,48,64,255)",borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #ccc',borderRadius: '5px 5px 0 0' }}
              />
              
              <TextareaAutosize
                fullWidth
                minRows={3}
                maxRows={4}
                placeholder="Medical Condition"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.MedicalCondition}
                name="MedicalCondition"
                error={!!touched.MedicalCondition && !!errors.MedicalCondition}
                helperText={touched.MedicalCondition && errors.MedicalCondition}
                style={{ gridColumn: "span 2",background:"rgba(41,48,64,255)",border:"0",borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #ccc',borderRadius: '5px 5px 0 0' }}
              />
              <FormControl variant="filled"  sx={{ gridColumn: "span 2" }}>
              <InputLabel id="filllabel">Center Location</InputLabel>
              <Select onBlur={handleBlur}
                onChange={handleChange} value={values.centerlocation} labelId="filllabel" name="centerlocation" 
                error={!!touched.centerlocation && !!errors.centerlocation}
                helperText={touched.centerlocation && errors.centerlocation}>
                
                  {centers.map((center) => (
                  <MenuItem key={center._id} value={center.ba}>
                    {center.ba}
                  </MenuItem>
                  ))}
              </Select>
              </FormControl>
            </Box><br/>
            <label>Emergency Contact</label>
            <Box display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              mt={3}
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Emergency Contact name 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.econtactn1}
                name="econtactn1"
                error={!!touched.econtactn1 && !!errors.econtactn1}
                helperText={touched.econtactn1 && errors.econtactn1}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl variant="filled"  sx={{ gridColumn: "span 2" }}>
              <InputLabel id="filllabel">Relation</InputLabel>
              <Select onBlur={handleBlur}
                onChange={handleChange} value={values.relation1} labelId="filllabel" name="relation1" 
                error={!!touched.relation1 && !!errors.relation1}
                helperText={touched.relation1 && errors.relation1}>
                <MenuItem value={"Hushband"}>Hushband</MenuItem>
                <MenuItem value={"Friend"}>Friend</MenuItem>
                <MenuItem value={"Father"}>Father</MenuItem>
                <MenuItem value={"Sister"}>Sister</MenuItem>
                <MenuItem value={"Wife"}>Wife</MenuItem>
                <MenuItem value={"Mother"}>Mother</MenuItem>
                <MenuItem value={"Brother"}>Brother</MenuItem>
              </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Emergency Contact Number 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.econtact1}
                name="econtact1"
                error={!!touched.econtact1 && !!errors.econtact1}
                helperText={touched.econtact1 && errors.econtact1}
                sx={{ gridColumn: "span 2" }}
              /><br/>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Emergency Contact name 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.econtactn2}
                name="econtactn2"
                error={!!touched.econtactn2 && !!errors.econtactn2}
                helperText={touched.econtactn2 && errors.econtactn2}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl variant="filled"  sx={{ gridColumn: "span 2" }}>
              <InputLabel id="filllabel">Relation</InputLabel>
              <Select onBlur={handleBlur}
                onChange={handleChange} value={values.relation2} labelId="filllabel" name="relation2" 
                error={!!touched.relation2 && !!errors.relation2}
                helperText={touched.relation2 && errors.relation2}>
                <MenuItem value={"Hushband"}>Hushband</MenuItem>
                <MenuItem value={"Friend"}>Friend</MenuItem>
                <MenuItem value={"Father"}>Father</MenuItem>
                <MenuItem value={"Sister"}>Sister</MenuItem>
                <MenuItem value={"Wife"}>Wife</MenuItem>
                <MenuItem value={"Mother"}>Mother</MenuItem>
                <MenuItem value={"Brother"}>Brother</MenuItem>
              </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Emergency Contact Number 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.econtact2}
                name="econtact2"
                error={!!touched.econtact2 && !!errors.econtact2}
                helperText={touched.econtact2 && errors.econtact2}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    </main></div>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const checkoutSchema = yup.object().shape({
    membership: yup.string().required("Membership No. is required"),
    name: yup.string().required("Name is required"),
    gender: yup.string().required("Gender is required"),
    dob: yup.date().required("Date of Birth is required"),
    contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("Contact Number is required"),
    address1: yup.string().required("Address is required"),
    PhysicalCondition: yup.string().required("Physical Condition is required"),
    MedicalCondition: yup.string().required("Medical Condition is required"),
    centerlocation: yup.string().required("Center Location is required"),
    econtactn1: yup.string().required("Emergency Contact 1 Name is required"),
    relation1: yup.string().required("Relationship 1 is required"),
    econtact1: yup.string().matches(phoneRegExp, "Phone number is not valid").required("Emergency Contact 1 is required"),
  });
const current = new Date();
const date = `${current.getDate().toString().padStart(2, '0')}-${(current.getMonth()+1).toString().padStart(2, '0')}-${current.getFullYear()}`;
const initialValues ={
  membership: "",
  name: "",
  gender:"",
  doj: date,
  contact: "",
  econtactn1:"",
  econtactn2:"",
  relation1:"",
  relation2:"",
  address1: "",
};

export default Index;