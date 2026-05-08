import React, { useEffect, useState } from "react";
import api from "../../Config/Axios";

import {
  CalendarDays,
  Phone,
  User,
  Clock3,
  Building2,
  Mail,
  ClipboardPlus,
  FileText,
  Pill,
  CheckCircle2,
  RotateCw,
} from "lucide-react";

function PatientAppointments() {
  const [appointmentsDetail, setAppointmentDetail] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get(
        "/api/appointmentPatient/getAcceptedAppointment"
      );

      setAppointmentDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-[1500px] mx-auto">

        {/* HEADING */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#00304e] leading-snug">
            Patient Appointment Records
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Manage appointments, medicines, reports and follow-up details
            efficiently from one place.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">

          {appointmentsDetail.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition duration-300"
            >

              {/* TOP SECTION */}
              <div className="bg-[#00304e] p-3 sm:p-4">
                <div className="flex justify-between items-start gap-3">

                  {/* LEFT */}
                  <div className="flex gap-2 sm:gap-3 w-full min-w-0">

                    {/* AVATAR */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0">
                      {item.firstName?.charAt(0)}
                    </div>

                    {/* DETAILS */}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                        {item.firstName}
                      </h2>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-[10px] sm:text-[11px] text-gray-300">

                        <div className="flex items-center gap-1">
                          <User size={11} />
                          {item.gender}
                        </div>

                        <div className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          {new Date(item.dob).toLocaleDateString()}
                        </div>

                        <span>• {item.age}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] text-gray-200 break-all">
                        <Phone size={11} />
                        {item.mobNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BADGES */}
                <div className="flex flex-wrap gap-2 mt-3">

                  <div className="bg-white/10 border border-white/10 text-white px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1">
                    <Building2 size={11} />
                    Room {item.roomNum}
                  </div>

                  <div className="bg-blue-500/20 border border-blue-300/10 text-blue-100 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1">
                    <Clock3 size={11} />
                    {item.time}
                  </div>

                  <div className="bg-purple-500/20 border border-purple-300/10 text-purple-100 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium">
                    Accepted
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div className="p-3 space-y-2.5">

                {/* APPOINTMENT + EMAIL */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">

                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 font-medium">
                      <CalendarDays size={11} />
                      Appointment
                    </div>

                    <p className="mt-1 text-[11px] sm:text-xs font-semibold text-gray-800">
                      {new Date(item.appDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-[#00304e]/5 rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                      <Mail size={11} />
                      Email
                    </div>

                    <p className="mt-1 text-[11px] sm:text-xs font-semibold text-gray-800 break-all">
                      {item.email}
                    </p>
                  </div>
                </div>

                {/* HEALTH ISSUE */}
                <div className="bg-orange-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-orange-700 font-medium">
                    <ClipboardPlus size={11} />
                    Health Issue
                  </div>

                  <p className="mt-1 text-[11px] sm:text-xs text-gray-800 break-words">
                    {item.healthIssue}
                  </p>
                </div>

                {/* DOCTOR NOTE */}
                <div className="bg-[#00304e]/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#00304e] font-medium">
                    <FileText size={11} />
                    Doctor's Note
                  </div>

                  <p className="mt-1 text-[11px] sm:text-xs text-gray-700 break-words">
                    {item.doctorNote || "No notes available"}
                  </p>
                </div>

                {/* MEDICINES */}
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-medium mb-2">
                    <Pill size={11} />
                    Medicines
                  </div>

                  <div className="flex flex-wrap gap-1.5">

                    {item.medicines?.length > 0 ? (
                      item.medicines.map((med, index) => (
                        <div
                          key={index}
                          className="bg-[#00304e]/10 text-[#00304e] px-2 py-1 rounded-full text-[10px] font-medium break-words"
                        >
                          {med.name} - {med.dosage}
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-gray-400">
                        No medicines added
                      </p>
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                  {/* REPORT */}
                  <div className="bg-green-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-green-700 text-[11px] sm:text-xs font-semibold">

                      <CheckCircle2 size={13} />

                      {item.reportSent
                        ? "Report Sent"
                        : "Pending"}
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1">
                      {item.reportSent
                        ? "Submitted"
                        : "Waiting"}
                    </p>
                  </div>

                  {/* FOLLOW UP */}
                  <div className="bg-yellow-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-yellow-700 text-[11px] sm:text-xs font-semibold">
                      <RotateCw size={13} />
                      Follow-up
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-gray-700 mt-1 break-words">
                      {item.followUp || "No follow-up"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NO DATA */}
        {appointmentsDetail.length === 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 text-center mt-5 border border-gray-200">
            <p className="text-sm text-gray-500">
              No accepted appointments found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;