import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Index from "./scenes/form/index";
import Eindex from "./scenes/form/eindex";
import Eeindex from "./scenes/form/eeindex";
import Pindex from "./scenes/form/pindex";
import Etindex from "./scenes/form/etindex";
import Photos from "./scenes/photos/photos";
import Auth from "./scenes/auth";
import Receipt from "./scenes/receipt";
import Blogs from "./scenes/blogs";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login/login";
import Logout from "./scenes/logout/logout";
import Balances from "./scenes/invoices/balance";
import Prform from "./scenes/form/prform";
import React from "react";
function App() {
  const [theme, colorMode] = useMode();
  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
            <Routes>
              <Route path="/" element={<Login/>}/>                  {"Login page"}
              <Route path="/auth" element={ <Auth/>}/>              {"Admin Registration Page"}
              <Route path="/dashboard" element={<Dashboard />} />   {"Dashboard page"}
              <Route path="/team" element={<Team />} />             {"Employee List"}
              <Route path="/contacts" element={<Contacts />} />     {"Member List"}
              <Route path="/invoices" element={<Invoices />} />     {"Invoices List"}
              <Route path="/form" element={<Index/>} />             {"Member Registration Form"}
              <Route path="/Eform" element={<Eindex/>} />           {"Employee Registration Form"}
              <Route path="/Pform/:id" element={<Pindex/>} />           {"Invoice Creation Form"}
              <Route path="/prform/:id" element={<Prform/>} />      {"Print the hardcopy of Member form"}
              <Route path="/balance" element={<Balances/>} />       {"Due Fees Page"}
              <Route path="/bar" element={<Bar />} />               {"Bar chart"}
              <Route path="/blogs" element={<Blogs />} />           {"Blog Registration form"}
              <Route path="/photos" element={<Photos />} />         {"Photos Upload Form"}
              <Route path="/receipt" element={<Calendar />} />      {"Recipt Page"} 
              <Route path="/eeform/:id" element={<Eeindex />} />    {"Member Edit Page"}
              <Route path="/etform/:id" element={<Etindex />} />    {"Employee Edit Page"}
              <Route path="/logout" element={<Logout />} />         {"Logout Page"}
              <Route path="/preceipt/:id" element={<Receipt />} />  {"Recipt By Id"}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;