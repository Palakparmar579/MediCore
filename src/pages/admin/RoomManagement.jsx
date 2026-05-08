import React, { useState,useEffect } from "react";
import { FaUserMd, FaUsers,FaEdit } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { GiNurseFemale } from "react-icons/gi";
import CustomToolTip from "../../component/CommonPages/CustomToolTip";
import DashboardCard from "../../component/CommonPages/DashboardCard";
import { FaBed } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoBuild } from "react-icons/io5";
import api from "../../Config/Axios";
import { HiOutlineSearch } from "react-icons/hi";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import {toast} from 'react-hot-toast'
import ConfirmationPopup from '../../component/CommonPages/ConfirmationPopup'

function RoomManagement() {
  const [showForm, setShowForm] = useState(false);
  const [loading,setLoading]=useState(false)
  const [errors, setErrors] = useState({});
  const [roomDetail,setRoomDetail]=useState([])
  const [editId,setEditId]=useState(null)

 
const [formData,setFormData]=useState({
  roomNum:"",
 
  floor:""
})

// Stats   

 const [stats, setStats] = useState({
     totalRooms:0,
      floor:0,
      available:0,
      allocated:0
  });


 // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [activeRole, setActiveRole] = useState("all");
  const [search, setSearch] = useState("");
  const limit = 3;


useEffect(() => {
    const delay = setTimeout(() => {
      fetchRoomsDetail(page);
     
    }, 300);

    return () => clearTimeout(delay);
    
  }, [page, search]);

useEffect(()=>{
  fetchStats();
},[])

 

  


  const fetchStats=async()=>{
    try{
      const response=await api.get("/api/room/roomStats")
       setStats(response.data);
    }
    catch(error){
     toast.error(error?.response?.data?.message||"Something went wrong!")
    }
  }

  const totalRoomsCount = stats.totalRooms;
  const availableCount = stats.available;
  const allocatedCount = stats.allocated;
 
  const handleChange=(e)=>{
  const {name,value}=e.target;
  setFormData({
    ...formData,[name]:value}
  )

   setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
}

const fetchRoomsDetail=async(pageNumber = page)=>{
  try{
  const response = await api.get(
        `/api/room/pagination?page=${pageNumber}&limit=${limit}&search=${search}`
      );
      setRoomDetail(response.data.data)
      setPage(response.data.page);
      settotalPages(response.data.totalPages);
  }
  catch(error){
   toast.error(error?.response?.data?.message||"Something went wrong")
  }
}

const handleEdit = (item) => {
    console.log(item);
    setShowForm(true);
    setEditId(item._id);
    setFormData({
      roomNum: item.roomNum,
     
      floor: item.floor,
    });
  };

const handleSubmit=async(e)=>{
  e.preventDefault()
   const newErrors={}

 
  if (!formData.roomNum.trim()) {
    newErrors.roomNum = "Room number is required";
  } else if (!/^[0-9]+$/.test(formData.roomNum)) {
    newErrors.roomNum = "Room number must be numeric";
  }else if(formData.roomNum.length!==3){
    newErrors.roomNum="Room number must be exactly 3 digits"
  }

  
 
  
  if (!formData.floor) {
    newErrors.floor = "Please select floor";
  }

  setErrors(newErrors);

 
  if (Object.keys(newErrors).length > 0) return;

   try {
     
      let response;
      if (editId) {
        setLoading(true);
        response = await api.put(
          `/api/room/roomManagementEdit${editId}`,
          { roomNum: formData.roomNum, floor:formData.floor}
         
        );
        toast.success("Room updated successfully");
      } else {
        setLoading(true);
        response = await api.post(
          "/api/room/roomManagement",
          { roomNum: formData.roomNum, floor:formData.floor}
        
        );
        toast.success("Room added successfully!");
      }
      fetchStats();
      fetchRoomsDetail(page, activeRole, search);
      setFormData({ roomNum: "",floor: ""});
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

}

const handleAdd=()=>{
  setShowForm(true) 
  setFormData({ roomNum: "", floor: ""});
}
  const cards = [
  {
    title: "Total Rooms",
    count: totalRoomsCount,
    icon: <FaBed className="text-green-500 text-xl" />,
  },
  {
    title: "Total Floor",
    count: 4,
    icon: <MdMeetingRoom className="text-sky-400 text-xl" />,
  },
  {
    title: "Total Available",
    count: availableCount,
    icon: <BsCheckCircleFill className="text-emerald-500 text-xl" />,
  },
  {
    title: "Total Allocations",
    count: allocatedCount,
    icon: <IoBuild className="text-orange-400 text-xl" />,
  },
];

  return (
    <div className="min-h-screen">

   

      <main className="p-4 md:p-8">

       
        <div className="flex flex-col sm:flex-row md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Room Management</h2>
            <p className="text-sm text-slate-500">
              Manage hospital rooms and allocations
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="w-[150px] cursor-pointer bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg text-sm md:w-[150px] sm:w-[150px] font-medium hover:scale-105 transition"
          >
            + Add Room
          </button>
        </div>

      
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {cards.map((card, i) => (
            <DashboardCard
              key={i}
              title={card.title}
              count={card.count}
              icon={card.icon}
            />
          ))}
        </div>

      

  <div className=" relative mb-6 w-full md:w-65 sm:w-60 ">
    <span className="absolute left-3 top-1/2 -translate-y-1/2">
      <HiOutlineSearch/>
    </span>

    <input
      placeholder="Search rooms..."
      type="text"
          
                value={search}
                onChange={(e) => setSearch(e.target.value)}

      className="w-full  pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 
      focus:outline-none focus:ring-2 focus:ring-[#005f73]/30 focus:border-[#005f73] 
      transition text-sm"
    />
  </div>

  
  
  
       
     <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-4 sm:mt-5 md:mt-6">

  {roomDetail.length === 0 ? (
    <div className="col-span-full flex flex-col items-center justify-center py-10 sm:py-14 text-center">
      <p className="text-gray-500 text-sm">
        No rooms available yet.
      </p>
    </div>
  ) : (
    roomDetail.map((item) => (
      <div
        key={item._id}
        className="relative group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden w-full"
      >
       
        <div className="absolute inset-0 bg-gradient-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500"></div>

      
        <div className="absolute left-0 top-0 h-full w-[3px] bg-[#00304e] group-hover:w-[6px] transition-all duration-300"></div>

        <div className="p-4 sm:p-5 relative z-10">

        
          <div className="flex justify-between items-start">
            <h2 className="text-base sm:text-lg font-bold text-[#00304e] group-hover:text-black transition pr-2 break-words">
              Room {item.roomNum}
            </h2>

         
          </div>

        
          <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase">
            Floor: {item.floor}
          </p>

        
          <div className="w-full h-[1px] bg-gray-200 my-3"></div>

       
        
          {/* Footer */}
          <div className="flex justify-between items-center">

            {/* Status */}
            <CustomToolTip text="status">
            <span
  className={`text-xs px-3 py-2 rounded-full font-medium
    ${
      item.status === "Available"
        ? "bg-green-100 text-green-600"
        : "bg-blue-100 text-blue-600"
    }`}
>
  {item.status}
</span>
             </CustomToolTip>
             
           
             <CustomToolTip text="Edit">
            <button
              onClick={() => handleEdit(item)}
              className="cursor-pointer p-1 px-2 rounded-lg bg-gray-100 text-[#00304e] hover:bg-[#00304e] hover:text-white transition-all duration-300 shadow hover:scale-110"
            >

           
              <FaEdit size={13} />


            </button>
          </CustomToolTip>
          </div>
        </div>

        {/* Border hover */}
        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#00304e]/20 transition pointer-events-none"></div>
      </div>
    ))
  )}

</div>
      </main>

    
      {showForm && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[1999]">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-auto">

     
      <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#00304e] to-[#005f73] rounded-t-2xl">
        <h3 className="text-white font-semibold text-sm md:text-base">
         {editId?"Edit Room Details":"Add Room Details"} 
        </h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-white text-2xl hover:text-gray-300"
        >
          &times;
        </button>
      </div>

    
      <div className="p-5">
        <form 
        onSubmit={handleSubmit} id="role-form"
        className="grid grid-cols-1  gap-4">

         
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Room Number <span className="text-red-500">*</span>
            </label>
            <input
            onChange={handleChange}
            name="roomNum"
            value={formData.roomNum}
              placeholder="eg.201"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm 
              focus:ring-2 focus:ring-[#005f73]/30 focus:border-[#005f73] outline-none bg-white"
            />
          </div>
          {errors.roomNum && (
  <p className="text-red-500 text-xs mt-1">{errors.roomNum}</p>
)}

        
        
         

          {/* Floor */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Floor
            </label>
            <select
            onChange={handleChange}
            name="floor"
            value={formData.floor}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm 
            focus:ring-2 focus:ring-[#005f73]/30 focus:border-[#005f73] bg-white">
              <option>Select floor</option>
              <option>Ground</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
            </select>
          </div>
          {errors.floor && (
  <p className="text-red-500 text-xs mt-1">{errors.floor}</p>
)}
        </form>
      </div>

      
      <div className="flex justify-between items-center px-5 py-4 bg-white  rounded-b-2xl">

        <button
          onClick={() => setShowForm(false)}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cancel
        </button>

        <button 
         form="role-form"
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg hover:scale-105 transition">
          
          {loading?(
<span className="flex items-center justify-center gap-2">
                      <MiniLoader />
                      {editId ? "Updating" : "Saving"}
                    </span>
                  ) : (
                    editId ? "Update" : "Save Room →"
                  )
        }
          
        </button>

      </div>

    </div>
  </div>
)}

  {totalPages > 1 && roomDetail.length > 0 && (
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 sm:gap-2 mt-4 pb-4 text-xs">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className=" cursor-pointer px-2 sm:px-3 py-1 rounded-md border text-gray-600 hover:bg-[#00455c] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pre
          </button>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={` cursor-pointer w-6 h-6 flex items-center justify-center rounded text-[11px] border transition
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
            className=" cursor-pointer px-2 sm:px-3 py-1 rounded-md border text-gray-600 hover:bg-[#00455c] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}


    </div>
  );
}

export default RoomManagement;