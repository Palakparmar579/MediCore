import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../Config/Axios";

function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchUser();
    fetchMyRoomAllocation();
  }, []);

  const fetchMyRoomAllocation = async () => {
    try {
      const res = await api.get("/api/room/getMyAllocations");
      setRoomData(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/api/doctorAppointment/getDoctorData");
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
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

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const room = roomData?.[0];

  return (
    <div className=" min-h-screen ">
      <div className="w-full max-w-4xl mx-auto space-y-4">

        {/* HEADING */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#00304e]">
            Doctor Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor your department, room allocation, assigned staff, and daily
            responsibilities efficiently from one place.
          </p>
        </div>

        {/* ── Profile card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          <div className="bg-[#00304e] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white text-sm font-medium">
                {getInitials(userData?.name)}
              </div>

              <div>
                <p className="text-white text-[15px] font-medium">
                  Dr. {userData?.name}
                </p>

                <p className="text-white/50 text-xs mt-0.5">
                  Doctor · Active
                </p>
              </div>
            </div>

            <span className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              On duty
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">

            {[
              {
                val: data?.department?.department || "—",
                key: "Department",
              },
              {
                val: data?.deptNum || "—",
                key: "Dept number",
              },
              {
                val: room
                  ? `Room ${room.room?.roomNum}`
                  : "Not assigned",
                key: "Allocated room",
              },
            ].map(({ val, key }) => (
              <div
                key={key}
                className="bg-gray-50 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {val}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  {key}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 px-5 py-2 text-[11px] text-gray-400 text-right">
            Stay connected with your team for better coordination and patient
            care.
          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

          {/* Department card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

            <div className="bg-[#00304e] px-5 py-3.5 flex items-center justify-between">

              <div>
                <p className="text-white text-sm font-medium">
                  Department
                </p>

                <p className="text-white/50 text-[11px] mt-0.5">
                  Your assignment
                </p>
              </div>

              <span className="text-[11px] bg-white/12 border border-white/20 rounded-full px-3 py-1 text-white">
                {data?.department ? "Active" : "Pending"}
              </span>
            </div>

            {!data?.department ? (

              <div className="p-6 text-center space-y-2">

                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto">

                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                    />
                  </svg>
                </div>

                <p className="text-sm font-medium text-gray-700">
                  No department assigned
                </p>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Contact the administrator to get assigned to a department.
                </p>

                <span className="inline-block mt-1 text-[11px] bg-red-50 text-red-500 rounded-full px-3 py-1">
                  Pending assignment
                </span>
              </div>

            ) : (

              <div className="p-4 space-y-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">

                    <svg
                      className="w-4 h-4 text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-3a1 1 0 011-1h2a1 1 0 011 1v3m-4 0h4"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {data.department?.department}
                    </p>

                    <p className="text-[11px] text-gray-400">
                      Dept No. {data?.deptNum}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                  Team members
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                  {/* Doctors */}
                  <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">
                      Doctors
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {data.otherDoctors?.length > 0
                        ? data.otherDoctors
                            .map((d) => d?.name || "Unknown")
                            .join(", ")
                        : "None assigned"}
                    </p>
                  </div>

                  {/* Nurses */}
                  <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">
                      Nurses
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {data.nurses?.length
                        ? data.nurses
                            .map((n) => n.name)
                            .join(", ")
                        : "None assigned"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

         
          {room ? (

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              <div className="bg-[#00304e] px-5 py-3.5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full border border-white/25 bg-white/10 flex flex-col items-center justify-center">

                    <span className="text-white text-base font-medium leading-none">
                      {room.room?.roomNum}
                    </span>

                    <span className="text-white/40 text-[8px] tracking-widest mt-0.5">
                      ROOM
                    </span>
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      Room allocation
                    </p>

                    <p className="text-white/50 text-[11px] mt-0.5">
                      Assigned ·{" "}
                      {new Date(room.room?.updatedAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  {room.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-100">

                {/* Doctor */}
                <div className="p-4">

                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">
                    Doctor
                  </p>

                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {getInitials(room.doctor?.name)}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {room.doctor?.name}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        Age {room.doctor?.age}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nurse */}
                <div className="p-4">

                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">
                    Nurse
                  </p>

                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {getInitials(room.nurse?.name)}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {room.nurse?.name}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        Age {room.nurse?.age}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="p-4 sm:col-span-2">

                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">
                    Department
                  </p>

                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">

                      <svg
                        className="w-4 h-4 text-blue-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-3a1 1 0 011-1h2a1 1 0 011 1v3m-4 0h4"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {room.department?.department?.department}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        Dept No. {room.department?.deptNum} · Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ) : (

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              <div className="bg-[#00304e] px-5 py-3.5">
                <p className="text-white text-sm font-medium">
                  Room allocation
                </p>

                <p className="text-white/50 text-[11px] mt-0.5">
                  Current assignment
                </p>
              </div>

              <div className="p-6 text-center space-y-2">

                <p className="text-sm font-medium text-gray-700">
                  No room assigned
                </p>

                <p className="text-xs text-gray-400">
                  You have not been allocated a room yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;