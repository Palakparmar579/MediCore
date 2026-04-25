import React, { useEffect, useState } from "react";
import { FaEdit, FaUserPlus, FaBuilding } from "react-icons/fa";
import { FaHospitalAlt } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import api from "../../Config/Axios";
import ConfirmationPopup from "../../component/CommonPages/ConfirmationPopup";
import { toast } from "react-hot-toast";
import CustomToolTip from "../../component/CommonPages/CustomToolTip";
import DashboardCard from "../../component/CommonPages/DashboardCard";
import useTitle from "../../hooks/userTitle";

const Department = () => {
  useTitle("Department")
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({
    department: "",
    description: "",
  });
  const [stats, setStats] = useState({
    deptTotal: 0,
    active: 0,
    inactive: 0,
  });
 const [errors,setErrors]=useState({})
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [doctorDetail, setDoctorDetail] = useState([]);

  // cards stats
  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/api/department/dashBoardStats"
      );
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const departmentCount = stats.deptTotal;
  const activeCount = stats.active;
  const inActiveCount = stats.inactive;

  // Status Popup
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [activeRole, setActiveRole] = useState("all");
  const [search, setSearch] = useState("");
  const limit = 6;

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDetail(page);
      fetchStats();
    }, 300);
    return () => clearTimeout(delay);
  }, [page, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
   setErrors({})
  };

  const fetchDetail = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/department/pagination?page=${pageNumber}&limit=${limit}&search=${search}`
      );
      setDoctorDetail(response.data.data);
      setPage(response.data.page);
      settotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(doctorDetail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors={}
    if (!form.department) {
      errors.department="Please select department!";
    } 
     if (!form.description) {
      errors.description="Description is required";
    }
    setErrors(errors)
    if(Object.keys(errors).length>0){
     return 
    }
    setErrors({})
    try {
      let response;
      if (editId) {
        response = await api.put(
          `/api/department/editDep/${editId}`,
          { department: form.department, description: form.description }
        );
        toast.success("User updated successfully");
      } else {
       
        response = await api.post(
          "/api/department/registerDep",
          { department: form.department, description: form.description },
         
        );
        toast.success("Details added successfully!");
      }
      fetchDetail(page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    
    setForm({ department: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setShowForm(true);
    setErrors({})
    setEditId(null);
    setForm({ department: "", description: "" });
  };

  const handleEdit = (item) => {
    console.log(item);
    setShowForm(true);
    setEditId(item._id);
    setForm({
      name: item.name,
      department: item.department,
      description: item.description,
    });
  };

  const handleStatus = (id, status) => {
    console.log("CLICK ID:", id);
    setShowStatusPopup(true);
    setCurrentStatus(status);
    setStatusId(id);
  };

  const handleStatusCross = () => {setShowStatusPopup(false); setErrors({})}
  const handleStatusCancel = () => {setShowStatusPopup(false);setErrors({})}

  const handleStatusConfirm = async () => {
    try {
    
      await api.put(
        `/api/department/toggleStatus/${statusId}`,
       
      );
      toast.success("Status Updated Successfully");
      fetchDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setShowStatusPopup(false);
    setStatusId(null);
  };

  const cards = [
    {
      title: "Total Department",
      count: departmentCount,
      icon: <FaHospitalAlt className="text-xl" />,
    },
    {
      title: "Active Department",
      count: activeCount,
      icon: <MdCheckCircle className="text-xl text-green-500" />,
    },
    {
      title: "Inactive Department",
      count: inActiveCount,
      icon: <MdCancel className="text-xl text-red-500" />,
    },
  ];

  const handleAddDepartment = () => setShowForm(true);

  return (
    <div className=" min-h-screen">

      {showStatusPopup && (
        <ConfirmationPopup
          heading={`Confirm ${nextStatus} status`}
          handleCancel={handleStatusCancel}
          handleConfirm={handleStatusConfirm}
          handleCross={handleStatusCross}
          message={`Are you sure want to ${nextStatus} this ?`}
        />
      )}

     
      <div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
          Department List
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1">
          Manage departments efficiently by adding their details.
        </p>
      </div>

      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-5 sm:mt-8 md:mt-10 gap-3">
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

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-[#00536e] text-white px-4 sm:px-5 py-2 rounded-md hover:bg-[#00455c] hover:scale-90 hover:shadow-xl transition-all duration-300 ease-in-out active:scale-90 active:shadow-md cursor-pointer w-full sm:w-auto text-sm"
        >
          <FaUserPlus />
          Add Department
        </button>
      </div>

      
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2  md:w-[95%]  lg:grid-cols-3 lg:w-185 xl:w-240 gap-4 sm:gap-5 md:gap-4 my-6 sm:my-8 md:my-10">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            count={card.count}
            icon={card.icon}
          />
        ))}
      </div>

     
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-[1990]">
          <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden relative">
           
            <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 pb-3 border-b bg-gradient-to-r from-[#00304e] to-[#005f73] rounded-t-2xl">
              <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
                {editId ? "Edit Department Details" : "Add Department Details"}
              </h3>
              <p
                onClick={() => setShowForm(false)}
                className="cursor-pointer text-white text-2xl hover:text-gray-300 leading-none"
              >
                &times;
              </p>
            </div>

          
            <div className="overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-gray-50 max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh]">
              <form onSubmit={handleSubmit} id="doctor-form">
                <div className="flex flex-col gap-4 sm:gap-5">

                 
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 md:gap-4">
                    <label className="text-sm font-semibold sm:w-28 md:w-32 text-gray-700 sm:pt-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="Enter department"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#00536e]/40 focus:border-[#00536e]"
                      />
                     {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                    </div>
                  </div>

                
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 md:gap-4">
                    <label className="text-sm font-semibold sm:w-28 md:w-32 text-gray-700 sm:pt-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#00536e]/40 focus:border-[#00536e]"
                      />
                      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                  </div>

                </div>
              </form>
            </div>

          
            <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-t bg-white rounded-b-2xl shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setForm({ department: "", description: "" });
                  setDepartmentError("");
                  setDescriptionError("");
                  setShowForm(false);
                }}
                className="cursor-pointer bg-red-500 text-white px-4 sm:px-5 md:px-6 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition duration-300 shadow-md text-sm"
              >
                Cancel
              </button>
              <button
                form="doctor-form"
                type="submit"
                className="cursor-pointer bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-4 sm:px-5 md:px-6 py-2 rounded-lg hover:scale-105 transition duration-300 shadow-md text-sm"
              >
                {editId ? "Update" : "Submit →"}
              </button>
            </div>
          </div>
        </div>
      )}

     
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent mb-3 mt-2">
        Added Departments
      </h3>

      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-4 sm:mt-5 md:mt-6">
        {doctorDetail.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 sm:py-14 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <FaBuilding className="text-3xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed max-w-xs sm:max-w-sm">
              No departments have been created yet.
              <br />
              Add a department to organize and manage your users effectively.
            </p>
            <button
              onClick={handleAddDepartment}
              className="flex items-center justify-center gap-2 bg-[#1b2b41] text-white px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base rounded-lg hover:bg-[#00455c] hover:shadow-lg hover:scale-105 cursor-pointer transition-all duration-300 w-auto"
            >
              + Add Department
            </button>
          </div>
        ) : (
          doctorDetail.map((item) => (
            <div
              key={item._id}
              className="relative group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[#00304e] group-hover:w-[6px] transition-all duration-300"></div>

              <div className="p-4 sm:p-5 relative z-10">
                <div className="flex justify-between items-start">
                  <h2 className="text-base sm:text-lg font-bold text-[#00304e] group-hover:text-black transition pr-2 break-words">
                    {item.department}
                  </h2>
                </div>

                <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase">
                  Dept No: {item.deptNum}
                </p>

                <div className="w-full h-[1px] bg-gray-200 my-3"></div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 overflow-y-auto h-[50px]">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <CustomToolTip text={`${nextStatus} status`}>
                    <span
                      onClick={() => handleStatus(item._id, item.status)}
                      className={`cursor-pointer flex justify-center items-center text-xs px-3 py-2 rounded-full font-medium shadow-sm transition-colors
                        ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                            : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                        }`}
                    >
                      {item.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </CustomToolTip>

                  <button
                    onClick={() => handleEdit(item)}
                    className="cursor-pointer p-1 px-2 rounded-lg bg-gray-100 text-[#00304e] hover:bg-[#00304e] hover:text-white transition-all duration-300 shadow hover:scale-110"
                  >
                    <CustomToolTip text="Edit">
                      <FaEdit size={13} />
                    </CustomToolTip>
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#00304e]/20 transition pointer-events-none"></div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && doctorDetail.length > 0 && (
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 sm:gap-2 mt-4 pb-4 text-xs">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 sm:px-3 py-1 rounded-md border text-gray-600 hover:bg-[#00455c] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pre
          </button>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`w-6 h-6 flex items-center justify-center rounded text-[11px] border transition
                  ${
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
            className="px-2 sm:px-3 py-1 rounded-md border text-gray-600 hover:bg-[#00455c] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Department;
