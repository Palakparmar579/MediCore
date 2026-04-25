import React from "react";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,

} from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../Config/Axios";
function Appointment() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [getDoctor, setGetDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [errormobNumber, setmobNumberError] = useState("");
  const [errorgender, setgenderError] = useState("");
  const [erroraddress, setaddressError] = useState("");
  const [errordob, setdobError] = useState("");
  const [errordoctor, setdoctorError] = useState("");
  const [errorappDate, setappDateError] = useState("");
  const [error, setError] = useState("");
  const [errortime, settimeError] = useState("");
  const [errorhealthIssue, sethealthIssueError] = useState("");
  const [getAppointment,setgetAppointment]=useState([])
  const [showForm,setShowForm]=useState(false)
  const [userAppointment,setUserappointment]=useState([])

const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const [formData, setformData] = useState({
   firstName:"",
    mobNumber: "",
    gender: "",
    address: "",
    dob: "",
   email:"",
    doctor: "",
    appDate: "",
    time: "",
   healthIssue: "",
  });

  

  const fetchAppointments=async()=>{
    try{
    const response=await api.get(
      "/api/appointmentPatient/getAppointment"
    )
    setgetAppointment(response.data)
    }
    catch(error){
      toast.error(error.response?.data?.message||"Something went wrong")
    }
  }


  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/department/getDep");
      setGetDoctor(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const activeDepartments = getDoctor.filter(
    (dept) => dept.status === "active",
  );
  const handleChange = (e) => {
    const department= getDoctor.find((i) => i._id === e.target.value);
    setSelectedDoctor(department);
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  
    setdobError("")
    settimeError("")
    setdoctorError("")
    setgenderError("")
    setaddressError("")
    setappDateError("")
    setmobNumberError("")
  };
  
 

// Pagination  



const fetchPaginationAppointment = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/appointmentPatient/pagination?page=${pageNumber}&limit=${limit}`
      );
      setUserappointment(response.data.data);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
 
useEffect(() => {
   
    fetchAppointments();
    fetchPaginationAppointment(page);
    fetchDoctors();
  },[page]);

  const handleSumbit = async(e) => {
    e.preventDefault();
   
    const mobileRegex = /^[0-9]{10}$/;
  


  if(!formData.mobNumber){
  return  setmobNumberError("Number is required")
  }
if (!mobileRegex.test(formData.mobNumber)) {
  setmobNumberError("Mobile no. must be exactly 10 digits");
  return;
}
  
    
    
    if (!formData.address) {
    return  setaddressError("First name is required");
    }
    if (!formData.dob) {
    return  setdobError("First name is required");
    }
    if (!formData.gender) {
    return  setgenderError(" Select gender");
    }
    if (!formData.department) {
    return  setdoctorError("Select Department");
    }
    if (!formData.appDate) {
    return  setappDateError("Date is required");
    }
    if (!formData.time) {
     return settimeError("Time is required");
    }
    if (!formData.healthIssue) {
    return  sethealthIssueError("healthIssue is required");
    }
 
const isSlotTaken = getAppointment.some((item) =>
  item.appDate?.substring(0, 10) === formData.appDate &&
  item.time === formData.time &&
  item.department === formData.department
);
if (isSlotTaken) {
  return toast.error(
  `Time slot "${formData.time}" on ${formData.appDate} is already booked. Please select another time.`
)}

   try{
  const response=await api.post(
     "/api/appointmentPatient/register",{
      firstName:name,
     mobNumber: formData.mobNumber,
    gender: formData.gender,
    address: formData.address,
    dob: formData.dob,
     email:email,
    department: formData.department,
    appDate: formData.appDate,
    time: formData.time,
    healthIssue: formData.healthIssue,
     }
  )
  toast.success("Appointment booked succeccfully!!")
  setformData({
     firstName,
    mobNumber: "",
    gender: "",
    address: "",
    dob: "",
    email,
    department: "",
    appDate: "",
    time: "",
    healthIssue: "",

  })
    setShowForm(false)
   
  
  
   setmobNumberError("")
   setgenderError("")
   setaddressError("")
   setdobError("")
   setdoctorError("")
   setappDateError("")
   settimeError("")
   sethealthIssueError("")
   }
   catch(error){
       toast.error(error.response?.data?.message||"Something went wrong")
   }
  };

  console.log(formData);

  const handleAddForm=()=>{
    setShowForm(true)

   
  
   setmobNumberError("")
   setgenderError("")
   setaddressError("")
   setdobError("")
   setdoctorError("")
   setappDateError("")
   settimeError("")
   sethealthIssueError("")
   
    setformData({
    firstName,
    mobNumber: "",
    gender: "",
    address: "",
    dob: "",
   email,
    department: "",
    appDate: "",
    time: "",
    healthIssue: "",
  })
  
  }
 
const handleCancelForm=()=>{
    setShowForm(false)
}
const handleFormCross=()=>{
   setShowForm(false)
}

const email=localStorage.getItem("email")
const name=localStorage.getItem("name")
  return (
    <div className="min-h-screen">


       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#00304e]">
            Book Your Appointment
          </h2>
          <p className="text-gray-500 text-sm">
            Easily schedule your visit with our specialists.
          </p>
          <p className="text-gray-400 text-xs">
            Choose department, date and time — fast and simple.
          </p>
        </div>

        <button
          onClick={handleAddForm}
          className=" cursor-pointer bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg shadow"
        >
          Book Appointment
        </button>
      </div>

     {showForm && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-1000 overflow-y-auto">

    <div className="bg-white w-[95%] sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[45%]
    max-h-[95vh] flex flex-col rounded-2xl shadow-2xl">

     
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b 
      bg-gradient-to-r from-[#00304e] to-[#005f73] rounded-t-2xl">
        
        <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
          Book Appointment
        </h3>

        <p
          onClick={handleFormCross}
          className="cursor-pointer text-white text-2xl hover:text-gray-300"
        >
          &times;
        </p>
      </div>

     
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5 bg-gray-50">

        <form 
        
        onSubmit={handleSumbit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

           
          <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
               readOnly
               name="email"
                value={email}
                type="email"
                className="w-full mt-1 px-3 py-2 text-gray-400 cursor-not-allowed  rounded-xl shadow-sm"
              />
            
            </div>
           
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">First Name</label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                 readOnly
                  name="firstName"
                  value={name}
                  type="text"
                 
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-400 cursor-not-allowed  rounded-xl shadow-sm focus:ring-2 focus:ring-[#00536e]/40 outline-none"
                />
              </div>
         
            </div>  
          

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-600">Mobile
                 <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  onChange={handleChange}
                  name="mobNumber"
                  value={formData.mobNumber}
                  type="number"
                  placeholder="Mobile"
                  className="w-full pl-10 pr-3 py-2.5 text-sm  rounded-xl shadow-sm"
                />
              </div>
              {errormobNumber && <p className="text-red-500 text-xs mt-1">{errormobNumber}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-gray-600">Gender
                 <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                name="gender"
                value={formData.gender}
                className="w-full mt-1 py-2.5 px-3 text-sm  rounded-xl shadow-sm"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              {errorgender && <p className="text-red-500 text-xs">{errorgender}</p>}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Address
                 <span className="text-red-500">*</span>
              </label>
              <textarea
              placeholder="Enter your address"
                onChange={handleChange}
                name="address"
                value={formData.address}
                rows="2"
                className="w-full mt-1 px-3 py-2  rounded-xl shadow-sm"
              />
              {erroraddress && <p className="text-red-500 text-xs">{erroraddress}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium text-gray-600">DOB
                 <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                name="dob"
                value={formData.dob}
                type="date"
                className="w-full mt-1 px-3 py-2  rounded-xl shadow-sm"
              />
              {errordob && <p className="text-red-500 text-xs">{errordob}</p>}
            </div>

          
            

           
            <div className="md:col-span-2 pt-4 -t">
              <h4 className="font-semibold text-[#00304e]">Appointment Details</h4>
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium text-gray-600">Department
                 <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                name="department"
                value={formData.department}
                className="w-full mt-1 px-3 py-2  rounded-xl shadow-sm"
              >
                <option value="">Select Department</option>
                {activeDepartments.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.department}
                  </option>
                ))}
              </select>
              {errordoctor && <p className="text-red-500 text-xs">{errordoctor}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-gray-600">Appointment Date
                 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="appDate"
                value={formData.appDate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2  rounded-xl shadow-sm"
              />
              {errorappDate && <p className="text-red-500 text-xs">{errorappDate}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium text-gray-600">Time
                 <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                name="time"
                value={formData.time}
                className="w-full mt-1 px-3 py-2  rounded-xl shadow-sm"
              >
                <option value="">Select Time</option>
                <option>10:30 AM - 11:00 AM</option>
                <option>11:00 AM - 11:30 AM</option>
                <option>11:30 AM - 12:00 PM</option>
                <option>12:00 PM - 12:30 PM</option>
                <option>12:30 PM - 1:00 PM</option>
                <option>2:30 PM - 3:00 PM</option>
                <option>3:00 PM - 3:30 PM</option>
                <option>3:30 PM - 4:00 PM</option>
                <option>4:00 PM - 4:30 PM</option>
                <option>4:30 PM - 5:00 PM</option>
              </select>
              {errortime && <p className="text-red-500 text-xs">{errortime}</p>}
            </div>

            {/* healthIssue */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Health Issue

                <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={handleChange}
                name="healthIssue"
                value={formData.healthIssue}
                rows="2"
                placeholder="Enter your health issue"
                className="w-full mt-1 px-3 py-2  rounded-xl shadow-sm"
              />
              {errorhealthIssue && <p className="text-red-500 text-xs">{errorhealthIssue}</p>}
            </div>

          </div>

          
      {/* FOOTER */}
      <div className="flex justify-between px-4 sm:px-6 py-3 -t bg-white rounded-b-2xl">

        <button
          onClick={handleCancelForm}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>

        <button
         
          type="submit"
          className="bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg"
        >
          Submit →
        </button>

      </div>
        </form>
      </div>


    </div>
  </div>
)}

      
       {userAppointment.length > 0 ? (

 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-20">
  <div className="w-full overflow-x-auto">

   
      <table className="w-full">

        <thead className="bg-gradient-to-r from-[#00304e] to-[#005f73] text-white">
          <tr>
            <th className="px-3 py-3 text-center">Department</th>
            <th className="px-3 py-3 text-center">Appointment Date</th>
            <th className="px-3 py-3 text-center">Time</th>
            <th className="px-3 py-3 text-center">Health issue</th>
           
          </tr>
        </thead>

        <tbody>
         {userAppointment.map((item)=>(
            
            <tr key={item._id}
            className="border-t hover:bg-gray-50">
             
              <td className="px-3 py-3 text-center">
                {item.department?.department}
              </td>

              <td className="px-3 py-3 text-center">
                {item.appDate.substring(0,10)}
              </td>

              <td className="px-3 py-3 text-center">
                {item.time}
              </td>

              <td className="px-3 py-3 text-center">
               {item.healthIssue}
              </td>

              

            </tr>
            ))
}
        </tbody>

      </table>
 </div>
 </div>
    ) : (

      <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold text-[#00304e]">
          No Appointments Found
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          You haven’t booked any appointments yet.
        </p>
      </div>

    )}

 

          </div>

       
  );
}

export default Appointment;
