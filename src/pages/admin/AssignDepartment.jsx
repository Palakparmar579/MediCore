import React, { useEffect, useState } from "react";
import { FaUserPlus,FaSitemap } from "react-icons/fa";
import { Multiselect } from "multiselect-react-dropdown";
import { toast } from "react-hot-toast";
import api from "../../Config/Axios";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import useTitle from "../../hooks/userTitle";


function AssignDepartment() {
  useTitle("Assign Department")
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [formData, setformData] = useState({
    department: "",
    deptNo: "",
    doctors: [],
    nurses: [],
  });

  
   const [errors,setErrors]=useState({})
  const [editId, setEditId] = useState(null);
  const [cardStatus ,setCardsStatus]=useState([])
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [nurAndDoc, setnurAndDoc] = useState([]);
  const [showAllDoctors, setShowAllDoctors] = useState({});
  const [assignedData, setAssignedData] = useState([]);
 const [showLoader,setShowLoader]=useState(false)
  // Pagination
  
    const [page,setPage]=useState(1);
        const [totalPages,settotalPages]=useState(1);
           const limit=3;

        

useEffect(() => {
  const delay = setTimeout(() => {
    fetchDepartment();
    fetchUsers();
    fetchAssignment(page);
  }, 300);

  return () => clearTimeout(delay);
}, [page]);


 const fetchAssignment = async (pageNumber = 1) => {
  try {
    const response = await api.get(
      `/api/assignment/pagination?page=${pageNumber}&limit=${limit}`,
    );
    
     setAssignedData(response.data.data);
    setPage(response.data.page);
    settotalPages(response.data.totalPages);
  } catch (error) {
    console.log(error);
  }
};

  const fetchDepartment = async () => {
    try {
      const response = await api.get("/api/department/getDep");
      setDepartmentData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  console.log(departmentData,"555555555555555");
  const department = departmentData.filter((item) => item.status === "active");
  


  // Get api for doctor and nusrse

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/auth/getUser");
      setnurAndDoc(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const doctor = nurAndDoc.filter((item) => item.role === "doctor");
  const nurse = nurAndDoc.filter((item) => item.role === "nurse");

  const handleselect = (e) => {
    const value = e.target.value;

    const selected = departmentData.find((item) => item._id === value);

    if (!selected) return;

    setformData((prev) => ({
      ...prev,
       department: selected._id,
  departmentName: selected.department,
      deptNo: selected.deptNum,
    }));

    setSelectedDepartment(selected);
    setErrors({})
  };

 

  const handleAssignButton = () => {
    setEditId(null);
    setShowForm(true);
    setformData({
      department: "",
      deptNo: "",
      doctors: [],
      nurses: [],
    });
    
  };

  const handleEdit = (item) => {
    setEditId(item._id);
   const matchedDept = departmentData.find(
  (dept) => dept._id === item.department?._id,
);
    

    setformData({
      department: matchedDept?._id || "",
      deptNo: item.deptNum,
      doctors: item.doctors || [],
      nurses: item.nurses || [],
    });

    setSelectedDepartment(matchedDept || {});
    setShowForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   const errors={}
    if (!formData.department) {
     errors.department="Department is required!";
    }

    if (formData.doctors.length < 3) {
      errors.doctors="Please select at least 3 doctors!";
    }

    if (formData.nurses.length < 2) {
     errors.nurses= "Please select at least 2 nurses!";
    }
 setErrors(errors);

   
    if(Object.keys(errors).length>0){
     return 
    }
   setErrors({});
    try {
      let response;
      if (editId) {
        response = await api.put(
          `/api/assignment/editAssignment/${editId}`,
          {
            department: formData.department,
            deptNum: formData.deptNo,
            doctors: formData.doctors.map((d) => d._id),
            nurses: formData.nurses.map((n) => n._id),
          },
        );
        toast.success("Department Assignment updated successfully");
      } else {
        response = await api.post(
          "/api/assignment/addAssignment",
          {
            department: formData.department,
            deptNum: formData.deptNo,
           doctors: formData.doctors.map((d) => d?._id || d),
           nurses: formData.nurses.map((n) => n?._id || n),
          },
        );
       await fetchAssignment(page);
        toast.success("Department assigned successfully");    
      }

     
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setShowForm(false);
    setformData({
      department: "",
      deptNo: "",
      doctors: [],
      nurses: [],
    });
    setEditId(null);
    setSelectedDepartment({});
  };

  console.log("DEPARTMENT DATA:", departmentData);
  const handleFormCross = () => {
    setShowForm(false);
    setErrors({})
  };

  // Filtering assigned doctor and nurses id

  const assignedDoctor=assignedData.filter((item) => item._id !== editId).flatMap((item)=>item.doctors?.map((d)=>d._id) || [])
  const assignedNurses=assignedData.filter((item) => item._id !== editId).flatMap((item)=>item.nurses?.map((n)=>n._id) || [])
  console.log(assignedDoctor)
  console.log(assignedNurses)
  const availabledoctors=nurAndDoc.filter((item)=>item.role=="doctor"&&!assignedDoctor.includes(item._id))
  const availablenurses=nurAndDoc.filter((item)=>item.role=="nurse"&&!assignedNurses.includes(item._id))

   const handleAssignDepartment=()=>{
   setShowForm(true)
  }

  return (
    <div className="w-full max-w-[1140px] min-h-screen mx-auto px-3 sm:px-5 lg:px-2">

     
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 py-4 sm:py-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
            Assign Department
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Assign the right department for better workflow.
          </p>
        </div>

        <button
          onClick={handleAssignButton}
          className="flex items-center justify-center gap-2
            bg-[#1b2b41] text-white
            px-3 py-2 text-sm
            sm:px-4 sm:py-2.5
            rounded-lg
            hover:bg-[#00455c] hover:shadow-lg hover:scale-105 cursor-pointer
            transition-all duration-300
            w-[170px] sm:w-auto sm:min-w-[130px]"
        >
          <FaUserPlus />
          Assign
        </button>
      </div>

     
     
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[1990]">
          <div className="bg-white w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[65vw] lg:max-w-[50vw] xl:max-w-[40vw] rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">

           
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#00304e] to-[#005f73] flex-shrink-0">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                {editId ? "Edit Assigned Department" : "Assign Department"}
              </h3>
              <button
                onClick={handleFormCross}
                className="cursor-pointer text-white text-2xl hover:text-gray-300 leading-none"
              >
                &times;
              </button>
            </div>

            
            
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-6 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">

                
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">
                    Department Name
                  </label>
                  <select
                    name="department"
                    onChange={handleselect}
                    value={formData.department}
                    className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#005f73]/40 outline-none"
                  >
                    <option value="">Select Department</option>
                    {department.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.department}
                      </option>
                    ))}
                  </select>
                 {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                </div>

               
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">
                    Department No
                  </label>
                  <input
                    readOnly
                    value={selectedDepartment.deptNum || ""}
                    className="text-gray-400 cursor-not-allowed w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#005f73]/40 outline-none"
                  />
                </div>

               
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Doctors <span className="text-red-500">(Min 3)</span>
                  </label>
                  <div className="mt-3">
                    <Multiselect
                      options={availabledoctors}
                      displayValue="name"
                      selectedValues={formData.doctors}
                      onSelect={(list) => {
                        setformData((prev) => ({ ...prev, doctors: list }));
                        setErrors({});
                      }}
                      onRemove={(list) => {
                        setformData((prev) => ({ ...prev, doctors: list }));
                        if (list.length >= 3)  setErrors({});
                      }}
                      placeholder="Select Doctors"
                      style={{
                        chips: {
                          background: "#cfd0d3",
                          color: "black",
                          borderRadius: "0.375rem",
                          padding: "4px 8px",
                        },
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {formData.doctors.length}
                  </p>
                  {errors.doctors && <p className="text-red-500 text-sm">{errors.doctors}</p>}
                </div>

               
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Nurses <span className="text-red-500">(Min 2)</span>
                  </label>
                  <div className="mt-3">
                    <Multiselect
                      options={availablenurses}
                      displayValue="name"
                      selectedValues={formData.nurses}
                      onSelect={(list) => {
                        setformData((prev) => ({ ...prev, nurses: list }));
                         setErrors({});
                      }}
                      onRemove={(list) => {
                        setformData((prev) => ({ ...prev, nurses: list }));
                        if (list.length >= 2)  setErrors({});
                      }}
                      placeholder="Select Nurses"
                      style={{
                        chips: {
                          background: "#cfd0d3",
                          color: "black",
                          borderRadius: "0.375rem",
                          padding: "4px 8px",
                        },
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {formData.nurses.length}
                  </p>
                 {errors.nurses && <p className="text-red-500 text-sm">{errors.nurses}</p>}
                </div>

               
                <div className="flex justify-between items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleFormCross}
                    className="bg-gradient-to-r from-[#00304e] to-[#005f73] cursor-pointer text-white px-4 py-2 sm:py-2.5 rounded-lg hover:scale-[1.02] transition shadow-md font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={showLoader}
                    className={`bg-red-600 cursor-pointer text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-400 transition text-sm
                      ${showLoader ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {showLoader ? (
                      <span className="flex items-center gap-2">
                        <MiniLoader />
                        {editId ? "Updating" : "Submitting"}
                      </span>
                    ) : (
                      editId ? "Update" : "Submit →"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

     
      {assignedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <FaSitemap className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm mb-4 max-w-xs">
            No department assigned yet. Assign a department to get started.
          </p>
          <button
            onClick={handleAssignDepartment}
            className="flex items-center justify-center gap-2
              bg-[#1b2b41] text-white
              px-4 py-2 text-sm
              sm:px-5 sm:py-2.5
              rounded-lg cursor-pointer
              hover:bg-[#00455c] hover:shadow-lg hover:scale-105
              transition-all duration-300
              w-full max-w-[160px]"
          >
            + Assign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {assignedData.map((item, index) => (
            <div
              key={index}
              className="relative group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden w-full"
            >
             
              <div className="absolute inset-0 bg-gradient-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

             
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[#00304e] group-hover:w-[6px] transition-all duration-300"></div>

              <div className="p-4 sm:p-5 lg:p-6 relative z-10">

               
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#00304e] group-hover:text-black transition leading-tight break-words">
                    {item.department?.department}
                  </h2>
                  <span
                    className={`flex-shrink-0 px-2.5 py-[3px] text-[10px] sm:text-[11px] rounded-full font-semibold
                      ${item.department?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {item.department?.status}
                  </span>
                </div>

              
                <p className="text-xs text-gray-400 mb-3 tracking-wider uppercase">
                  Dept No: {item.department?.deptNum}
                </p>

                <div className="w-full h-[1px] bg-gray-200 my-3"></div>

                
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-600 mb-1.5">
                    Doctors
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(showAllDoctors[item._id]
                      ? item.doctors
                      : item.doctors?.slice(0, 2)
                    )?.map((doc) => (
                      <span
                        key={doc._id}
                        className="bg-gray-100 text-gray-800 px-2 py-[3px] rounded-md text-xs"
                      >
                        {doc.name}
                      </span>
                    ))}
                  </div>
                  {item.doctors?.length > 2 && (
                    <div className="mt-1.5">
                      <span
                        onClick={() =>
                          setShowAllDoctors((prev) => ({
                            ...prev,
                            [item._id]: !prev[item._id],
                          }))
                        }
                        className="text-[#005f73] font-semibold text-xs cursor-pointer hover:underline"
                      >
                        {showAllDoctors[item._id]
                          ? "Show less"
                          : `+${item.doctors.length - 2} more`}
                      </span>
                    </div>
                  )}
                </div>

               
                <div className="flex flex-wrap justify-between items-end gap-3 mt-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">
                      Nurses
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.nurses?.slice(0, 2).map((nur) => (
                        <span
                          key={nur._id}
                          className="bg-gray-100 text-gray-800 px-2 py-[3px] rounded-md text-xs"
                        >
                          {nur.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (item.department?.status === "inactive") return;
                      handleEdit(item);
                    }}
                    disabled={item.department?.status === "inactive"}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition-all
                      ${item.department?.status === "inactive"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#00304e] to-[#005f73] text-white hover:scale-105 cursor-pointer"
                      }`}
                  >
                    Edit
                  </button>
                </div>
              </div>

             
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#00304e]/20 transition pointer-events-none"></div>
            </div>
          ))}

        
          {totalPages > 1 && assignedData.length > 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center sm:justify-end items-center gap-1 mt-2 pb-4 text-xs flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-2.5 py-1 rounded-md border text-gray-600
                  hover:bg-[#00455c] hover:text-white transition
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-6 h-6 flex items-center justify-center rounded text-[11px] border transition
                      ${page === pg
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
                className="px-2.5 py-1 rounded-md border text-gray-600
                  hover:bg-[#00455c] hover:text-white transition
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default AssignDepartment;
