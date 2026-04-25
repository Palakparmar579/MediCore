import React, { useState, useEffect } from "react";
import trasparentLogo from "../../assets/transparentLogo.png";

import {
  FaUserShield,
  FaThLarge,
  FaSignOutAlt,
  FaIdCard,
  FaEnvelopeOpenText,
  FaBars,
  FaTimes,
  FaSitemap,
  FaFileMedicalAlt,
  FaCalendarPlus,
  FaUserTag,
  FaUserInjured,
  FaUserMd
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const AdminSlidebar = ({ role, handleLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <FaThLarge /> },
      { name: "Manage Roles", path: "/admin/manageRoles", icon: <FaUserShield /> },
      { name: "Requests", path: "/admin/requests", icon: <FaEnvelopeOpenText /> },
      { name: "Department", path: "/admin/department", icon: <FaSitemap /> },
      { name: "Assign Department", path: "/admin/assignDepartment", icon: <FaUserTag /> },
      { name: "Profile", path: "/admin/profile", icon: <FaUserTag /> }

    ],
    doctor: [
      { name: "Dashboard", path: "/doctor/dashboard", icon: <FaThLarge /> },
      { name: "Appointments", path: "/doctor/appointment", icon: <FaCalendarPlus /> },
      { name: "Patients", path: "/doctor/patient", icon: <FaUserInjured /> },
            { name: "Profile", path: "/doctor/profile", icon: <FaUserTag /> }

    ],
    nurse: [
      { name: "Dashboard", path: "/nurse/dashboard", icon: <FaThLarge /> },
            { name: "Profile", path: "/nurse/profile", icon: <FaUserTag /> }

    ],
    patient: [
      { name: "Dashboard", path: "/patient/dashboard", icon: <FaThLarge /> },
      { name: "Book Appointment", path: "/patient/appointment", icon: <FaCalendarPlus /> },
      { name: "Records", path: "/patient/record", icon: <FaFileMedicalAlt /> },
      { name: "Profile", path: "/patient/profile", icon: <FaUserTag /> }

    ],
  };

  return (
    <>
     
      {isMobile && (
        <div className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-[1000] shadow-sm">
          <div className="flex items-center gap-2">
            <img src={trasparentLogo} className="w-8" />
            <h3 className="text-[#01253c] font-semibold">MediCore</h3>
          </div>

          <button onClick={() => setIsOpen(true)}>
            <FaBars className="text-[#01253c] text-lg" />
          </button>
        </div>
      )}

    
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

     
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col w-56 px-4 py-5 z-[1000] transition-transform duration-300
        ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-[#01253c]"
          >
            <FaTimes />
          </button>
        )}

        
        <div className="flex items-center gap-3 mb-8">
          <img src={trasparentLogo} className="w-9" />
          <h3 className="text-lg font-semibold text-[#01253c] tracking-wide">
            MediCore
          </h3>
        </div>

        
        <ul className="space-y-2">
          {menuItems[role]?.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#1b2b41] text-white shadow-sm"
                    : "text-[#01253c] hover:bg-[#f1f7fb]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  
                 

                 
                  <span
                    className={`text-base transition-all duration-200 ${
                      isActive ? "text-white" : "text-[#01253c]"
                    }`}
                  >
                    {item.icon}
                  </span>

                
                  <span className="tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </ul>

       
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSlidebar;