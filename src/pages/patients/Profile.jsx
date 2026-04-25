import React, { useEffect, useState } from "react";
import api from "../../Config/Axios";
import toast from "react-hot-toast";
import { Plus, Edit3, X } from "lucide-react";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import userImg from "../../assets/user.svg";

import { FaPlus} from "react-icons/fa";
const Profile = () => {
  const [data, setData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUpload,setFileUpload]=useState({
     profilePlus: "",
   })
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });

  useEffect(() => {
    console.log("DATA UPDATED:", data);
    fetchProfile();
  }, []);




  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/getMyProfile");
      console.log(res.data.data,"pppppppppp")
     const user = res.data.user || res.data.data || res.data;
    setData(user);

     setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dob: user.dob ? user.dob.split("T")[0] : "",
      address: user.address || "",
    });
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

console.log(data,"999ui99")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleUpload=async(e)=>{
 const file=e.target.files[0]
 if(!file){
  return
 }
  const uploadData=new FormData();
   uploadData.append("image",file)
 try{
   const response=await api.post("/api/upload/image",uploadData)
   setLoading(true)
 setFileUpload({profilePlus:res.data.url})  
  setData(prev => ({ ...prev, profileImage: res.data.url }));
    toast.success("Profile image updated!");
 }

 catch(error){
 toast.error("Image upload failed");
  } finally {
    setLoading(false);
  }
 
 }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put("/api/appointmentPatient/updateProfile", form);

      toast.success("Profile updated");
      setEditOpen(false);
      setData(res.data.user);
      setForm(prev => ({
      ...prev,
      name: res.data.user?.name || prev.name,
      phone: res.data.user?.phone || prev.phone,
      dob: res.data.user?.dob || prev.dob,
      address: res.data.user?.address || prev.address,
    }));
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen ">

    <div className="max-w-4xl mx-auto space-y-6">

     
      <div className="relative bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6">

       
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

        
           <div className="relative group">
      <img

       src={data?.profileImage||fileUpload.profilePlus||userImg}
        className="w-28 h-28 rounded-full border-2 border-white shadow-md object-cover group-hover:scale-105 transition duration-300"
      />

      <label
      
        htmlFor="profileUpload"
      className="absolute bottom-2 right-2 bg-gradient-to-br from-[#00304e] to-[#005f73] text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-110 transition">
        {loading ? <MiniLoader /> : <Plus size={16} />}
        <input
        onChange={handleUpload}
           type="file"
           name="profilePlus"
                id="profileUpload"
                className="hidden"
                accept="image/*"
                
          
        />
      </label>
    </div>
        
          <div className="flex-1 text-center md:text-left">

            <h2 className="text-2xl font-bold text-gray-800">
              {form.name}
            </h2>

            <p className="text-blue-600 font-medium mt-1">
              {form.role}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Welcome to your personal health dashboard
            </p>

            <button
              onClick={() => setEditOpen(true)}
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1b2b41] to-[#2c4a6b] text-white shadow-md hover:scale-105 transition"
            >
              Edit Profile
            </button>

          </div>
        </div>
      </div>

     <div className="grid md:grid-cols-2 gap-6">

 
  <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
    <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">
      Email
    </p>
    <p className="text-gray-800 font-semibold mt-2 break-all">
      {form.email}
    </p>
  </div>

 
  <div className="bg-gradient-to-br from-white to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
    <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
      Mobile
    </p>
    <p className="text-gray-800 font-semibold mt-2">
      {form.phone}
    </p>
  </div>

  {/* DOB Card */}
  <div className="bg-gradient-to-br from-white to-purple-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
    <p className="text-xs text-purple-500 font-medium uppercase tracking-wide">
      Date of Birth
    </p>
    <p className="text-gray-800 font-semibold mt-2">
      {form.dob || "Not set"}
    </p>
  </div>

  {/* Address Card */}
  <div className="bg-gradient-to-br from-white to-emerald-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
    <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
      Address
    </p>
    <p className="text-gray-800 font-semibold mt-2">
      {form.address || "Not set"}
    </p>
  </div>

</div>

      
      <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-[#1b2b41] mb-2">
          About You
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          This is your personal health profile. You can update your details anytime
          to keep your medical records accurate and up to date.
        </p>

      </div>

    </div>

   
{editOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-[1999] ">

    <div className="bg-white w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[60vw] lg:max-w-[45vw] xl:max-w-[35vw] max-h-[90vh] overflow-auto flex flex-col rounded-2xl shadow-2xl my-auto">

     
      <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-[#1b2b41] to-[#243a57] rounded-t-2xl">
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

      {/* BODY */}
      <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-gray-50 flex-1 overflow-y-auto">

        <form onSubmit={handleSubmit} id="patient-form">

          <div className="flex flex-col gap-4 sm:gap-5">

          
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold sm:w-32 text-gray-700">
                Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#1b2b41]/40 focus:border-[#1b2b41]"
              />
            </div>

           
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold sm:w-32 text-gray-700">
                Email
              </label>
              <input
                
                value={form.email}
                readOnly
                className="flex-1 cursor-not-allowed text-gray-400 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
              />
            </div>

           
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold sm:w-32 text-gray-700">
                Mobile
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter mobile"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#1b2b41]/40 focus:border-[#1b2b41]"
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold sm:w-32 text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#1b2b41]/40 focus:border-[#1b2b41]"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold sm:w-32 text-gray-700">
               Address
              </label>
              <textarea
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
                row={2}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#1b2b41]/40 focus:border-[#1b2b41]"
              />
            </div>

          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between items-center px-4 sm:px-5 md:px-6 py-3 border-t bg-white rounded-b-2xl mt-5">

            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="w-full sm:w-auto bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="patient-form"
              className="w-full sm:w-auto bg-gradient-to-r from-[#1b2b41] to-[#243a57] text-white px-4 sm:px-6 py-2 rounded-lg hover:scale-105 transition shadow-md text-sm"
            >
              {loading ? (
                <>
                  <MiniLoader />
                  Updating...
                </>
              ) : (
                "Save Changes →"
              )}
            </button>

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