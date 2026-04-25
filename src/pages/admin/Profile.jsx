import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import userImg from "../../assets/user.svg";
import DashboardCard from "../../component/CommonPages/DashboardCard";
import { HiBriefcase, HiUserGroup, HiScissors } from "react-icons/hi";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import api from "../../Config/Axios";
import useTitle from "../../hooks/userTitle";
import {toast} from "react-hot-toast"

const Profile = () => {
  useTitle("Admin Profile");
 

  const [fileUpload, setFileUpload] = useState({
    profilePlus: "",
  });
 
  const [formData,setFormData]=useState({
    name:"",
    phone:"",
    experience:"",
    address:"",
    bio:"",
  })

   const [errors,setErrors]=useState({})
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ patient: 0 });
 const [userData,setUserData]=useState([])
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchData()
   
  }, []);

  const handleChange=(e)=>{
    const {name,value}=e.target
    setFormData({
      ...formData,
     [name]:value
    })
    setErrors({
    ...errors,
    [name]: "",
  });
  }

const handleFormSubmit=async(e)=>{
  
    e.preventDefault();
    let errors = {};

  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!formData.phone) {
    errors.phone = "Enter mobile number";
  } else if (!/^[0-9]{10}$/.test(formData.phone)) {
    errors.phone = "Enter valid 10-digit mobile number";
  }

  if (!formData.experience) {
    errors.experience = "Please enter experience";
  }

  if (!formData.address) {
    errors.address = "Enter address";
  }

  if (!formData.bio) {
    errors.bio = "Please enter bio";
  }

  setErrors(errors);

 
  if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      const res = await api.put("/api/auth/updateProfile", formData);

      setFormData(res.data.user);
      toast.success("Profile updated successfully");

      setIsEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
}
  

   const fetchData=async()=>{
    try {
    const response = await api.get("/api/auth/getMyProfile");
    const data = response.data.data;
    console.log("PROFILE DATA:", data);
    setUserData(data);
  } catch (error) {
    console.log("Error fetching profile:", error);
  }
 }

 
console.log(userData,"================")
 const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const uploadData = new FormData();
  uploadData.append("image", file);

  try {
    setLoading(true);
    const res = await api.post("/api/upload/image", uploadData);
    console.log("SUCCESS:", res.data);
    setFileUpload({ profilePlus: res.data.url });
    setUserData(prev => ({ ...prev, profileImage: res.data.url }));
    toast.success("Profile image updated!");
  } catch (err) {
   
   
    toast.error("Image upload failed");
  } finally {
    setLoading(false);
  }
};

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/auth/dashBoardStats");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const patientCount = stats.patient;

  const cards = [
    {
      title: "Experience",
      count: <span className="text-sm">{userData.experience}</span>,
      //userData.experience ? `${userData.experience} years` : "N/A",
      icon: <HiBriefcase className="text-xl text-blue-500" />,
    },
    {
      title: "Patients",
      count: <span className="text-sm">{patientCount}</span>,
      icon: <HiUserGroup className="text-xl text-green-500" />,
    },
    {
      title: "Surgeries",
      count: <span className="text-sm">300+</span>,
      icon: <HiScissors className="text-xl text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

     
<div className="lg:col-span-1 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition duration-300 rounded-2xl p-6 h-fit border border-gray-100">
        
          <div className="relative flex justify-center">


           
<div className="relative p-[3px] rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-teal-400 shadow-lg">
  <div className="bg-white p-2 rounded-full">

              <img
             src={fileUpload.profilePlus || userData.profileImage || userImg}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />

              <input
                type="file"
                id="profileUpload"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />
              <label
                htmlFor="profileUpload"
                className="absolute bottom-2 right-2 bg-[#01253c] hover:bg-[#023a5c] text-white p-2 rounded-full cursor-pointer shadow-lg"
              >
                {loading ? <MiniLoader /> : <Plus size={16} />}
              </label>

            

            </div>
          </div>
</div>
       
          <div className="text-center mt-4 space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
            <p className="text-gray-600 font-medium">{userData.role}</p>
            <p className="text-sm text-gray-500">{userData.address}</p>
          </div>

        
          <button
            onClick={() => setIsEditOpen(true)}
            className="w-full mt-6 bg-[#01253c] hover:bg-[#023a5c] text-white py-2 rounded-lg shadow-md transition"
          >
            Edit Profile
          </button> 
        </div>

       
        <div className="lg:col-span-2 space-y-6">

          
          <div className="bg-white shadow-sm rounded-xl p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 border-l-4 border-rose-400 pl-3">
              About
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
             {userData.bio}
            </p>
          </div>

         
          <div className="grid md:grid-cols-2 gap-6">

           
            <div className="bg-white shadow-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Hospital & Contact
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400">Hospital</p>
                  <p className="font-medium text-gray-800">
                    City Heart Hospital
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Contact</p>
                  <p className="text-sm text-gray-700">{userData.email}</p>
                  <p className="text-sm text-gray-700">{userData.phone}</p>
                </div>
              </div>
            </div>

           
            <div className="bg-white shadow-sm rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Professional Details
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="font-medium text-gray-800">
                    Senior Cardiologist
                  </p>
                  <p className="text-sm text-gray-500">2018 – Present</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Specialization</p>
                  <p className="text-gray-700">Cardiology</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

       <div className="mt-6 space-y-3">
              <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">

            {cards.map((item, index) => (
              <DashboardCard
                key={index}
                title={item.title}
                count={item.count}
                icon={item.icon}
              />
            ))}
          </div>
          </div>

     
      

     {isEditOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-[1999] overflow-y-auto">

            <div className="bg-white w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[60vw] lg:max-w-[45vw] xl:max-w-[35vw] max-h-[90vh]   flex flex-col rounded-2xl shadow-2xl my-auto">
              
     
              <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-[#00304e] to-[#005f73] flex-shrink-0 rounded-t-2xl">
        <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
          Edit Profile
        </h3>
        <p
          onClick={() => setIsEditOpen(false)}
          className="cursor-pointer text-white text-2xl hover:text-gray-300 leading-none"
        >
          &times;
        </p>
      </div>

     
      <div className="px-4 sm:px-5 md:px-6 overflow-auto py-4 sm:py-5 bg-gray-50 flex-1">
         <form onSubmit={handleFormSubmit} id="role-form">
        <div className="flex flex-col gap-4 sm:gap-5">

         
     <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
  <label className="text-sm font-semibold sm:w-32 text-gray-700 mt-2">
    Name
  </label>

  <div className="flex-1">
    <input
      name="name"
      type="text"
      value={formData.name}
      onChange={handleChange}
      placeholder="Enter name"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
    />

    {errors.name && (
      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
    )}
  </div>
</div>
         
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
            Role
            </label>
            <input
              readOnly     
              value={userData.role}
              placeholder="Enter department"
              className="flex-1  text-gray-400 cursor-not-allowed  rounded-lg px-3 py-2 text-sm shadow-sm "
            />
          </div>

         
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-semibold sm:w-32 text-gray-700">
             email
            </label>
            <input
              readOnly
              value={userData.email}           
              placeholder="Enter dept no"
              className="flex-1 text-gray-400 cursor-not-allowed border-none  rounded-lg px-3 py-2 text-sm shadow-sm "
            />
          </div>

        
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
  <label className="text-sm font-semibold sm:w-32 text-gray-700 mt-2">
    Mobile Number
  </label>

  <div className="flex-1">
    <input
      name="phone"
      type="tel"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Enter mobile"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
    />

    {errors.phone && (
      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
    )}
  </div>
</div>

         
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
  <label className="text-sm font-semibold sm:w-32 text-gray-700 mt-2">
    Experience
  </label>

  <div className="flex-1">
    <input
      name="experience"
      type="text"
      value={formData.experience}
      onChange={handleChange}
      placeholder="Enter experience"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73]"
    />

    {errors.experience && (
      <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
    )}
  </div>
</div>

           <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
  <label className="text-sm font-semibold sm:w-32 text-gray-700 mt-2">
    Address
  </label>

  <div className="flex-1">
    <textarea
      name="address"
      value={formData.address}
      onChange={handleChange}
      placeholder="Enter Address"
      rows={2}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73] resize-none"
    />

    {errors.address && (
      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
    )}
  </div>
</div>

    
     <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
  <label className="text-sm font-semibold sm:w-32 text-gray-700 mt-2">
    Bio
  </label>

  <div className="flex-1">
    <textarea
      name="bio"
      value={formData.bio}
      onChange={handleChange}
      placeholder="Enter bio"
      rows={4}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#005f73]/40 focus:border-[#005f73] resize-none"
    />

    {errors.bio && (
      <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
    )}
  </div>
</div>

       
       
     

     
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between items-center px-4 sm:px-5 md:px-6 py-3 border-t bg-white rounded-b-2xl">

        <button
          onClick={() => setIsEditOpen(false)}
          className="w-full cursor-pointer sm:w-auto bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition duration-300 shadow-md text-sm"
        >
          Cancel
        </button>

        <button
         
           form="role-form"
          type="submit"
          
          className={`w-full cursor-pointer sm:w-auto bg-gradient-to-r from-[#00304e] to-[#005f73] text-white px-4 sm:px-6 py-2 rounded-lg hover:scale-105 transition duration-300 shadow-md text-sm ${loading }`}
        >
          {loading?(
            <>
            <MiniLoader/> Updating...
            </>
            ):(
              "Save Changes->"
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