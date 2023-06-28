import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Topbar from "../global/Topbar";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Sidebar from "../global/Sidebar";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from"moment";
const Invoices = () => {
  const history= useNavigate()
  const [isSidebar, setIsSidebar] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [receipt, setreceipt] = useState([]);
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
  const filteredRepayments = Object.values(receipt.reduce((acc, receipts) => {
    if (!acc[receipts.membershipno] || receipts.sno > acc[receipts.membershipno].sno) {
      acc[receipts.membershipno] = receipts;
    }
    return acc;
  }, {}));
  const today = new Date();
  const filteredData = filteredRepayments.filter(item => {
    const itemDate = moment(item.dorp, "DD-MM-YYYY");
    return itemDate.isBefore(today)
  }); 
  const callreceipts = async ()=>{
    try {
      const res =await fetch('/balance',{
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
      setreceipt(data);
    } catch (err) {
      console.log(err);
      history('/');
    }
  }
  receipt.map((item, index) => ({
    id: index + 1,
    membershipno: item.user?.membershipno || "",
    name: item.user?.name || "",
    dop: item.dop,
    dorp: item.dorp,
    fees: item.fees,
    Rfees: item.Rfees,
    centerlocation: item.user?.centerlocation || "",
  }));
  useEffect(() => {
    callreceipts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
 
  const columns = [
    { field: "sno", headerName: "Serial No.",flex:0.5 },
    { field: "membershipno", headerName: "Membeship No." },
    {
      field: "user.name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.user?.name ,
    },
    {
      field: "dop",
      headerName: "Date of Payment",
      flex: 1,
    },
    {
      field: "dorp",
      headerName: "Date of Repayment",
      flex: 1,
    },
    {
      field: "fees",
      headerName: "Fees ",
      flex: 1,
    },
    
    
    {
      field: "user.centerlocation",
      headerName: "Center",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.user?.centerlocation || "N/A",
    },
   
  ];
  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      
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
        }}
      >
         <DataGrid  rows={filteredData} columns={columns} />
      </Box>
    </Box>
    </main></div>
  );
};

export default Invoices;