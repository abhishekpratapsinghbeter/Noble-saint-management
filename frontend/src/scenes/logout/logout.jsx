import React, { useEffect } from "react";
 import { useNavigate } from "react-router-dom";
const Logout =() =>{
    const history=useNavigate();
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
    useEffect(()=>{
        fetch('/logout',{
            headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
            },
            credentials:"include"
        }).then((res)=>{
            history('/',{replace:true});
            if(res.status !== 200){
                const error = new Error(res.error);
                throw error;
            }
        }).catch((err) => {
            console.log(err);
        })
    })
    return(
        <>
        <h1>Logout</h1>
        </>
    )
}

export default Logout