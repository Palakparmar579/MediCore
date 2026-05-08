import React from "react";
import { useState, useEffect } from "react";
import { FaUser, FaPhone } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../Config/Axios";

function Appointment() {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [errormobNumber, setmobNumberError] = useState("");
  const [errorgender, setgenderError] = useState("");
  const [erroraddress, setaddressError] = useState("");
  const [errordob, setdobError] = useState("");
  const [errordoctor, setdoctorError] = useState("");
  const [errordepartment, setdepartmentError] = useState("");
  const [errorappDate, setappDateError] = useState("");
  const [errortime, settimeError] = useState("");
  const [errorhealthIssue, sethealthIssueError] = useState("");
  const [getAppointment, setgetAppointment] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userAppointment, setUserappointment] = useState([]);
  const [userData, setUserData] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
 const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  console.log("selected Doctor", selectedDoctor)

  const [doctors, setDoctors] = useState([]);
  const [assignedDepartment, setAssignedDepartment] = useState([]);
  //Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
 const [prescriptionAppointment,setPrescriptionAppointment]=useState(null)
  const [age, setAge] = useState("");
 const [showViewForm,setShowViewForm]=useState(false)
  const [formData, setformData] = useState({
    firstName: "",
    mobNumber: "",
    gender: "",
    address: "",
    dob: "",
    age: "",
    email: "",
    department: "",
    doctor: "",
    appDate: "",
    time: "",
    healthIssue: "",
  });


 
  useEffect(() => {
    fetchAppointments();
    fetchPaginationAppointment(page);
    fetchUser();
  }, [page]);

  useEffect(() => {
    fetchAssignDepartment();
  }, []);

  const fetchAssignDepartment = async () => {
    try {
      const res = await api.get("/api/assignment/getAssignment");
      setAssignedDepartment(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Department not fetch!");
    }
  };
  console.log("ASSIGNED DEPARTMENT", assignedDepartment);

  // Get doctors with alloted rooms ------------------------------

  useEffect(() => {
    if (!formData.department) return;

    const fetchDoctors = async () => {
      try {
        const res = await api.get(
          `/api/appointmentPatient/getAllocatedDoctorsByDepartment/${formData.department}`,
        );

        setDoctors(res.data.doctors);
      } catch (error) {
        toast.error("Failed to fetch doctors");
      }
    };
   
    fetchDoctors();
  }, [formData.department]);

  console.log("Doctors", doctors);

  useEffect(() => {
    if (!formData.appDate || !formData.department) return;
    const fetchBookedSlots = async () => {
      const res = await api.get(
        `/api/appointmentPatient/getBookedSlot?date=${formData.appDate}&department=${formData.department}`,
      );
      setBookedSlots(res.data.bookedSlots);
    };
    fetchBookedSlots();
  }, [formData.appDate, formData.department]);

  const generateSlots = () => {
    const slots = [
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "11:30 AM - 12:00 PM",
      "12:00 PM - 12:30 PM",
      "12:30 PM - 1:00 PM",
      "2:30 PM - 3:00 PM",
      "3:00 PM - 3:30 PM",
      "3:30 PM - 4:00 PM",
      "4:00 PM - 4:30 PM",
      "4:30 PM - 5:00 PM",
    ];

    const now = new Date();
    const todayStr = formatDate(new Date());
    if (formData.appDate !== todayStr) return slots;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return slots.filter((slot) => {
      const startTime = slot.split(" - ")[0];
      const [time, modifier] = startTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes > currentMinutes;
    });
  };

  const isTodaySlotAvailable = () => {
    const todayStr = formatDate(new Date());
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const slots = [
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "11:30 AM - 12:00 PM",
      "12:00 PM - 12:30 PM",
      "12:30 PM - 1:00 PM",
      "2:30 PM - 3:00 PM",
      "3:00 PM - 3:30 PM",
      "3:30 PM - 4:00 PM",
      "4:00 PM - 4:30 PM",
      "4:30 PM - 5:00 PM",
    ];
    return slots.some((slot) => {
      const startTime = slot.split(" - ")[0];
      const [time, modifier] = startTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes > currentMinutes;
    });
  };

  const getMinDate = () => {
    if (isTodaySlotAvailable()) {
      return formatDate(today);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      return formatDate(tomorrow);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/auth/getMyProfile");
      setUserData(response.data.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/api/appointmentPatient/getAppointment");
      setgetAppointment(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setformData((prev) => ({ ...prev, department: value, doctor: "" }));
    } else {
      setformData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "dob") {
      const today = new Date();
      const birthDate = new Date(value);

      const diffTime = today - birthDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let ageText = "";

      if (diffDays < 30) {
        ageText = `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        ageText = `${months} month${months > 1 ? "s" : ""}`;
      } else {
        const years = Math.floor(diffDays / 365);
        ageText = `${years} year${years > 1 ? "s" : ""}`;
      }

      setAge(ageText);
    }

    setdobError("");
    settimeError("");
    setdepartmentError("");
    setgenderError("");
    setaddressError("");
    setappDateError("");
    setmobNumberError("");
    setdoctorError("");
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDate = yesterday.toISOString().split("T")[0];

  const fetchPaginationAppointment = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/appointmentPatient/pagination?page=${pageNumber}&limit=${limit}`,
      );
      setUserappointment(response.data.data);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  console.log(userAppointment, "PAgination get api");

  const handleSumbit = async (e) => {
    e.preventDefault();
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.mobNumber) return setmobNumberError("Number is required!");
    if (!mobileRegex.test(formData.mobNumber))
      return setmobNumberError("Mobile no. must be exactly 10 digits!");
    if (!formData.address) return setaddressError("Address is required!");
    if (!formData.dob) return setdobError("DOB is required!");
    if (!formData.gender) return setgenderError("Select gender!");
    if (!formData.department) return setdepartmentError("Select Department!");
    if (!formData.doctor) return setdoctorError("Select doctor!");
    if (!formData.appDate) return setappDateError("Date is required!");
    if (!formData.time) return settimeError("Time is required!");
    if (!formData.healthIssue)
      return sethealthIssueError("HealthIssue is required!");

   const isSlotTaken = getAppointment.some(
  (item) =>
    item.appDate?.substring(0, 10) === formData.appDate &&
    item.time === formData.time &&
    item.department?._id === formData.department
);
    if (isSlotTaken) {
      return toast.error(
        `Time slot "${formData.time}" on ${formData.appDate} is already booked.`,
      );
    }

    try {
      await api.post("/api/appointmentPatient/register", {
        firstName: userData?.name,
        mobNumber: formData.mobNumber,
        gender: formData.gender,
        address: formData.address,
        dob: formData.dob,
        age: age,
        email: userData?.email,
        department: formData.department,
        doctor: formData.doctor,
        roomNum: selectedDoctor?.room,
        appDate: formData.appDate,
        time: formData.time,
        healthIssue: formData.healthIssue,
      });

      setformData({
        mobNumber: "",
        gender: "",
        address: "",
        dob: "",
        department: "",
        doctor: "",
        appDate: "",
        time: "",
        healthIssue: "",
      });
      await fetchAppointments();
      await fetchPaginationAppointment(page);
      toast.success("Appointment booked successfully!!");
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleAddForm = () => {
    setAge("");
    setSelectedDoctor(null);
    setShowForm(true);
    setmobNumberError("");
    setgenderError("");
    setaddressError("");
    setdobError("");
    setdepartmentError("");
    setdoctorError("");
    setappDateError("");
    settimeError("");
    sethealthIssueError("");
    setformData({
      mobNumber: "",
      gender: "",
      address: "",
      dob: "",
      department: "",
      doctor: "",
      appDate: "",
      time: "",
      healthIssue: "",
    });
  };


  const handleView=(item)=>{
    setShowViewForm(true)
     setSelectedAppointment(item); 
     setPrescriptionAppointment(null);
    fetchPrescriptionAppointment(item._id)
  }
  

 const fetchPrescriptionAppointment = async (id) => {
    try {
      const response = await api.get(
        `/api/doctorAppointment/getAppointmentDetail/${id}`,
      );
      setPrescriptionAppointment(response.data.data);
     
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

console.log(prescriptionAppointment,"ttttttttttttttttt")



  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-7 gap-4">
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
          className="cursor-pointer bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg shadow"
        >
          Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-1000 overflow-y-auto">
          <div className="bg-white w-[95%] sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[45%] max-h-[95vh] flex flex-col rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-[#00304e] to-[#005f73] rounded-t-2xl">
              <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
                Book Appointment
              </h3>
              <p
                onClick={() => setShowForm(false)}
                className="cursor-pointer text-white text-2xl hover:text-gray-300"
              >
                &times;
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5 bg-gray-50">
              <form onSubmit={handleSumbit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      readOnly
                      name="email"
                      value={userData?.email}
                      type="email"
                      className="w-full mt-1 px-3 py-2 text-gray-400 cursor-not-allowed rounded-xl shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      First Name
                    </label>
                    <div className="relative mt-1">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        readOnly
                        name="firstName"
                        value={userData?.name}
                        type="text"
                        className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-400 cursor-not-allowed rounded-xl shadow-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        onChange={handleChange}
                        name="mobNumber"
                        value={formData.mobNumber}
                        type="number"
                        placeholder="Mobile"
                        className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl shadow-sm"
                      />
                    </div>
                    {errormobNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errormobNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      onChange={handleChange}
                      name="gender"
                      value={formData.gender}
                      className="w-full mt-1 py-2.5 px-3 text-sm rounded-xl shadow-sm"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                    {errorgender && (
                      <p className="text-red-500 text-xs">{errorgender}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter your address"
                      onChange={handleChange}
                      name="address"
                      value={formData.address}
                      rows="2"
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                    />
                    {erroraddress && (
                      <p className="text-red-500 text-xs">{erroraddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      DOB <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={maxDate}
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                    />
                    {errordob && (
                      <p className="text-red-500 text-xs">{errordob}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={age}
                      readOnly
                      placeholder="Age calculated automatically"
                      className="w-full mt-1 px-3 py-2 text-gray-400 cursor-not-allowed rounded-xl shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <h4 className="font-semibold text-[#00304e]">
                      Appointment Details
                    </h4>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      onChange={handleChange}
                      name="department"
                      value={formData.department}
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                    >
                      <option value="">Select Department</option>

                      {assignedDepartment.map((item) => (
                        <option key={item._id} value={item.department._id}>
                          {item.department.department}
                        </option>
                      ))}
                    </select>
                    {errordepartment && (
                      <p className="text-red-500 text-xs">{errordepartment}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Doctor<span className="text-red-500">*</span>
                    </label>

                    <select
                      onChange={(e) => {
                        handleChange(e);

                        const doc = doctors.find(
                          (d) => d._id === e.target.value,
                        );
                        setSelectedDoctor(doc);
                      }}
                      name="doctor"
                      value={formData.doctor}
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                      disabled={!formData.department}
                    >
                      <option value="">Select Doctor</option>

                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>

                    {errordoctor && (
                      <p className="text-red-500 text-xs">{errordoctor}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Room No.
                    </label>
                    <input
                      placeholder={
                        formData.doctor
                          ? "Room not assigned"
                          : "Select doctor first"
                      }
                      readOnly
                      name="roomNum"
                      value={selectedDoctor?.room || ""}
                      type="number"
                      className="w-full mt-1 px-3 py-2 text-gray-400 cursor-not-allowed rounded-xl shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="appDate"
                      value={formData.appDate}
                      onChange={handleChange}
                      min={getMinDate()}
                      max={formatDate(nextMonth)}
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                    />
                    {errorappDate && (
                      <p className="text-red-500 text-xs">{errorappDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      onChange={handleChange}
                      name="time"
                      value={formData.time}
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                    >
                      <option value="">Select Time</option>
                      {generateSlots().map((slot, index) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <option
                            key={index}
                            value={slot}
                            disabled={isBooked}
                            style={{ color: isBooked ? "#999" : "#000" }}
                          >
                            {slot} {isBooked ? "(Booked)" : ""}
                          </option>
                        );
                      })}
                    </select>
                    {errortime && (
                      <p className="text-red-500 text-xs">{errortime}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Health Issue <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      onChange={handleChange}
                      name="healthIssue"
                      value={formData.healthIssue}
                      rows="2"
                      placeholder="Enter your health issue"
                      className="w-full mt-1 px-3 py-2 rounded-xl shadow-sm"
                    />
                    {errorhealthIssue && (
                      <p className="text-red-500 text-xs">{errorhealthIssue}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between px-4 sm:px-6 py-3 rounded-b-2xl">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setAge("");
                      setSelectedDoctor(null);
                    }}
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
       <div className="bg-white rounded-2xl shadow-lg border mt-15 border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-[#00304e] to-[#005f73] text-white">
              <tr>
                <th className="px-3 py-3 text-center">Department</th>
                <th className="px-3 py-3 text-center">Doctor</th>
                <th className="px-3 py-3 text-center">Room No.</th>
                <th className="px-3 py-3 text-center">Date</th>
                <th className="px-3 py-3 text-center">Time</th>
                <th className="px-3 py-3 text-center">Health Issue</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {userAppointment.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 text-center">{item.department?.department}</td>
                  <td className="px-3 py-3 text-center">{item.doctor?.name}</td>
                  <td className="px-3 py-3 text-center">{item.roomNum}</td>
                  <td className="px-3 py-3 text-center">{item.appDate.substring(0, 10)}</td>
                  <td className="px-3 py-3 text-center">{item.time}</td>
                  <td className="px-3 py-3 text-center">{item.healthIssue}</td>

                <td className="px-3 py-3 text-center">
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
      ${
        item.bookingStatus === "accepted"
          ? "bg-green-100 text-green-700"
          : item.bookingStatus === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }
    `}
  >
    {item.bookingStatus}
  </span>
</td>
          <td className="px-3 py-3 text-center">
            <button 
           onClick={()=>handleView(item)}
            className="text-xs cursor-pointer border border-[#005f73] text-[#005f73] px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
              View Details
            </button>
          </td>
                </tr>
              ))}
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
            You haven't booked any appointments yet.
          </p>
        </div>
      )}

{showViewForm && selectedAppointment &&  (<>
{selectedAppointment.bookingStatus==="accepted" && (
  
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-1999 flex items-center justify-center px-4">
  <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

  
    <div className="bg-gradient-to-r from-[#00304e] to-[#005f73] px-4 py-3 flex items-center justify-between">
      <h2 className="text-white font-medium text-sm">Appointment Details</h2>
      <button
      onClick={()=>setShowViewForm(false)}
      className="text-white/60 cursor-pointer hover:text-white text-lg leading-none">×</button>
    </div>

    <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">

    
     
 <div className="grid grid-cols-2 gap-2">
         
          
          <div  className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Doctor</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{prescriptionAppointment?.doctor?.name}</p>
          </div>

          <div  className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Department</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{prescriptionAppointment?.department?.department}</p>
          </div>

          <div  className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Date</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{prescriptionAppointment?.appDate.substring(0,10)}</p>
          </div>

          <div  className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Time</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{prescriptionAppointment?.time}</p>
          </div>

          <div  className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Room</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{prescriptionAppointment?.roomNum}</p>
          </div>

          <div  className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Health Issue</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{prescriptionAppointment?.healthIssue}</p>
          </div>
         
       
      </div>

      {/* Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-center">
        <span className="text-xs font-medium text-green-700">Booking Accepted</span>
      </div>

      {/* Doctor's Note */}
      <div className="bg-gray-50 rounded-xl px-3 py-2.5">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Doctor's Note</p>
        <p className="text-xs text-gray-700">Patient showing improvement. Continue medication.</p>
      </div>

      {/* Prescription */}
     <div>
  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">
    Prescription
  </p>

  <div className="space-y-1.5">
    {prescriptionAppointment?.medicines?.map((med, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
      >
        <span className="text-xs font-medium text-gray-800">
          {med.name}
        </span>
        <span className="text-[11px] text-gray-400">
          {med.dosage}
        </span>
      </div>
    ))}
  </div>
</div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
        <p className="text-[10px] text-blue-400 uppercase tracking-wide mb-1">Follow-up</p>
        <p className="text-xs text-blue-700">{prescriptionAppointment?.followUp}</p>
      </div>

      {/* Close */}
      <button
       onClick={()=>setShowViewForm(false)}
      className="w-full py-2 cursor-pointer rounded-xl bg-[#00304e] text-white text-xs font-medium hover:bg-[#005f73] transition-colors">
        Close
      </button>

    </div>
  </div>
</div>
)}

    
{selectedAppointment.bookingStatus==="rejected" &&(
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-1999 flex items-center justify-center px-4">
    
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#00304e] to-[#005f73] px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-medium text-sm">
          Appointment Details
        </h2>
        <button
          onClick={() => setShowViewForm(false)}
          className="text-white/70 hover:text-white text-lg"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">

        {/* Label */}
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">
          Booking Info
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Doctor</p>
            <p className="font-medium text-gray-800">{prescriptionAppointment?.doctor?.name}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Date</p>
            <p className="font-medium text-gray-800">{prescriptionAppointment?.appDate.substring(0, 10)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Time</p>
            <p className="font-medium text-gray-800">{prescriptionAppointment?.time}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Status</p>
            <p className="font-medium text-red-600">Rejected</p>
          </div>

          <div className="col-span-2 bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Doctor's Note</p>
            <p className="font-medium text-gray-800">
              Slot unavailable
            </p>
          </div>

        </div>

        {/* Warning Box */}
        <div className="bg-red-100 text-red-700 text-xs p-3 rounded-xl">
          This appointment was not confirmed. Please rebook or contact the hospital for assistance.
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowViewForm(false)}
          className="w-full py-2 rounded-xl bg-[#00304e] text-white text-xs font-medium hover:bg-[#005f73]"
        >
          Close
        </button>

      </div>
    </div>
  </div>
)}



  {selectedAppointment.bookingStatus==="pending" && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-1999 flex items-center justify-center px-4">
    
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#00304e] to-[#005f73] px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-medium text-sm">
          Appointment Details
        </h2>
        <button
          onClick={() => setShowViewForm(false)}
          className="text-white/70 hover:text-white text-lg"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">

        {/* Booking Info Label */}
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">
          Booking Info
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Doctor</p>
            <p className="font-medium text-gray-800">{prescriptionAppointment?.doctor?.name}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Date</p>
            <p className="font-medium text-gray-800">{prescriptionAppointment?.appDate.substring(0,10)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Time</p>
            <p className="font-medium text-gray-800">{prescriptionAppointment?.time}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Status</p>
            <p className="font-medium text-gray-800">Pending</p>
          </div>

          <div className="col-span-2 bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400">Doctor's Note</p>
            <p className="font-medium text-gray-800">—</p>
          </div>

        </div>

        {/* Info Box */}
        <div className="bg-yellow-100 text-yellow-800 text-xs p-3 rounded-xl">
          Awaiting doctor confirmation. You’ll be notified once the appointment is accepted.
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowViewForm(false)}
          className="w-full py-2 rounded-xl bg-[#00304e] text-white text-xs font-medium hover:bg-[#005f73]"
        >
          Close
        </button>

      </div>
    </div>
  </div>
)}
</>
)}

     </div>
  );
}

export default Appointment;
