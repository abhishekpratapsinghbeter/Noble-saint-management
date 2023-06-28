import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const history = useNavigate()
  const theme = useTheme();
  const [isSidebar, setIsSidebar] = useState(true);
  const colors = tokens(theme.palette.mode);
  const [count, setcount] = useState()
  const [count1, setcount1] = useState()
  const [revenue, setrevenue] = useState([])
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
  const calldashboards1 = async ()=>{
    try {
      const res =await fetch('/count ',{
        method:"Get",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        credentials:"include"
      });
      const {count} = await res.json();
      if(!res.status === 200){
        const error = new Error(res.error);
        throw error;
      }
      setcount(count);
    } catch (err) {
      console.log(err);
    }
  }
  const calldashboards3 = async ()=>{
    try {
      const res =await fetch('/count1 ',{
        method:"Get",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        credentials:"include"
      });
      const {count} = await res.json();
      if(!res.status === 200){
        const error = new Error(res.error);
        throw error;
      }
      setcount1(count);
    } catch (err) {
      console.log(err);
    }
  }
  const calldashboards2 = async ()=>{
    try {
      const res =await fetch('/receipts ',{
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
      setrevenue(data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    calldashboards1();
    calldashboards2();
    calldashboards3();
  }, []);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const revenuePerMonth = {};
    
    for (const item of revenue) {
      const dateArray = item.dop.split("-");
      const date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
      const month = months[date.getMonth()];
      if (!revenuePerMonth[month]) {
        revenuePerMonth[month] = 0;
      }
      revenuePerMonth[month] += parseInt(item.fees, 10) ;
    }
    const currentMonth = months[new Date().getMonth()];
    const currentMonthRevenue = revenuePerMonth[currentMonth];
  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

       
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={count}
            subtitle="Total Members"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={count1}
            subtitle="Total Employee"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={currentMonthRevenue}
            subtitle="Total Revenue of"
            increase={currentMonth}
            icon={
              <CurrencyRupeeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box height="270px" m="-20px 0 0 0">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
    </main></div>
  );
};

export default Dashboard;