import React, { useEffect, useState } from "react";
import { Plus, Edit3, X } from "lucide-react";
import api from "../../Config/Axios";
import {toast} from 'react-hot-toast'
import userImg from "../../assets/user.svg";
import {
  HiBriefcase,
  HiUserGroup,
  HiScissors,
  HiOfficeBuilding,
} from "react-icons/hi";
import MiniLoader from "../../component/CommonPages/MiniLoader";

const Profile = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [loading,setLoading]=useState(false)
   const [data, setData] = useState(null);
  const [fileUpload,setFileUpload]=useState({
    profilePlus: "",
  })
  const [form, setForm] = useState({
    name: "",
    phone: "",
    experience: "",
    department:"",
    deptNum:""
  });
useEffect(()=>{
 
  fetchDashboard();
},[])

 



const fetchDashboard = async () => {
  try {
    const res = await api.get("/api/doctorAppointment/getDoctorData");
    setData(res.data);
     setForm({
      name: res.data?.doctor?.name || "",         
      phone: res.data?.doctor?.phone || "",        
      experience: res.data?.doctor?.experience || "", 
     
      department: res.data?.department?.department || "",     
      deptNum: res.data?.deptNum || ""              
    });
  } catch (error) {
    toast.error("Failed to load dashboard");
  }
};



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const stats = [
    {
      title: "Experience",
      value: form.experience,
      icon: <HiBriefcase className="text-blue-500" />,
    },
    {
      title: "Patients",
      value: "1200+",
      icon: <HiUserGroup className="text-green-500" />,
    },
    {
      title: "Surgeries",
      value: "300+",
      icon: <HiScissors className="text-purple-500" />,
    },
  ];




const handleSubmit=async(e)=>{
   e.preventDefault()
    try {
      setLoading(true);

    
    const res = await api.put("/api/auth/updateProfile", form);
      setForm(res.data.user);
      toast.success("Profile updated successfully");
     setForm(prev => ({
      ...prev,
      name: res.data.user?.name || prev.name,
      phone: res.data.user?.phone || prev.phone,
      experience: res.data.user?.experience || prev.experience,
    }));
      setEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
}



  
 

 const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const uploadData = new FormData();
  uploadData.append("image", file);

  try {
    setLoading(true);
    const res = await api.post("/api/upload/image", uploadData);
  
    setFileUpload({ profilePlus: res.data.url });
   setData(prev => ({ ...prev, profileImage: res.data.url }));
    toast.success("Profile image updated!");
  } catch (err) {
   
   
    toast.error("Image upload failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7fb] via-[#eef3f8] to-[#f4f7fb] px-4 py-8">

      <div className="max-w-6xl mx-auto space-y-6">

       
    <div className="relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">

 
  <div className="flex items-center gap-6 w-full sm:w-auto">

  
    <div className="relative group">
      <img

       src={fileUpload.profilePlus || data?.doctor?.profileImage || userImg}
        className="w-28 h-28 rounded-full border-2 border-white shadow-md object-cover group-hover:scale-105 transition duration-300"
      />

      <label
        htmlFor="profileUpload"
      className="absolute bottom-2 right-2 bg-gradient-to-br from-[#00304e] to-[#005f73] text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-110 transition">
        {loading ? <MiniLoader /> : <Plus size={16} />}
        <input
           type="file"
                id="profileUpload"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
          
        />
      </label>
    </div>

   
    <div className="  p-4  w-full sm:w-[300px]">

      <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
        🩺 Doctor Details
      </h3>

      <div className="space-y-2 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">Name</span>
          <span className="font-medium text-gray-800">{form.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-gray-800">
            {form.email || "example@email.com"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Mobile</span>
          <span className="font-medium text-gray-800">{form.phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Role</span>
          <span className="font-medium text-[#005f73]">
            {form.role || "Doctor"}
          </span>
        </div>

      </div>
    </div>

  </div>

 
  <div className="w-full sm:w-auto flex justify-end">
    <button
      onClick={() => setEditOpen(true)}
      className="px-5 cursor-pointer bg-gradient-to-br from-[#00304e] to-[#005f73] py-2 rounded-xl text-white hover:scale-105 hover:shadow-md transition-all duration-300 flex items-center gap-2"
    >
      <Edit3 size={15} />
      Edit Profile
    </button>
  </div>

</div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition"
            >

              <div className="p-3 rounded-xl bg-gray-100">
                {item.icon}
              </div>

              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <p className="text-lg font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>

            </div>
          ))}
        </div>

       
        <div className="grid md:grid-cols-2 gap-6">

          
          <div className="bg-white/70 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 border-l-4 border-[#00304e] pl-3">
              About Doctor
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Experienced cardiologist specializing in heart disease treatment,
              patient care, and advanced surgical procedures. Focused on
              preventive healthcare and patient-first treatment approach.
            </p>
          </div>

         
          <div className="bg-white text-black rounded-2xl p-6 relative overflow-hidden">

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HiOfficeBuilding />
              Department Info
            </h3>
             
            <div className="space-y-3 text-sm">

              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Department</span>
                <span className="font-medium">{form.department}</span>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Dept No</span>
                <span className="font-medium">{form.deptNum}</span>
              </div>

              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-medium">{form.experience}</span>
              </div>

            </div>
          </div>
        </div>
      </div>

{editOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-[1999] overflow-y-auto">

    <div className="bg-white w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[60vw] lg:max-w-[45vw] xl:max-w-[35vw] max-h-[90vh] overflow-auto flex flex-col rounded-2xl shadow-2xl my-auto">

     
      <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-[#00304e] to-[#005f73] rounded-t-2xl">
        <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
          Edit Profile
        </h3>
        <p
          onClick={() => setEditOpen(false)}
          className="cursor-pointer text-white text-2xl hover:text-gray-300 leading-none"
        >
          &times;
        </p>
      </div>

     
      <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-gray-50 flex-1">
        <form onSubmit={handleSubmit} id="form-submit">
        <div className="flex flex-col gap-4 sm:gap-5">

         
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
            />
          </div>

         
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
              Department
            </label>
            <input
            name="department"
             readOnly
              value={data?.department?.department|| ""}      
              placeholder="Enter department"
              className="flex-1 cursor-not-allowed text-gray-400 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
            />
          </div>

         
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
              Dept No
            </label>
            <input
            readOnly
              value={data?.deptNum|| ""}
              name="deptNum"
              placeholder="Enter dept no"
              className="flex-1 cursor-not-allowed text-gray-400 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
            />
          </div>

        
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
              Mobile
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter mobile"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
            />
          </div>

         
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
              Experience
            </label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Enter experience"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
            />
          </div>

       
      

     
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between items-center px-4 sm:px-5 md:px-6 py-3 border-t bg-white rounded-b-2xl">

        <button
          onClick={() => setEditOpen(false)}
          className="w-full sm:w-auto bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition duration-300 shadow-md text-sm"
        >
          Cancel
        </button>

        <button
        type="submit"
        form="form-submit"
        
          className="w-full sm:w-auto bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-4 sm:px-6 py-2 rounded-lg hover:scale-105 transition duration-300 shadow-md text-sm"
        >
          {loading?(<>
          <MiniLoader/>
          Updating..</>):(
           " Save Changes →"
          )}
         
        </button>

      </div>
   </div>

   </form>
    </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Profile;