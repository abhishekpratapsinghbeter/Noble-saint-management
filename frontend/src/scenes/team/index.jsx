import { Box, IconButton, Modal, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
const Teams = () => {
  const history = useNavigate()
  const [isSidebar, setIsSidebar] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
   const handleClose = () => setOpen(false);
  const [selectRow, setselectRow] = useState({})
  const handleOpen = (row) => {
    setselectRow(row)
    setOpen(true)
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
          history('/'); // Redirect to the login page if the user is not authenticated
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [teams, setteams] = useState([]);
  const handleupdate= (id) =>{
    history(`/etform/${id}`)
  }
  const handleDelete = useCallback(async (id) => {
    try {
      await fetch(`/delete2/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "applicaton/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      setteams((prevTeams) => prevTeams.filter((data) => data._id !== id));
    } catch (err) {
      console.log(err)
    }
  }, [setteams])
  const callteams = async ()=>{
    try {
      const res =await fetch('/teams',{
        method:"Get",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        credentials:"include"
      });
      const data = await res.json();
      if(!res.status === 200){
        const error = new Error(res.error);
        throw error;
      }
      setteams(data);
    } catch (err) {
      console.log(err);
      history('/');
    }
  }
  useEffect(() => {
    callteams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
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
    { field: "eid", headerName: "Membership No." },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "contact",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "centerlocation",
      headerName: "Center",
      flex: 1,
    },
    {
      headerName: "Profile",
      flex: 1,
      renderCell: ({row}) => {
        return (
          <>
            <IconButton onClick={(e) => handleOpen(row)}><PersonOutlinedIcon/></IconButton> &nbsp;&nbsp;&nbsp;&nbsp;  
              <IconButton onClick={()=>handleupdate(row._id)}><EditIcon color='warning'/></IconButton>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <IconButton onClick={()=>handleDelete(row._id)}><DeleteIcon color='error'/></IconButton>
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
                      /><Box>
                      <Typography id="modal-modal-title"  variant="h4" sx={{ml:20,color:"greenyellow"}} component="h2">
                        <b>Employee ID :</b>&nbsp;{selectRow.eid}<br/>
                        <b>Position  :</b>&nbsp;{selectRow.position}
                    </Typography>
                    
                    <br/>
                    <Box
                      display="grid"
                          gap="15px" ml={7}
                          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                          sx={{
                           "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                           "& .MuiDataGrid-virtualScroller": {backgroundColor: colors.primary[400],
                          }
                          }}
                    >
                      <Box  sx={{gridColumn: "span 2", ml:3 }}>
                        <label>Name :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.name}</label>
                      </Box><Box  sx={{gridColumn: "span 2", ml:3 }}>
                        <label>Gender :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.gender}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:3 }}>
                        <label>Date of Birth :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.dob}</label>
                      </Box><Box  sx={{gridColumn: "span 2", ml:3 }}>
                        <label>Date of Joining :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.dob}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 4", ml:3 }}>
                            <label>Contact No. :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{selectRow.contact}</label>
                      </Box>
                      <Box sx={{gridColumn: "span 2", ml:3}}>
                        <label>Emergency Contact 1:</label><br/>&nbsp;&nbsp;&nbsp;<label>Name:</label>&nbsp;&nbsp;{selectRow.econtactn1}<br/>&nbsp;&nbsp;&nbsp;<label>Relation:</label>
                        &nbsp;&nbsp;{selectRow.relation1}<br/>&nbsp;&nbsp;&nbsp;<label>Contact No:</label>&nbsp;&nbsp;{selectRow.econtact1}

                      </Box>
                      <Box sx={{gridColumn: "span 2", ml:3}}>
                      <label>Emergency Contact 2:</label><br/>&nbsp;&nbsp;&nbsp;<label>Name:</label>&nbsp;&nbsp;{selectRow.econtactn2}<br/>&nbsp;&nbsp;&nbsp;<label>Relation:</label>
                        &nbsp;&nbsp;{selectRow.relation2}<br/>&nbsp;&nbsp;&nbsp;<label>Contact No:</label>&nbsp;&nbsp;{selectRow.econtact2}

                      </Box> 
                    </Box></Box></Box><br/>
                    
                    <Box sx={{gridColumn: "span 4"}}>
                        <label>Address:</label>&nbsp;&nbsp;&nbsp;{selectRow.address1}

                      </Box>
                      <Box sx={{gridColumn: "span 4"}}>
                        <label>Center Location:</label>&nbsp;&nbsp;&nbsp;{selectRow.centerlocation}
                      </Box>
                      <Box sx={{gridColumn: "span 4"}}>
                        <label>Document</label>
                        <br/><img
                        alt="User"
                        width="450px"
                        height="350px"
                        src={selectRow.document}
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
        title="teams"
        subtitle="List of teams for Future Reference"
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
          rows={teams}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    
    </main></div>
    
  );
};

export default Teams;