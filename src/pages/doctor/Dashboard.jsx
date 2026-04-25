import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../Config/Axios";
 import { FaUserMd, FaHospital, FaUsers, FaUserNurse } from "react-icons/fa";
 import { decryptData } from "../../utils/encrypt";
function DoctorDashboard() {
  const [data, setData] = useState(null);

 

 useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {
    const res = await api.get("/api/doctorAppointment/getDoctorData");
    setData(res.data);
  } catch (error) {
    toast.error("Failed to load dashboard");
  }
};
  return (


<div className="w-full flex justify-center py-6 px-4">
  <div className="w-full max-w-4xl">

    <div className="bg-white rounded-2xl shadow-lg p-5 relative overflow-hidden">

   
      <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00304e]"></div>

     
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#00304e]/10 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-5">

        
        <div className="sm:w-1/3 text-center sm:text-left space-y-2">

          <FaUserMd className="text-3xl text-[#00304e] mx-auto sm:mx-0" />

          <h1 className="text-lg font-semibold text-gray-800">
            Dr. {data?.doctor?.name}
          </h1>

          <p className="text-xs text-gray-500 leading-relaxed">
            Welcome to your personalized dashboard. Here you can view your department details and stay connected with your team.
          </p>
        </div>

        <div className="hidden sm:block w-[1px] bg-gray-200"></div>

    
        <div className="flex-1 space-y-4">

          {!data?.department ? (
            <div className="space-y-3 text-center sm:text-left">

            
              <h2 className="text-sm font-semibold text-gray-700">
                Department Status
              </h2>

              <div className="w-full h-[1px] bg-gray-200"></div>

              <FaHospital className="text-xl text-gray-400 mx-auto sm:mx-0" />

              <p className="text-sm text-gray-600 font-medium">
                No Department Assigned
              </p>

              <p className="text-xs text-gray-500 leading-relaxed">
                You are currently not assigned to any department. Please contact the administrator to get assigned and access your workspace.
              </p>

              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                Pending Assignment
              </span>
            </div>
          ) : (
            <div className="space-y-4">

             
              <h2 className="text-sm font-semibold text-gray-700">
                Department Information
              </h2>

              <div className="w-full h-[1px] bg-gray-200"></div>

             
              <div className="flex items-start gap-3">
                <FaHospital className="text-[#00304e] mt-1" />
                <div>
                  <p className="text-sm font-semibold text-[#00304e]">
                    {data.department?.department}
                  </p>
                  <p className="text-xs text-gray-500">
                    Department No: {data?.deptNum}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    You are successfully assigned to this department.
                  </p>
                </div>
              </div>

             
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Team Members
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUsers className="text-gray-500 text-xs" />
                      <span className="text-xs font-medium text-gray-700">
                        Doctors
                      </span>
                    </div>

                    <div className="w-full h-[1px] bg-gray-200 mb-1"></div>

                   <p className="text-xs text-gray-600 leading-relaxed">
  {data.otherDoctors?.length > 0
    ?data.otherDoctors.map((doc) => doc?.name || "Unknown").join(", ")
    : "No other doctors are currently assigned."}
</p>
                  </div>

                 
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserNurse className="text-gray-500 text-xs" />
                      <span className="text-xs font-medium text-gray-700">
                        Nurses
                      </span>
                    </div>

                    <div className="w-full h-[1px] bg-gray-200 mb-1"></div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {data.nurses?.length
                        ? data.nurses.map((nur) => nur.name).join(", ")
                        : "No nurses are currently assigned."}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    
      <div className="mt-4 pt-2 border-t text-[11px] text-gray-400 text-center sm:text-right">
        Stay connected with your team to ensure better coordination and patient care.
      </div>

    </div>
  </div>
</div>
  );
}

export default DoctorDashboard;