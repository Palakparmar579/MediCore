import React, { useEffect, useState } from "react";
import api from "../../Config/Axios";
import { toast } from "react-hot-toast";
import { FaCalendarCheck, FaFileMedical, FaUserMd } from "react-icons/fa";
import DashboardCard from "../../component/CommonPages/DashboardCard";

function PatientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

const cards = [
  {
    title: "Total Appointments",
    count: 5,
    icon: <FaCalendarCheck className="text-xl text-blue-500" />,
    bg: "bg-blue-50",
    ring: "ring-blue-100",
  },
  {
    title: "Reports",
    count: 4,
    icon: <FaFileMedical className="text-xl text-emerald-500" />,
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
  {
    title: "Doctor Visited",
    count: 3,
    icon: <FaUserMd className="text-xl text-indigo-500" />,
    bg: "bg-indigo-50",
    ring: "ring-indigo-100",
  },
];

  const fetchData = async () => {
    try {
      const response = await api.get("/api/auth/getMyProfile");
      setData(response.data.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
console.log("09090",data)
  return (
    <div className="min-h-screen bg-[#f4f7fb] py-6 px-4">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= HERO CARD ================= */}
        <div className="relative bg-[#1b2b41] rounded-3xl shadow-xl p-6 sm:p-8 text-white overflow-hidden">

          {/* subtle glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#a3f3f1]/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            Hello{" "}
            <span className="text-[#a3f3f1]">
              {data?.name || "Patient"}
            </span>
            , Welcome Back 👋
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
            How are you feeling today? This is your personal dashboard where you
            can manage{" "}
            <span className="text-white font-medium">appointments</span>, check{" "}
            <span className="text-white font-medium">medical reports</span>, and
            stay updated with your healthcare journey.
          </p>
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

      
      </div>
    </div>
  );
}

export default PatientDashboard;