import { Box, Button, FormControlLabel, Radio, TextField } from "@mui/material";
import { Formik } from "formik";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const Index = () => {
  const history  = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:200px)");
  const [isSidebar, setIsSidebar] = useState(true);
  const [contacts, setContacts] = useState([]);
  const {id} = useParams();
  const [member,setmember]= useState('');
  const [name,setname]= useState('');
  const [gender,setgender]= useState('');
  const [dob,setdob]= useState('');
  const [contact,setcontact]= useState('');
  const [email,setemail]= useState('');
  const [address1,setaddress1]= useState('');
  const [physical,setphysical]= useState('');
  const [Position,setPosition]= useState('');
  const [medical,setmedical]= useState('');
  const [cl,setcl]= useState('');
  const [ecn1,setecn1]= useState('');
  const [ecno1,setecno1]= useState('');
  const [ecn2,setecn2]= useState('');
  const [ecno2,setecno2]= useState('');
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
  const handleNamechange=(event)=>{
    setname(event.target.value);
  }
  const handlegenderchange=(event)=>{
    setgender(event.target.value);
  }
  const handledobchange=(event)=>{
    setdob(event.target.value);
  }
  const handlecontactchange=(event)=>{
    setcontact(event.target.value);
  }
  const handleemailchange=(event)=>{
    setemail(event.target.value);
  }
  const handleaddress1change=(event)=>{
    setaddress1(event.target.value);
  }
  const handlephysicalchange=(event)=>{
    setphysical(event.target.value);
  }
  const handlemedicalchange=(event)=>{
    setmedical(event.target.value);
  }
  const handleecn1change=(event)=>{
    setecn1(event.target.value);
  }
  const handleecno1change=(event)=>{
    setecno1(event.target.value);
  }
  const handleecn2change=(event)=>{
    setecn2(event.target.value);
  }
  const handleecno2change=(event)=>{
    setecno2(event.target.value);
  }
  const callContacts = async () => {
    try {
      const res = await fetch(`/eteams/${id}`, {
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
      setContacts(data);
    } catch (err) {
      console.log(err);
    }
        
  };
  useEffect(() => {
    callContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(()=>{
    setmember(contacts.eid);
    setname(contacts.name);
    setgender(contacts.gender);
    setdob(contacts.dob);
    setcontact(contacts.contact);
    setemail(contacts.email);
    setaddress1(contacts.address1);
    setphysical(contacts.PhysicalCondition);
    setmedical(contacts.MedicalCondition);
    setcl(contacts.centerlocation);
    setecn1(contacts.econtactn1);
    setecno1(contacts.econtact1);
    setecn2(contacts.econtactn2);
    setecno2(contacts.econtact2);

    setPosition(contacts.position);

  },[contacts])

  const handleFormSubmit = async () => {
    const res = await fetch(`/etform/${id}`,{
      method:"put",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        member,
        name,
        gender,
        dob,Position,
        contact,
        email,
        address1,
        physical,
        medical,
        cl,
        ecn1,
        
        ecno1,
        ecn2,
        
        ecno2, 
      })
    });
    const data =await res.json();
    if(res.status === 422 || res.status === 500 || !data){
      window.alert("Fill all the details")
    }
    else{
      window.alert("Employee updated Successfully")
      history("/team");
    }
  };
  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      <Header title="Edit USER" subtitle="Edit User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues
      >
        {({
          handleSubmit,
        }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <label><b>About Member</b> </label><br /><br />
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
                        variant='filled'
                        type='text'
                        label='Membership No.'
                        value={member}
                        disabled
                        name='membership'
                        sx={{ gridColumn: 'span 2' }} />
                      <TextField
                        fullWidth
                        variant='filled'
                        type='text'
                        onChange={handleNamechange}
                        label='Name'
                        value={name}

                        name='name'
                        sx={{ gridColumn: 'span 2' }} />
                      <Box sx={{ gridColumn: 'span 2' }}>
                        <b>Gender:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <FormControlLabel
                          control={<Radio />}  
                          label="Male"
                          value="male"
                          name="gender"
                          checked={gender === "male"}
                          onChange={handlegenderchange}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white', // set the color for unchecked state
                            },
                            '& .Mui-checked': {
                              '& .MuiSvgIcon-root': {
                                color: 'silver', // set the color for checked state
                              },
                            },
                          }}
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label="Female"
                          value="female"
                          name="gender"
                          checked={gender === "female"}
                          onChange={handlegenderchange}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white', // set the color for unchecked state
                            },
                            '& .Mui-checked': {
                              '& .MuiSvgIcon-root': {
                                color: 'silver', // set the color for checked state
                              },
                            },
                          }}
                           />
                      </Box>
                      <TextField
                        fullWidth
                        variant='filled'
                        type='date'
                        label='Date Of Birth'
                        value={dob}
                        onChange={handledobchange}
                        name="dob"
                        sx={{ gridColumn: "span 2" }} />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Contact Number"
                        value={contact}
                        onChange={handlecontactchange}
                        name="contact"
                        sx={{ gridColumn: "span 2" }} />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Email"
                        value={email}
                        onChange={handleemailchange}
                        name="email"
                        sx={{ gridColumn: "span 2" }} />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Address 1"
                        value={address1}
                        onChange={handleaddress1change}
                        name="address1" sx={{ gridColumn: "span 2" }} />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Physical Condition"
                        value={physical}
                        onChange={handlephysicalchange}
                        name="PhysicalCondition" sx={{ gridColumn: "span 2" }} />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Medical Condition"
                        value={medical}
                        onChange={handlemedicalchange}
                        name="MedicalCondition"
                        sx={{ gridColumn: "span 2" }} />
                        
                    </Box><br />
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
                        value={ecn1}
                        onChange={handleecn1change}
                        name="econtactn1"
                        sx={{ gridColumn: "span 2" }} />
                      
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Emergency Contact Number 2"
                        value={ecno1}
                        onChange={handleecno1change}
                        name="econtact1"
                        sx={{ gridColumn: "span 2" }} />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Emergency Contact name 2"
                        value={ecn2}
                        onChange={handleecn2change}
                        name="econtactn2"
                        sx={{ gridColumn: "span 2" }} />
                      
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Emergency Contact Number 2"
                        value={ecno2}
                        onChange={handleecno2change}
                        name="econtact2"
                        sx={{ gridColumn: "span 2" }} />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button type="submit" color="secondary" variant="contained">
                        Update Employee
                      </Button>
                    </Box>
                  </form>
                );
              }}
      </Formik>
    </Box>
    </main></div>
  );
};



export default Index;