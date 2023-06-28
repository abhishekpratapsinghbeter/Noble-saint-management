import { Box, Typography } from "@mui/material";
import l from "../../img/logo1.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../form/prform.css"
const Prform = () => {
    const history= useNavigate();
  const [contacts, setContacts] = useState([]);
  const {id} = useParams();
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
  const handlePrint = () => {
    const printContents = document.getElementById("rdiv").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const callContacts = async () => {
    try {
      const res = await fetch(`/econtact/${id}`, {
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

 /* useEffect(() => {
    if (contacts) {
        const timeoutId = setTimeout(() => {
            handlePrint();
      
          }, 8000);
          
          return () => {
              clearTimeout(timeoutId);
            };
    }
  }, [contacts]);*/

console.log(contacts)
  useEffect(() => {
    window.onafterprint = () => {
      history(`/Pform/${id}`); // Redirect to contacts page after printing
      setTimeout(() => {
        window.location.reload(); // Reload the contacts page after printing
      }, 100);
    };

    window.onbeforeprint = () => {
      history(`/Pform/${id}`); // Redirect to contacts page if print dialog is canceled
      setTimeout(() => {
        window.location.reload(); // Reload the contacts page after printing
      }, 100);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
return (
<div className="app" >
        <main className="content">
            <a href="/contacts"><label>Back to Contacts</label></a>
            <label onClick={handlePrint}>Back to Contacts</label>
                <div id='rdiv'>
                    <Box m="20px"> 
                    <hr style={{backgroundColor: "black", borderColor: "black", color: "black", width: "98%",  marginTop: "15px"}}/>
                        <div style={{display: "flex", alignItems: "center"}}>
                        <img src={l} alt="User" style={{width:"130px",height:"130px",borderRadius:"50%",marginRight:"3%",marginLeft:"3%",marginTop:"1%"}}/>
                            <span style={{fontWeight:"bold",fontSize:"60px",color:"black",marginTop:"2%"}}>Noble Saint Fitness</span>
                            
                        </div>
                    <hr style={{backgroundColor: "black", borderColor: "black", color: "black", width: "98%",  marginTop: "15px"}}/>
                        <span style={{color:"black",fontSize: "15px"}}>&nbsp;&nbsp;&nbsp;<b style={{marginLeft:"2%",marginRight:"3px"}}>Mob No. : 8765734696</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style={{marginLeft:"20%"}}> Email : noblesaintfitness@gmail.com</b></span>
                    <hr style={{backgroundColor: "black", borderColor: "black", color: "black", width: "98%",  marginTop: "20px"}}/>
                    <div style={{textAlign:"Center"}}>
                        <h1 style={{fontSize:"2em",color:"black",fontWeight:"bold"}}>Registration Form</h1>
                    </div>
                    <div>
                        <span style={{color:"black",fontSize: "30px"}}><b>Member Details</b></span>
                        <div style={{display:"flex"}}>
                            <div style={{display:"flex"}}>
                                <table> 
                                    <tr>
                                        <td><Typography  ml={4} fontSize={20} color={"black"}><b>Membership No.:{contacts.membership}</b></Typography></td>
                                        <td> &nbsp; &nbsp; </td>
                                    </tr>
                                    <tr> 
                                        <td><Typography  ml={4} fontSize={20} color={"black"}><b>Name:{contacts.name}</b></Typography></td>
                                        <td>&nbsp;&nbsp;&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td><Typography ml={4} fontSize={20} color={"black"}><b>Sex</b>:{contacts.gender}</Typography></td>
                                        <td><Typography mt={0.5} ml={4} fontSize={20} color={"black"}><b>DOB</b>:{contacts.dob}</Typography></td>
                                    </tr>
                                    <tr>
                                        <td><Typography ml={4} fontSize={20} color={"black"}><b>Phone</b>: {contacts.contact}</Typography></td> 
                                        <td>&nbsp;&nbsp;&nbsp;</td>      
                                    </tr>
                                    <tr>
                                        <td colSpan="2" ><Typography  ml={4} fontSize={20} color={"black"}><b>Center Location</b>:{contacts.centerlocation}</Typography></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" ><Typography  ml={4} fontSize={20} color={"black"}><b>Address</b>:{contacts.address1}</Typography></td>
                                    </tr>
                                    
                                </table>
                                <div flex="1" display="flex" justify-content="flex-end">
                                    <img src={contacts.photo} alt="User" style={{width: "220px", height:"209px", borderRadius: "50%", marginLeft: "10%"}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span style={{color:"black",fontSize: "30px"}}><b>Conditions</b> </span>
                        <table>
                            <tr>
                                <td><Typography  ml={4} fontSize={20} color={"black"}><b>Physical Condition</b>:{contacts.PhysicalCondition}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography  ml={4} fontSize={20} color={"black"}><b>Medical Condition</b>:{contacts.MedicalCondition}</Typography></td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <span style={{color:"black",fontSize: "30px"}}><b>Member Details</b></span>
                        <table>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontWeight: "bold",color:"black", fontSize: "37px"}}>Emergency contact 1</span> </td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"black", fontSize:"20px"}}><b>Name</b>:{contacts.econtactn1}</span></td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"black",fontSize:"20px"}}><b>Relationship</b>:{contacts.relation1}</span></td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"black",fontSize:"20px"}}><b>Contact No</b>:{contacts.econtact1}</span></td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontWeight: "bold",color:"black", fontSize: "37px"}}>Emergency contact 2</span></td>
                            </tr>
                            <tr>
                                 <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"black",fontSize:"20px"}}><b>Name</b>:{contacts.econtactn2}</span></td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"black",fontSize:"20px"}}><b>Relationship</b>:{contacts.relation2}</span></td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"black",fontSize:"20px"}}><b>Contact No</b>:{contacts.econtact2}</span></td>
                            </tr>
                        </table>
                    </div>
                    <div style={{marginTop:"2%",marginBottom:"3%"}} >
                        <center>
                            <span style={{color:'black',marginTop:"20%"}}>Noble Saint Fitness,{contacts.centerlocation}</span>
                        </center>
                    </div>
                    <div style={{marginTop:"20%"}}>
                        <span style={{color:"black",fontSize: "30px"}}><b>Liability Waiver</b></span>
                        <div style={{marginLeft: "2%"}}>
                            <Typography mt={4} color={"black"} fontSize={13} sx={{alignItems:"justify"}}>I ____________________________________________________ acknoledge that I am responsible for my own health & physical condition. Also, I understood that my participation in the exercise program could cause injury based on performing these activities. I release them from any liability for these injuries.
                            <br/><br/>
                            No fitness trainer or fellow members are liable for any accidental injuries or illness which I may incur as a result of participating in any program from<b> Noble Saint Fitness</b>. I assure all the risks connected to all the programs and consent to participate
                            <br/><br/>
                            It is my responsibility to describe any physical limitations, disabilities, or related restrictions that may affect my ability to participate in the <b>Noble Saint Fitness </b> program. This includes any charges that may occur throughout that program </Typography>
                        </div>
                    </div>
                    <hr style={{backgroundColor: "black", borderColor: "black", color: "black", width: "70%",  marginTop: "20px"}}/>
                    <br/>
                    <div style={{marginTop:"2%"}}>
                        <label mt={5} ml={4} style={{color:"black"}} fontSize={28}><b>Member or Parent Signature</b>: ____________________________________________________ </label><br/><br/>
                        <label mt={2} ml={4} style={{color:"black"}} fontSize={28}><b> Date</b>: ___________________________</label>
                    </div>
                    
                    <div>
                        <span style={{color:"black",marginTop:"5%",fontSize: "30px"}}><b>Document</b></span><br/>
                        <img src={contacts.fdocument} alt="User" style={{width: "450px", height: "245px",marginLeft:"2%", marginTop: "2%"}} />
                        <img src={contacts.bdocument} alt="User" style={{width: "450px", height: "245px",marginLeft:"2%", marginTop: "2%"}} />
                    </div>
                    <br/><br/><br/><br/>
                    <div style={{marginTop:"5%"}} >
                        <center>
                            <span style={{color:'black',marginTop:"20%"}}>Noble Saint Fitness,{contacts.centerlocation}</span>
                        </center>
                    </div>
                    
                    </Box>
                </div>
        </main>
</div>
);
};
export default Prform;