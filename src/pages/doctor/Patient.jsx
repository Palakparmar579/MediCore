import React, { useState, useEffect } from "react";
import api from "../../Config/Axios";
import {
  FaUser,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
  FaStethoscope,
  FaCheckCircle,
  FaCalendarAlt,
  FaCalendarCheck,
  FaTimesCircle,
  FaHourglassHalf,
  FaVenusMars,
  FaEnvelope,
  FaClock,
  FaFileMedical,
} from "react-icons/fa";
import DashboardCard from "../../component/CommonPages/DashboardCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

const DetailRow = ({ icon, label, children }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-base">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-medium">
        {label}
      </p>
      <div className="text-[13px] text-gray-700">{children}</div>
    </div>
  </div>
);

function Patient() {
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });
  const [appointmentData, setAppointmentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchStats();
    getAllAppointment();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/doctorAppointment/AppointmentStats");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const total = stats.total;
  const accepted = stats.accepted;
  const rejected = stats.rejected;
  const pending = stats.pending;

  const cards = [
    {
      title: "Total Appointments",
      count: total,
      icon: (
        <div className="w-10 h-10 bg-[#00304e]/10 rounded-lg text-[#00304e] flex items-center justify-center">
          <FaCalendarAlt />
        </div>
      ),
    },
    {
      title: "Accepted",
      count: accepted,
      icon: (
        <div className="w-10 h-10 bg-green-100 rounded-lg text-green-600 flex items-center justify-center">
          <FaCalendarCheck />
        </div>
      ),
    },
    {
      title: "Rejected",
      count: rejected,
      icon: (
        <div className="w-10 h-10 bg-red-100 rounded-lg text-red-500 flex items-center justify-center">
          <FaTimesCircle />
        </div>
      ),
    },
    {
      title: "Pending",
      count: pending,
      icon: (
        <div className="w-10 h-10 bg-yellow-100 rounded-lg text-yellow-600 flex items-center justify-center">
          <FaHourglassHalf />
        </div>
      ),
    },
  ];

  const getAllAppointment = async () => {
    try {
      const response = await api.get("/api/appointmentPatient/getAllAppointment");
      setAppointmentData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const STATUS_STYLE = {
    accepted: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  const barData = [
    { status: "Accepted", count: accepted },
    { status: "Rejected", count: rejected },
    { status: "Pending", count: pending },
  ];

  const pieData = [
    { name: "Accepted", value: accepted },
    { name: "Rejected", value: rejected },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#1b2b41", "#a3f3f1", "#e0e0e0"];

  const getColor = (status) => {
    if (status === "Accepted") return "#1b2b41";
    if (status === "Rejected") return "#a3f3f1";
    return "#e0e0e0";
  };

  const handleViewMore = (patientItem) => {
    setSelectedItem(patientItem);
    setOpen(true);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1140px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* ── Page heading ── */}
        <div className="mb-6 mt-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
            Appointments
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1">
            Overview of all patient appointment activity
          </p>
        </div>

        {/* ── Stats cards ── */}
        <div className="mt-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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

      {/* ── Charts ── */}
      <div
        className="mt-6 sm:mt-8 px-3 sm:px-6 lg:px-7 max-w-[1140px] mx-auto
                      grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6 lg:flex lg:flex-row"
      >
        {/* Bar chart */}
        <div
          className="w-full min-h-[50%] sm:min-h-[380px] md:min-h-[420px]
                        bg-white rounded-xl shadow-md p-4 flex flex-col"
        >
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1">
            Appointments by Status
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Overview of how appointments are distributed across statuses.
          </p>
          {total === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-gray-400">
                No data available at the moment.
              </p>
            </div>
          ) : (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="status"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    name="Appointments"
                  >
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={getColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div
          className="w-full min-h-[50%] sm:min-h-[380px] md:min-h-[420px]
                        bg-white rounded-xl shadow-md p-4 flex flex-col"
        >
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1">
            Appointment Distribution
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Percentage breakdown of appointments based on booking status.
          </p>
          {total === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-gray-400 text-center">
                No data available at the moment,
                <br />
                data will appear here once it is added.
              </p>
            </div>
          ) : (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    innerRadius="50%"
                    paddingAngle={4}
                    stroke="none"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                  <text
                    x="50%"
                    y="48%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      fill: "#1f2937",
                    }}
                  >
                    {total}
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "12px", fill: "#6b7280" }}
                  >
                    Total
                  </text>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center flex-wrap gap-4 mt-2">
                {pieData.map((d, i) => (
                  <span
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs text-gray-500"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm inline-block"
                      style={{ background: COLORS[i] }}
                    />
                    {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Patient Records heading ── */}
      <div className="mb-4 lg:px-7 mt-10 max-w-[1140px] mx-auto px-3 sm:px-6">
        <h3 className="text-base font-semibold text-[#00304e]">
          Patient Records
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {appointmentData.length} Appointment{appointmentData.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* ── Patient Cards Grid ── */}
      <div className="grid grid-cols-1 lg:px-7 sm:grid-cols-2 xl:grid-cols-3 pb-7 gap-4 max-w-[1140px] mx-auto px-3 sm:px-6">
        {appointmentData.map((item, index) => (
          <div key={item._id || index} className="relative group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            <div className="absolute left-0 top-0 h-full w-[3px] bg-[#00304e] group-hover:w-[6px] transition-all duration-300 rounded-l-2xl" />
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#00304e]/20 transition pointer-events-none" />

            <div className="p-4 sm:p-5 relative z-10">
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#00304e]/10 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-[#00304e]">
                    {item.firstName?.charAt(0) || "P"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-[#00304e] group-hover:text-black transition truncate">
                      {item.firstName}
                    </h2>
                    <p className="text-xs text-gray-400 tracking-wider uppercase truncate">
                      {item.department?.department || "General"}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${STATUS_STYLE[item.bookingStatus]}`}
                >
                  {item.bookingStatus}
                </span>
              </div>

              <div className="w-full h-px bg-gray-100 my-3" />

              {/* Info rows */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                  <FaUser className="text-[#00304e]/40 flex-shrink-0 text-sm" />
                  <span className="truncate">
                    Age:{" "}
                    <span className="text-gray-700 font-medium">
                      {item.age || "—"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                  <FaVenusMars className="text-[#00304e]/40 flex-shrink-0 text-sm" />
                  <span className="truncate">
                    Gender:{" "}
                    <span className="text-gray-700 font-medium">
                      {item.gender || "—"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                  <FaPhone className="text-[#00304e]/40 flex-shrink-0 text-sm" />
                  <span className="truncate">
                    Contact:{" "}
                    <span className="text-gray-700 font-medium">
                      {item.mobNumber || "—"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                  <FaCalendar className="text-[#00304e]/40 flex-shrink-0 text-sm" />
                  <span className="truncate">
                    Visit Date:{" "}
                    <span className="text-gray-700 font-medium">
                      {formatDate(item.appDate)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                  <FaClock className="text-[#00304e]/40 flex-shrink-0 text-sm" />
                  <span className="truncate">
                    Time:{" "}
                    <span className="text-gray-700 font-medium">
                      {item.time || "—"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                  <FaMapMarkerAlt className="text-[#00304e]/40 flex-shrink-0 text-sm" />
                  <span className="truncate">
                    Location:{" "}
                    <span className="text-gray-700 font-medium">
                      {item.address || "—"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FaStethoscope className="text-[#00304e]/30 flex-shrink-0 text-xs" />
                  <span
                    className="text-[11px] text-gray-400 truncate"
                    title={item.healthIssue}
                  >
                    {item.healthIssue || "No issue noted"}
                  </span>
                </div>
                {item.bookingStatus === "accepted" && (
                  <span
                    className={`flex-shrink-0 flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-medium ${
                      item.reportSent
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <FaCheckCircle className="text-[9px]" />
                    {item.reportSent ? "Report sent" : "Not sent"}
                  </span>
                )}
              </div>

              {/* View More button */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleViewMore(item)}
                  className="text-xs font-semibold text-[#00304e] bg-[#00304e]/10 hover:bg-[#00304e]/90 hover:text-white px-4 py-2 rounded-full transition-all duration-300"
                >
                  View More..
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Detail Popup Modal ── */}
      {open && selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-1990"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00304e]/10 flex items-center justify-center text-sm font-semibold text-[#00304e]">
                  {selectedItem.firstName?.charAt(0) || "P"}
                </div>
                <div>
                  <h2 className="font-bold text-[#00304e] text-[15px]">
                    {selectedItem.firstName}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {selectedItem.department?.department || "General"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Modal body — scrollable */}
            <div className="overflow-y-auto flex-1 p-5 space-y-1">
              {/* Patient info grid */}
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">
                Patient Info
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Name</p>
                  <p className="text-[13px] font-medium text-gray-800">
                    {selectedItem.firstName}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Age</p>
                  <p className="text-[13px] font-medium text-gray-800">
                    {selectedItem.age || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Gender</p>
                  <p className="text-[13px] font-medium text-gray-800">
                    {selectedItem.gender || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Visit Date</p>
                  <p className="text-[13px] font-medium text-gray-800">
                    {formatDate(selectedItem.appDate)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Time</p>
                  <p className="text-[13px] font-medium text-gray-800">
                    {selectedItem.time || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Room No.</p>
                  <p className="text-[13px] font-medium text-gray-800">
                    {selectedItem.roomNum || "—"}
                  </p>
                </div>
              </div>

              {/* Detail rows */}
              <DetailRow icon="📞" label="Contact">
                {selectedItem.mobNumber || "—"}
              </DetailRow>

              <DetailRow icon="✉️" label="Email">
                {selectedItem.email || "—"}
              </DetailRow>

              <DetailRow icon="📍" label="Address">
                {selectedItem.address || "—"}
              </DetailRow>

              <DetailRow icon="❤️" label="Health Issue">
                {selectedItem.healthIssue || "No issue noted"}
              </DetailRow>

              <DetailRow icon="💊" label="Medicines">
                {selectedItem.medicines?.length > 0 ? (
                  <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-1">
                    {selectedItem.medicines.map((med, i) => (
                      <p key={i}>
                        • {med.name} - {med.dosage}
                      </p>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">No medicines prescribed</span>
                )}
              </DetailRow>

              <DetailRow icon="📆" label="Follow-up">
                {selectedItem.followUp || "Not scheduled"}
              </DetailRow>

              <DetailRow icon="📋" label="Doctor's Note">
                {selectedItem.doctorNote ? (
                  <div className="bg-gray-50 rounded-xl px-3 py-2.5 leading-relaxed">
                    {selectedItem.doctorNote}
                  </div>
                ) : (
                  <span className="text-gray-400">No notes added</span>
                )}
              </DetailRow>

              {selectedItem.bookingStatus === "accepted" && (
                <DetailRow icon="📄" label="Report Status">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      selectedItem.reportSent
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FaCheckCircle className="text-[10px]" />
                    {selectedItem.reportSent ? "Report Sent" : "Report Not Sent"}
                  </span>
                </DetailRow>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-[#00304e] bg-[#00304e]/10 hover:bg-[#00304e]/90 hover:text-white px-5 py-2 rounded-full transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patient;