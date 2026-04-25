import React, { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Slidebar from '../component/CommonPages/Slidebar'
import { Outlet } from 'react-router-dom';
import {toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationPopup from '../component/CommonPages/ConfirmationPopup'
import MiniLoader from "../component/CommonPages/MiniLoader";
import {decryptData} from "../utils/encrypt"
function CommonLayout(){
     const navigate = useNavigate()
     const role=decryptData(localStorage.getItem("role"))
    const [showLoader,setShowLoader]=useState(false)
     const [confirmLog, setconfirmLog] = useState(false)   
 const handleLogout = () => {
          setconfirmLog(true)
     }
     const handleCancel = () => {
          setconfirmLog(false)
     }
     const handleCross = () => {
          setconfirmLog(false)
     }

     const handleConfirm = () => {
           setconfirmLog(false); 
           setShowLoader(true);

         setTimeout(() => {
        setShowLoader(false);   
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.success("Logged out successfully 👋");
        navigate('/login');    
    }, 2000);
}
     
     return (
          <div>
              <div className="flex min-h-screen ">
 
  <Slidebar
    handleLogout={handleLogout}
    role={role}
  />

 
  <div
    className="
      flex-1
      bg-gray-100
      w-full
      pt-20           
      md:pt-6         
      md:ml-56         
      px-3 sm:px-5 md:px-6
      min-w-0
      sm:pt-20
      transition-all duration-300
    "
  >
    <Outlet />
  </div>

 
  {confirmLog && (
    <ConfirmationPopup
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      handleCross={handleCross}
      message="Are you sure you want to logout?"
    />
  )}

 
  {showLoader && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[1100]">
      <MiniLoader size="w-12 h-12" />
    </div>
  )}
</div>
          </div>
     )
}

export default CommonLayout
