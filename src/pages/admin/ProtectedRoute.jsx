import React, { useEffect,useState } from 'react';
import { decryptData } from "../../utils/encrypt";
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import api from '../../Config/Axios';
const ProtectedRoute = () => {
  const [isValid,setIsValid]=useState(null)
  const navigate=useNavigate()
  const token =localStorage.getItem("token");
  const role = decryptData(localStorage.getItem("role"));

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  
   if (!role) {
    return <Navigate to='/login' replace />;
   }
 
 useEffect(()=>{
  const tokenVerifyApi=async()=>{
    try{
       const response=await api.get("/api/auth/tokenVerify");
       setIsValid(response.data.valid)
    }
    catch(error){
   setIsValid(false)
    }
   }
   if(token){
  tokenVerifyApi();
   }else{
    setIsValid(false);
   }
 },[token])

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("role");
      const updatedToken = localStorage.getItem("token");

      if (!updatedRole || !updatedToken) {
        localStorage.clear();
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]); 
 if (isValid === null) {
    return null; 
  }

  if (!isValid) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }



  return <Outlet />;
};

export default ProtectedRoute;