import React, { useEffect, useState } from "react";
import { FaEdit, FaUserMd } from "react-icons/fa";
import { GiNurseFemale } from "react-icons/gi";
import { MdMeetingRoom } from "react-icons/md";
import api from "../../Config/Axios";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import { toast } from "react-hot-toast";
import { HiOutlineSearch } from "react-icons/hi";

import CustomToolTip from "../../component/CommonPages/CustomToolTip";
function RoomAllocation() {
  const [showForm, setShowForm] = useState(false);
  const [assignDeptsDetail, setAssignDeptsDetail] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [departmentDetail, setDepartmentDetail] = useState(null);
  const [allRoomsDetail, setAllRoomsDetail] = useState([]);
  const [singleRoomDetail, setSingleRoomDetail] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [errors,setErrors]=useState({})
  const [assignRoomDetail,setAssignRoomDetail]=useState([])
  const [assignment,setAssignment]=useState([])
  const [editId,setEditId]=useState(null)
  const [loading,setLoading]=useState(false)


  // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, settotalPages] = useState(1);
    const [activeRole, setActiveRole] = useState("all");
    const limit = 8;

  const [formData, setFormData] = useState({
    roomId: "",
    departmentId: "",
    doctorId: "",
    nurseId: "",
  });

  useEffect(() => {
    if (selectedDeptId) {
      fetchAssignDepts(selectedDeptId);
    }
  }, [selectedDeptId]);

  useEffect(() => {
    if (selectedRoomId) {
      fetchSingleRoomData(selectedRoomId);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    fetchAllDepts();
    fetchAllRoomsData();
    fetchAllocation()
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchAllDepts = async (id) => {
    try {
      const response = await api.get("/api/room/getDept");
      console.log("ALL DEPTS:", response.data);
      setAssignDeptsDetail(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Someting went wrong");
    }
  };

  const fetchAssignDepts = async (id) => {
    try {
      const response = await api.get(`/api/room/getDeptById/${id}`);
      setDepartmentDetail(response.data);
      console.log("DEPARTMNT DATA:", response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Someting went wrong");
    }
  };

  console.log("SELECTED ID:", selectedDeptId);
  const fetchDeptData = async (id) => {
    try {
      const response = await api.get("/api/room/getDept");
      setDepartmentDetail(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Someting went wrong");
    }
  };

  // Fetch ALL rooms
  const fetchAllRoomsData = async () => {
    try {
      const response = await api.get("/api/room/roomAll");
      setAllRoomsDetail(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Someting went wrong");
    }
  };
  console.log("All Rooms", allRoomsDetail);

  // Fetch SIngle Room data
  const fetchSingleRoomData = async (id) => {
    try {
      const response = await api.get(`/api/room/roomSingle/${id}`);
      setSingleRoomDetail(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Someting went wrong");
    }
  };
  console.log("Single Rooms", singleRoomDetail);

  const handleCancel = () => {
    setShowForm(false);
  };

        
const handleCross = () => {
    setShowForm(false);
  };

const handleEdit = (item) => {
    console.log(item);
    setShowForm(true);
    setEditId(item._id);
     setFormData({
    roomId: item.room._id,
    departmentId: item.department._id,
    doctorId: item.doctor?._id || "",
    nurseId: item.nurse?._id || "",
  });

 
  setSelectedDeptId(item.department._id);  
    setSelectedRoomId(item.room._id); 
    fetchAssignDepts(item.department._id);
    fetchSingleRoomData(item.room._id);  
  };


  
const handleAssign = (e) => {
    e.preventDefault();
    setShowForm(true);
    setEditId(null);           
    setSingleRoomDetail(null); 
    setDepartmentDetail(null); 
    setSelectedDeptId("");
    setSelectedRoomId("");
    setFormData({
      roomId: "",
      departmentId: "",
      doctorId: "",
      nurseId: "",
    });
};
 console.log(formData,"formData")
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const newErrors={}


  if (!formData.roomId) {
    newErrors.roomId = "Room is required";
  }

  
  if (!singleRoomDetail?.floor) {
    newErrors.floor = "Floor is required";
  }

  if (!formData.departmentId) {
    newErrors.departmentId = "Department is required";
  }

  if (!formData.doctorId) {
    newErrors.doctorId = "Doctor is required";
  }

  if (!formData.nurseId) {
    newErrors.nurseId = "Nurse is required";
  }

  setErrors(newErrors);

   if (Object.keys(newErrors).length > 0) return;
 try{
  let response;
if(editId){
     setLoading(true);
        response = await api.put(
          `/api/room/roomAssignmentEdit/${editId}`,
  { roomId: formData.roomId, departmentId: formData.departmentId, doctorId:formData.doctorId,nurseId:formData.nurseId})
        
        toast.success("Room updated successfully");
         setShowForm(false);    
    setEditId(null);          
    fetchAllocation();        
    setSingleRoomDetail(null); 
    setDepartmentDetail(null);
    setSelectedDeptId("");
    setSelectedRoomId("");
    fetchAllRoomsData();
}
else{
      setLoading(true);
     response=await api.post("/api/room/assignRoom",
  { roomId: formData.roomId, departmentId: formData.departmentId, doctorId:formData.doctorId,nurseId:formData.nurseId})
  toast.success(response?.data?.message || "Room Assigned Successfully");
   setFormData({
    roomId: "",
    departmentId: "",
    doctorId: "",
    nurseId: "",
  });
  setSelectedDeptId("");
  setSelectedRoomId("");
  setSingleRoomDetail(null);
  setDepartmentDetail(null);
  setShowForm(false);
    fetchAllocation();
    fetchAllRoomsData();
   }
  }
   catch(error){
   toast.error(
    error?.response?.data?.message || "Something went wrong"
  );
   }
   finally {
      setLoading(false);
    }

  
  }


  // Get Assignment
  const fetchAllocation = async (pageNumber = page) => {
    try {
      const response = await api.get( `/api/room/paginationAllocation?page=${pageNumber}&limit=${limit}`);
      setAssignment(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Someting went wrong");
    }
  };
  console.log("ASSIGNMENT", assignment);



 

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-5 mb-13">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Room Allocation</h2>
          <p className="text-sm text-slate-500">
            Assign rooms to doctors and nurses efficiently
          </p>
        </div>

        <button
          onClick={handleAssign}
          className="cursor-pointer w-[150px]  md:w-[150px] sm:w-[150px] bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Assign Room
        </button>
      </div>

   


     

<div className="w-full overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
  <table className="min-w-[700px] w-full text-sm text-left">

    <thead className="bg-gradient-to-r from-[#00304e] to-[#005f73] text-white text-[10px] md:text-xs uppercase tracking-wider">
      <tr>
    <th className="px-3 py-2 text-center whitespace-nowrap text-xs sm:text-sm">S.No</th>

        <th className="px-3 py-2 md:px-4 md:py-3">Room</th>  
        <th className="px-3 py-2 md:px-4 md:py-3 hidden sm:table-cell">Department</th>
        <th className="px-3 py-2 md:px-4 md:py-3">Doctor</th>
        <th className="px-3 py-2 md:px-4 md:py-3">Nurse</th>
        <th className="px-3 py-2 md:px-4 md:py-3">Status</th>
        <th className="px-3 py-2 md:px-4 md:py-3 text-center">Action</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {assignment.length === 0 ? (
        <tr>
          <td colSpan="7" className="text-center py-6 md:py-10">
            <p className="text-gray-600 font-medium text-sm md:text-base">
              No allocations yet
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Click Assign Room to create your first patient room allocation.
            </p>
          </td>
        </tr>
      ) : (
        assignment.map((item,index) => (
          <tr key={item._id} className="hover:bg-gray-50 transition">
                                  <td className="px-3 py-3 text-center text-sm sm:text-sm">{index + 1}</td>

            <td className="px-3 py-2 md:px-4 md:py-3 font-semibold text-[#00304e]">
              Room {item?.room?.roomNum}
            </td>

          
            <td className="px-3 py-2 md:px-4 md:py-3 hidden sm:table-cell">
              {item?.department?.department?.department}
            </td>

            <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700">
              {item?.doctor?.name}
            </td>

            <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700">
              {item?.nurse?.name}
            </td>

            <td className="px-3 py-2 md:px-4 md:py-3">
              <span className="cursor-pointer text-[10px] px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                Allocated
              </span>
            </td>

            <td className="px-4 py-3 text-center">
              <CustomToolTip text="Edit">
                <button
                  onClick={() => handleEdit(item)}
                  className=" cursor-pointer px-3 py-1 rounded-md bg-gradient-to-r from-[#00304e] to-[#005f73] text-white text-xs hover:scale-105 transition"
                >
                  <FaEdit size={13} />
                </button>
              </CustomToolTip>
            </td>

          </tr>
        ))
      )}
    </tbody>

  </table>
</div>
     
{/*------------------------------- FORM -----------------------------------------------*/}
 

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[1999]">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ">
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#00304e] to-[#005f73] rounded-t-2xl">
              <h3 className="text-white font-semibold text-sm md:text-base">
                Assign Room
              </h3>
              <button
              onClick={handleCross}
              className="cursor-pointer text-white text-2xl hover:text-gray-300">
                &times;
              </button>
            </div>

            <div className="p-5 overflow-auto">
              <form onSubmit={handleSubmit} id="form-submit"
               className="grid grid-cols-1 gap-4 ">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Room No.
                  </label>

                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={(e) => {
                      handleChange(e);
                      setSelectedRoomId(e.target.value);
                    }}
                    className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#005f73]/30"
                  >
                    <option value="">Select Room</option>
                   {allRoomsDetail
  .filter((item) => item.status === "Available")
  .map((item) => (
    <option key={item._id} value={item._id}>
      {item.roomNum}
    </option>
))}
                  </select>
                </div>

              
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Floor
                  </label>
                  <input
                    value={singleRoomDetail?.floor || ""}
                    readOnly
                    className="border border-slate-300 text-gray-400 cursor-not-allowed rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={(e) => {
                      handleChange(e);
                      setSelectedDeptId(e.target.value);
                    }}
                    className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#005f73]/30"
                  >
                    <option value="">Select Department</option>

                    {assignDeptsDetail.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.department?.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Doctor
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Doctor</option>
                    {departmentDetail?.doctors?.map((doc) => (
                      <option key={doc._id} value={doc._id}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Nurse
                  </label>
                  <select
                    name="nurseId"
                    value={formData.nurseId}
                    onChange={handleChange}
                    className="border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Nurse</option>

                    {departmentDetail?.nurses?.map((doc) => (
                      <option key={doc._id} value={doc._id}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center px-5 py-4 bg-white rounded-b-2xl">
              <button
                onClick={handleCancel}
                className="cursor-pointer bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>

              <button
              type="submit"
              form="form-submit"
               disabled={loading}
              className="cursor-pointer bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-5 py-2 rounded-lg hover:scale-105 transition">
               
                 {loading?(
<span className="flex items-center justify-center gap-2">
                      <MiniLoader />
                      {editId ? "Updating" : "Saving"}
                    </span>
                  ) : (
                    editId ? "Update" : " Save Allocation →"
                  )
        }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomAllocation;
