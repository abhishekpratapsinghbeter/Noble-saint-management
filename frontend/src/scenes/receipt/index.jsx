/* eslint-disable eqeqeq */
import { Box, Button, InputLabel } from '@mui/material'
import { useEffect, useState } from 'react';
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';
import Header from '../../components/Header'
import l from "../../img/logo1.png"
import { useParams } from 'react-router-dom';
import './receipt.css'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
const Receipt = () => {
  const {id}= useParams();
  const [isSidebar, setIsSidebar] = useState(true);
  const history = useNavigate()
  const [preceipt, setpreceipt] = useState([])
  const [userdata, setuserdata] = useState([])
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
  const callContacts = async ()=>{
    try {
      const res =await fetch(`/preceipt/${id}`,{
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
      };
      setpreceipt(data);
      setuserdata(data.user);
    } catch (err) {
      console.log(err);
      history('/dashboard');
    }
  }
  useEffect(() => {
    callContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const current = new Date();
  const fDate = `${current.getDate().toString().padStart(2, '0')}-${(current.getMonth()+1).toString().padStart(2, '0')}-${current.getFullYear()}`;
  var th = ['','thousand','million', 'billion','trillion'];
var dg = ['zero','One','Two','Three','Four', 'Five','Six','Seven','Eight','Nine'];
 var tn = ['Ten','Eleven','Twelve','Thirteen', 'Fourteen','Fifteen','Sixteen', 'Seventeen','Eighteen','Nineteen'];
 var tw = ['Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
 
function toWords(s) {
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    if (x > 15)
        return 'too big';
    var n = s.split(''); 
    var str = '';
    var sk = 0;
    for (var i=0;   i < x;  i++) {
        if ((x-i)%3==2) { 
            if (n[i] == '1') {
                str += tn[Number(n[i+1])] + ' ';
                i++;
                sk=1;
            } else if (n[i]!=0) {
                str += tw[n[i]-2] + ' ';
                sk=1;
            }
        } else if (n[i]!=0) { // 0235
            str += dg[n[i]] +' ';
            if ((x-i)%3==0) str += 'hundred ';
            sk=1;
        }
        if ((x-i)%3==1) {
            if (sk)
                str += th[(x-i-1)/3] + ' ';
            sk=0;
        }
    }
    
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        // eslint-disable-next-line no-redeclare
        for (var i=x+1; i<y; i++)
            str += dg[n[i]] +' ';
    }
    return str.replace(/\s+/g,' ');
}
  return (
  <div className="app">
  <Sidebar isSidebar={isSidebar} />
  <main className="content">
    <Topbar setIsSidebar={setIsSidebar} />

    <Box m="20px">
      <Header title="CREATE Invoice" subtitle="Create a New User Invoice" />
          <Box display="flex" justifyContent="right" mt="20px">
            <Button onClick={print} color="warning" variant="contained">
              Print Invoices
            </Button>&nbsp;&nbsp;
            <Button onClick={print} color="success" variant="contained">
             <WhatsAppIcon/> &nbsp;&nbsp; Send on WhatsApp
            </Button>
          </Box><br/>
      <Box sx={{backgroundColor:"white"}}>
        <div id='printablediv'><br/><hr style={{backgroundColor:"black", borderColor:"black",width:"90%"}}/>
          <div className='receipt'>
        <img
            alt="User"
            width="120px"
            height="110px"
            src={l}
            style={{ cursor: "pointer", borderRadius: "50%", marginLeft:'5%' }}
            />
            <label className='head'><b>Noble Saint Fitness</b></label> <span style={{marginLeft:"2%", color:"black"}}>Mob:8765734696</span>
           </div>
           <hr style={{backgroundColor:"black",borderColor:"black",width:"90%"}}/> 
           <hr style={{backgroundColor:"black",borderColor:"black",width:"90%"}}/>
           <InputLabel sx={{color:"black",ml:34}} ><b>{userdata.centerlocation}</b></InputLabel>
           <hr style={{backgroundColor:"black",borderColor:"black",width:"90%"}}/>
           <hr style={{backgroundColor:"black",borderColor:"black",width:"90%"}}/>
           <br/><Box
                      display="grid"
                          gap="10px" ml={7}
                          gridTemplateColumns="repeat(4, minmax(0, 1fr))"    
                    >
                      <Box  sx={{gridColumn: "span 2", ml:3,color:"black" }}>
                      <label>Sl. No. :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>
                        <b>{preceipt?.sno?.toString().padStart(4, '0')}</b>
                        </label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:12,color:"black" }}>
                      <label>Date :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{fDate}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:3 ,color:"black"}}>
                      <label>Membership No. :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><b>{preceipt.membershipno}</b></label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:12 ,color:"black"}}>
                      <label>Client Name :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><b>{userdata.name}</b></label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:3 ,color:"black" }}>
                        <label>Date of Joining :</label>&nbsp;&nbsp;&nbsp;<label>{userdata.doj}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:12,color:"black"}}>
                        <label>Date of Payment :</label>&nbsp;&nbsp;&nbsp;<label>{preceipt.dop}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:3,color:"black" }}>
                      <label>Package Type:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{preceipt.pkg}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:12,color:"black"}}>
                        <label>Date of Repayment :</label>&nbsp;&nbsp;&nbsp;<label>{preceipt.dorp}</label>
                      </Box>
                      <Box sx={{gridColumn:"span 4"}}><hr style={{ backgroundColor:"black",borderColor:"black",width:"94%" , marginLeft:"1%",marginRight:"2%"}}/></Box>
                      <Box  sx={{gridColumn: "span 2", ml:3,color:"black" }}>
                      <label>Amount :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>Rs.{preceipt.fees}/-</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 2", ml:12,color:"black"}}>
                        <label>Pending Amount :</label>&nbsp;&nbsp;&nbsp;<label>Rs.{preceipt.pd}</label>
                      </Box>
                      <Box  sx={{gridColumn: "span 4", ml:3,color:"black" }}>
                      <label>Amount in words :</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>{toWords(preceipt.fees)} only</label>

                      </Box>
                    </Box><hr style={{ backgroundColor:"black",borderColor:"black",width:"90%"}}/>
                    <span style={{color:"black",marginLeft:"6%"}}>* Bill once paid can not be refunded under any circumstances</span>
                    <br/><span style={{color:"black",marginLeft:"6%"}}>* In the event of any damage, a fine shall be imposed as per the applicable conditions.</span><br/><br/>
                    <Box  sx={{ gridColumn: "span 4", ml:"75%" ,color:"black" }}>
                      <label>Authorised Signature</label>
                      </Box></div></Box>
          </Box>
        </main></div>
  )
}
const print = () =>{
   
  let printContents = document.getElementById('printablediv').innerHTML;
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents; 
}
export default Receipt
