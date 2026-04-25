import React, { useState, useEffect } from "react";
import ConfirmationPopup from '../../component/CommonPages/ConfirmationPopup'
import { Tooltip } from "recharts";
import {
  FaUserPlus,
  FaTrashAlt,
  FaEdit,
  FaUsers,
  FaKey,
  FaPowerOff,
} from "react-icons/fa";
import api from "../../Config/Axios";
import { toast } from "react-hot-toast";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import CustomToolTip from "../../component/CommonPages/CustomToolTip";
import useTitle from "../../hooks/userTitle";


function ManageRoles() {
  useTitle("Manage Roles")
  const [errors,setErrors]=useState({})
  const [roles, setRoles] = useState([]);
  const token = localStorage.getItem("token");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [activeRole, setActiveRole] = useState("all");
  const [search, setSearch] = useState("");
  const limit = 8;

  // Resend
  const [resetId, setResetId] = useState(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [LoaderId, setLoaderId] = useState(null);

  // Status Popup
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showForm, setshowForm] = useState(false);
  const [editId, seteditId] = useState(null);
  const [showLoader, setShowloader] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [showPagination, setShowPagination] = useState(false);

  const [formData, setformData] = useState({
    role: "",
    name: "",
    age: "",
    email: "",
    password: "",
  });

  // for search+pagination
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRoles(page, activeRole, search);
    }, 300);
    return () => clearTimeout(delay);
  }, [page, activeRole, search]);

  const handleEdit = (item) => {
    setshowForm(true);
    setEditMode(true);
    seteditId(item._id);
    setformData({
      role: item.role,
      name: item.name,
      age: item.age,
      email: item.email,
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
     setErrors({})
  };

  const handleAddClick = () => {
    setshowForm(true);
    setErrors({})
    setEditMode(false);
    seteditId(null);
    setformData({ role: "", name: "", age: "", email: "", password: "" });
  };

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors={}

   if (!formData.role) {
    errors.role = "Please enter role";
  }

  if (!formData.name) {
    errors.name = "Please enter name";
  }

  if (!formData.age) {
    errors.age = "Please enter age";
  } else if (formData.age < 1 || formData.age > 105) {
    errors.age = "Age must be between 1 and 105";
  }

  if (!formData.email) {
    errors.email = "Please enter email";
  } else if (!emailPattern.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  const existUser = roles.some(
    (item) => item.email === formData.email && item._id !== editId
  );

  if (existUser) {
    errors.email = "Email already exists";
  }

  
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

   
    try {
     
      let response;
      if (editId) {
        setShowloader(true);
        response = await api.put(
          `/api/auth/edit-user/${editId}`,
          { role: formData.role, name: formData.name, age: Number(formData.age), email: formData.email },
         
        );
        toast.success("User updated successfully");
      } else {
        setShowloader(true);
        response = await api.post(
          "/api/auth/register",
          { role: formData.role, name: formData.name, age: Number(formData.age), email: formData.email },
          config
        );
        toast.success("User added successfully!");
      }
      fetchRoles(page, activeRole, search);
      setformData({ role: "", name: "", age: "", email: "" });
      seteditId(null);
      setshowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setShowloader(false);
    }
  };

  const handleCancel = () => {
    setshowForm(false);
    setErrors({})
    seteditId(null);
  };

  const fetchRoles = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/auth/pagination?page=${pageNumber}&limit=${limit}&search=${search}&role=${activeRole}`
      );
      setRoles(response.data.data);
      setPage(response.data.page);
      settotalPages(response.data.totalPages);
       setErrors({}); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async (id) => {
    setShowResetPopup(true);
    setResetId(id);
  };

  const handleResetCancel = () => setShowResetPopup(false);
  const handleResetCross = () => setShowResetPopup(false);

  const handleResetConfirm = async () => {
    try {
      setLoaderId(resetId);
    
      const response = await api.post(`${backendUrl}/api/auth/resendPass/${resetId}`);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setShowResetPopup(false);
      setResetId(null);
      setLoaderId(null);
    }
  };

  const handleStatus = (id, status) => {
    setShowStatusPopup(true);
    setStatusId(id);
    setCurrentStatus(status);
  };

  const handleStatusCross = () => {setShowStatusPopup(false);
     setErrors({}); 
  }
  const handleStatusCancel = () => {setShowStatusPopup(false);
     setErrors({}); 
  }

  const handleStatusConfirm = async () => {
    try {
   
      await api.put(`/api/auth/toggleStatus/${statusId}`);
      toast.success("Status Updated Successfully");
      fetchRoles(page);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
    setShowStatusPopup(false);
    setStatusId(null);
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case "doctor": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "nurse": return "bg-pink-50 text-pink-700 border-pink-100";
      case "patient": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const handleAddUser = () => setshowForm(true);

  return (
    <div className="min-h-screen">

      
      {showResetPopup && (
        <ConfirmationPopup
          heading="Confirm Reset Password"
          handleCancel={handleResetCancel}
          handleConfirm={handleResetConfirm}
          handleCross={handleResetCross}
          loading={LoaderId}
          message="You are about to reset this user's password. Do you want to continue?"
        />
      )}

     
      {showStatusPopup && (
        <ConfirmationPopup
          heading={`Confirm ${nextStatus} status`}
          handleCancel={handleStatusCancel}
          handleConfirm={handleStatusConfirm}
          handleCross={handleStatusCross}
          currentStatus={currentStatus}
          message={`Are you sure to mark this status as ${nextStatus} ?`}
        />
      )}

      <div className="md:max-w-[1100px] max-w-[1120px] mx-auto px-6 sm:px-5 md:px-6 lg:px-8">

       
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-4 sm:py-5 md:py-6">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
              Manage Roles
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-0.5">
              Control roles efficiently
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 bg-[#1b2b41] text-white px-4 py-2 sm:px-5 rounded-md hover:bg-[#00455c] hover:scale-90 hover:shadow-xl transition-all duration-300 ease-in-out active:scale-90 active:shadow-md cursor-pointer w-full sm:w-auto text-sm sm:text-base"
          >
            <FaUserPlus />
            Add Role
          </button>
        </div>

       
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-[1999] overflow-y-auto">
            <div className="bg-white w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[60vw] lg:max-w-[45vw] xl:max-w-[35vw] max-h-[90vh] overflow-auto flex flex-col rounded-2xl shadow-2xl my-auto">

             
              <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-[#00304e] to-[#005f73] flex-shrink-0 rounded-t-2xl">
                <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
                  {isEditMode ? "Edit Role Details" : "Add Role Details"}
                </h3>
                <p
                  onClick={() => setshowForm(false)}
                  className="cursor-pointer text-white text-2xl hover:text-gray-300 leading-none"
                >
                  &times;
                </p>
              </div>

            
              <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-gray-50 flex-1">
                <form onSubmit={handleFormSubmit} id="role-form">
                  <div className="flex flex-col gap-4 sm:gap-5">

                   
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <label className="text-sm font-semibold sm:w-28 md:w-32 w-full text-gray-700 sm:whitespace-nowrap">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
                        >
                          <option value="">Select Role</option>
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                        </select>
                  {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                      </div>
                    </div>

                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <label className="text-sm font-semibold sm:w-28 md:w-32 w-full text-gray-700 sm:whitespace-nowrap">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
                        />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                    </div>

                    {/* Age */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <label className="text-sm font-semibold sm:w-28 md:w-32 w-full text-gray-700 sm:whitespace-nowrap">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Enter age"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
                        />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <label className="text-sm font-semibold sm:w-28 md:w-32 w-full text-gray-700 sm:whitespace-nowrap">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <input
                          type="email"
                          name="email"
                          disabled={isEditMode}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73] ${
                            isEditMode ? "text-gray-400 cursor-not-allowed bg-gray-100" : ""
                          }`}
                        />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>
                    </div>

                  </div>
                </form>
              </div>

             
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:justify-between items-stretch sm:items-center px-4 sm:px-5 md:px-6 py-3 border-t bg-white flex-shrink-0 rounded-b-2xl">
                <button
                  onClick={handleCancel}
                  type="button"
                  className="w-full sm:w-auto bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition duration-300 shadow-md text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  form="role-form"
                  type="submit"
                  disabled={showLoader}
                  className={`w-full sm:w-auto bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-4 sm:px-6 py-2 rounded-lg hover:scale-105 transition duration-300 shadow-md text-sm ${
                    showLoader ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {showLoader ? (
                    <span className="flex items-center justify-center gap-2">
                      <MiniLoader />
                      {editId ? "Updating" : "Submitting"}
                    </span>
                  ) : (
                    editId ? "Update" : "Submit →"
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

       
        <div className="mt-5 sm:mt-6 md:mt-8">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
            Added Roles
          </h3>

          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:grid xl:flex lg:flex sm:justify-between mb-4">

            
            <div className="grid grid-cols-4 overflow-hidden rounded-lg border border-gray-200 w-full sm:w-auto">
              {["all", "doctor", "nurse", "patient"].map((role, i, arr) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setPage(1);
                    fetchRoles(1, role, search);
                  }}
                  className={`text-xs sm:text-sm py-2 px-2 sm:px-3 transition-all duration-200 border-0
                    ${i === 0 ? "rounded-l-lg" : ""}
                    ${i === arr.length - 1 ? "rounded-r-lg" : "border-r border-gray-200"}
                    ${activeRole === role
                      ? "bg-[#00304e] text-white"
                      : "bg-white hover:bg-[#e6f2f5]"
                    }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 md:w-64 lg:w-72 pl-10 pr-4 py-2 rounded-full border border-[#00304e] focus:outline-none focus:ring-2 focus:ring-[#00304e]/40 text-sm"
              />
              <svg
                className="w-4 h-4 text-[#00304e] absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border border-gray-200 w-full">
            <table className="min-w-[89%] w-full bg-white border-collapse text-sm">
              <thead className="bg-[#1b2b41]  text-white">
                <tr>
                  <th className="px-3 py-3 text-center whitespace-nowrap text-xs sm:text-sm">S.No</th>
                  <th className="px-3 py-3 text-left whitespace-nowrap text-xs sm:text-sm">Name</th>
                  <th className="px-3 py-3 text-left whitespace-nowrap text-xs sm:text-sm">Age</th>
                  <th className="px-3 py-3 text-left whitespace-nowrap text-xs sm:text-sm">Email</th>
                  <th className="px-3 py-3 text-left whitespace-nowrap text-xs sm:text-sm">Role</th>
                  <th className="px-3 py-3 text-left whitespace-nowrap text-xs sm:text-sm">Status</th>
                  <th className="px-3 py-3 text-left whitespace-nowrap text-xs sm:text-sm">Action</th>
                </tr>
              </thead>

              {roles.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="7" className="py-10">
                      <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <FaUsers className="text-3xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                          No users have been added yet.
                          <br />
                          Start by adding a new user to see data here.
                        </p>
                        <button
                          onClick={handleAddUser}
                          className="flex items-center justify-center gap-2 bg-[#1b2b41] text-white px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-lg hover:bg-[#00455c] hover:shadow-lg hover:scale-105 cursor-pointer transition-all duration-300 w-full max-w-[150px]"
                        >
                          + Add User
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {roles.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                      <td className="px-3 py-3 text-center text-xs sm:text-sm">{index + 1}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm">{item.name}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm">{item.age}</td>
                      <td className="px-3 py-3 break-all min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm">{item.email}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getRoleStyles(item.role)}`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div
                          onClick={() => handleStatus(item._id, item.status)}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          <CustomToolTip text="Status">
                            <FaPowerOff
                              className={`text-sm sm:text-base transition-all duration-300 ${
                                item.status === "active" ? "text-green-600" : "text-red-600"
                              }`}
                            />
                          </CustomToolTip>
                          <p className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                            item.status === "active" ? "text-green-600" : "text-red-600"
                          }`}>
                            {item.status === "active" ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2 sm:gap-3 text-base sm:text-lg">
                          <CustomToolTip text="Edit User">
                            <FaEdit
                              onClick={() => handleEdit(item)}
                              className="cursor-pointer text-blue-400 hover:scale-110 transition"
                            />
                          </CustomToolTip>
                          {LoaderId === item._id ? (
                            <MiniLoader />
                          ) : (
                            <CustomToolTip text="Reset Password">
                              <FaKey
                                onClick={() => handleResend(item._id)}
                                className="cursor-pointer text-gray-400 hover:text-gray-600 hover:scale-110 transition"
                                title="Resend Password"
                              />
                            </CustomToolTip>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && roles.length > 0 && (
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 mt-4 pb-4 text-xs">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-2 sm:px-2.5 py-1 rounded-md border text-gray-600 hover:bg-[#00455c] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-6 h-6 flex items-center justify-center rounded text-[11px] border transition ${
                      page === pg
                        ? "bg-[#00455c] text-white border-[#00455c]"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-2 sm:px-2.5 py-1 rounded-md border text-gray-600 hover:bg-[#00455c] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ManageRoles;
