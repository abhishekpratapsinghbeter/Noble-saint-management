import { Box, Button, IconButton, Modal, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Sidebar from "../global/Sidebar";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height:"auto",
  bgcolor: "background.paper",
  border: '2px solid #c4bbbb',
  boxShadow: 24,
  p: 4,
  overflow: 'auto', maxHeight: '90vh' 
};

const Contacts = () => {
  const navigate = useNavigate();
  const [isSidebar, setIsSidebar] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [selectRow, setselectRow] = useState({});
  const handleOpen = (row) => {
    setselectRow(row);
    setOpen(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`,
          'Content-Type': 'application/json'
        };
        const response = await fetch('/protected', { headers });

        if (!response.ok) {
          navigate('/'); // Redirect to the login page if the user is not authenticated
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [contacts, setContacts] = useState([]);
  const handleupdate= (id) =>{
    navigate(`/eeform/${id}`)
  }
  const handlePrint= (id) =>{
    navigate(`/prform/${id}`)
  }
  const handleDelete = useCallback(async (id) => {
    try {
      await fetch(`/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      setContacts((prevContacts) => prevContacts.filter((data) => data._id !== id));
    } catch (err) {
      console.log(err)
    }
  }, [setContacts])
  const isNonMobile = useMediaQuery("(min-width:600px)");
 
  const callContacts = async () => {
    try {
      const res = await fetch('/contacts', {
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
      navigate('/');
    }  
        
  };
  useEffect(() => {
    callContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {field: 'photo',
    headerName: 'Photo',
    renderCell: ({row}) =>{
      return(
        <>
          <img src={row.photo} alt="User" style={{width:"53px",borderRadius: "50%" ,height:"50px",marginLeft:9}}/>
        </>
      );
    },
    },
    { field: "membership", headerName: "Membership No." },
    {
      field: "name",
      headerName: "Name",
      flex: 0.75,
      cellClassName: "name-column--cell",
    },
    {
      field: "contact",
      headerName: "Phone Number",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "centerlocation",
      headerName: "Center",
      flex: 0.5,
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.5,
      renderCell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const[isActive,setIsActive]=useState(row.isActive)
        const handleToggle = async () => {
          setIsActive(!isActive);
          // Make API call to update user's active status
          const res = await fetch(`/contacts1/${row._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              isActive: !isActive // use the updated isActive value here
            })
          });
          const data = await res.json();
          console.log(data);
        };
        
        return (
          <Box
            width="115%"
            m="0 auto"
            display="flex"
            justifyContent="center"
            borderRadius="4px"
          >
            <Button onClick={handleToggle}>
              {isActive ? <Box
            width="220%"
            p="12px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px">Active</Box> : <Box width="200%"
            p="12px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.redAccent[500]}
            borderRadius="4px"
            >Inactive</Box>}
            </Button>
          </Box>
        );
      },
    },
    {
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
              <IconButton onClick={(e) => handleOpen(row)}><PersonOutlinedIcon/></IconButton> 
              <IconButton onClick={()=>handleupdate(row._id)}><EditIcon color='warning'/></IconButton>
              <IconButton onClick={()=>handleDelete(row._id)}><DeleteIcon color='error'/></IconButton>
              <IconButton onClick={()=>handlePrint(row._id)}><LocalPrintshopIcon color='green'/></IconButton>
              <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  
                    <Box display="flex" justifyContent="left" alignItems="left">
                      <img
                        alt="User"
                        width="225px"
                        height="225px"
                        src={selectRow.photo}
                        style={{ cursor: "pointer", borderRadius: "50%" ,marginTop:"32px",marginLeft:"8px"}}
                      />
                      <Box>
                        <Typography id="modal-modal-title"  variant="h4" sx={{ml:15,color:"greenyellow"}} component="h2">
                          <b>Membership No. :</b>&nbsp;<b>{selectRow.membership}</b>
                        </Typography><br/>
                        <Box
                        display="grid"
                        gap="15px" ml={7}
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        "& .MuiDataGrid-virtualScroller": {backgroundColor: colors.primary[400],
                        }
                        }}>
                          <Box  sx={{gridColumn: "span 2", ml:3 }}>
                            <label>Name :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.name}</label>
                          </Box>
                          <Box  sx={{gridColumn: "span 2", ml:3 }}>
                            <label>Gender :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.gender}</label>
                          </Box>
                          <Box  sx={{gridColumn: "span 2", ml:3 }}>
                            <label>Date of Birth :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.dob}</label>
                          </Box>
                          <Box  sx={{gridColumn: "span 2", ml:3 }}>
                            <label>Date of Joining :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.doj}</label>
                          </Box>
                          <Box  sx={{gridColumn: "span 4", ml:3 }}>
                            <label>Contact No. :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.contact}</label>
                          </Box>
                          <Box  sx={{gridColumn: "span 4", ml:3 }}>
                            <label>Email :</label>&nbsp;&nbsp;&nbsp;<label>{selectRow.email}</label>
                          </Box>
                          <Box sx={{gridColumn: "span 2", ml:3}}>
                            <label>Emergency Contact 1:</label><br/>&nbsp;&nbsp;&nbsp;<label>Name:</label>&nbsp;&nbsp;{selectRow.econtactn1}<br/>&nbsp;&nbsp;&nbsp;<label>Relation:</label>
                            &nbsp;&nbsp;{selectRow.relation1}<br/>&nbsp;&nbsp;&nbsp;<label>Contact No:</label>&nbsp;&nbsp;{selectRow.econtact1}
                          </Box>
                          <Box sx={{gridColumn: "span 2", ml:3}}>
                            <label>Emergency Contact 2:</label><br/>&nbsp;&nbsp;&nbsp;<label>Name:</label>&nbsp;&nbsp;{selectRow.econtactn2}<br/>&nbsp;&nbsp;&nbsp;<label>Relation:</label>
                            &nbsp;&nbsp;{selectRow.relation2}<br/>&nbsp;&nbsp;&nbsp;<label>Contact No:</label>&nbsp;&nbsp;{selectRow.econtact2}
                          </Box>
                        </Box>
                      </Box>
                    </Box><br/>
                    <Box sx={{gridColumn: "span 4"}}>
                        <label>Address:</label>&nbsp;&nbsp;&nbsp;{selectRow.address1}
                    </Box>
                    <Box sx={{gridColumn: "span 2"}}>
                        <label>Center Location:</label>&nbsp;&nbsp;&nbsp;{selectRow.centerlocation}
                    </Box>                      
                    <Box sx={{gridColumn: "span 1"}}>
                        <span>Physical Condition</span> &nbsp;&nbsp; {selectRow.PhysicalCondition}<br/>
                        <span>Medical Condition</span>&nbsp;&nbsp; {selectRow.MedicalCondition}
                    </Box>
                    <Box sx={{gridColumn: "span 2"}}>
                        <label>Document</label>
                        <br/><img
                        alt="User"
                        width="450px"
                        height="350px"
                        src={selectRow.fdocument}
                        style={{marginTop:"12px",marginLeft:"8px"}}
                      /><br/><img
                      alt="User"
                      width="450px"
                      height="350px"
                      src={selectRow.bdocument}
                      style={{marginTop:"12px",marginLeft:"8px"}}
                    />
                      </Box>

                </Box>
              </Modal>  
          </>
        );
      },
    },
      
];

  return (
    <div className="app">
    <Sidebar isSidebar={isSidebar} />
    <main className="content">
      <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={contacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    
    </main></div>
    
  );
};

export default Contacts;