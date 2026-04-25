import React, { useEffect, useState } from "react";
import { FaUserMd, FaUsers } from "react-icons/fa";
import api from "../../Config/Axios"
import DashboardCard from "../../component/CommonPages/DashboardCard";
import {
  BarChart,
  Pie,
  PieChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { HiUsers } from "react-icons/hi";
import { GiNurseFemale } from "react-icons/gi";
import useTitle from "../../hooks/userTitle";



function Dashboard() {
 useTitle("Admin Dashboard")

  const [stats, setStats] = useState({
    doctor: 0,
    nurse: 0,
    patient: 0,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/auth/dashBoardStats");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalCount = stats.total;
  const doctorCount = stats.doctor;
  const nurseCount = stats.nurse;
  const patientCount = stats.patient;

  const data = [
    { role: "Doctor", users: doctorCount },
    { role: "Nurse", users: nurseCount },
    { role: "Patient", users: patientCount },
  ];

  const getColor = (role) => {
    if (role === "Doctor") return "#1b2b41";
    if (role === "Nurse") return "#a3f3f1";
    return "#e0e0e0";
  };

  const cards = [
    {
      title: "Total Users",
      count: totalCount,
      icon: <FaUsers className="text-xl text-green-400" />,
    },
    {
      title: "Total Doctors",
      count: doctorCount,
      icon: <FaUserMd className="text-xl text-sky-300" />,
    },
    {
      title: "Total Patients",
      count: patientCount,
      icon: <HiUsers className="text-xl text-rose-300" />,
    },
    {
      title: "Total Nurses",
      count: nurseCount,
      icon: <GiNurseFemale className="text-xl text-violet-300" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1140px] mx-auto px-3 sm:px-6 lg:px-8">

       
        <div className="mb-6 mt-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
            Dashboard
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1">
            Welcome back Admin
          </p>
        </div>

       
        <div className="mt-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
              <div key={index} className="w-full">
                <DashboardCard
                  title={card.title}
                  count={card.count}
                  icon={card.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 px-3 sm:px-6 lg:px-16 max-w-[1140px] mx-auto">

       
        <div className="w-full lg:w-1/2 h-[320px] sm:h-[380px] md:h-[420px] bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-5">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1">
            Users by Role
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Overview of how users are distributed across different roles.
          </p>
          {totalCount === 0 ? (
            <p className="text-sm text-gray-400 flex justify-center pt-16 sm:pt-20">
              No data available at the moment.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={getColor(entry.role)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-[320px] sm:h-[380px] md:h-[420px] bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-5">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1">
            User Distribution
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Percentage breakdown of users based on roles.
          </p>
          {totalCount === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-sm text-gray-400 text-center">
                No data available at the moment,
                <br />
                data will appear here once it is added.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="97%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="users"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius="45%"
                  innerRadius="28%"
                  paddingAngle={4}
                  stroke="none"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={getColor(entry.role)} />
                  ))}
                </Pie>
                <Tooltip />
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl sm:text-2xl font-bold fill-gray-800"
                >
                  {doctorCount + nurseCount + patientCount}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs sm:text-sm fill-gray-500"
                >
                  Total Users
                </text>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
