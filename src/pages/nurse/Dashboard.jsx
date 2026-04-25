import React from "react";

function NurseDashboard() {
  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-[1140px] mx-auto">

       
        <div
          className="
        bg-gradient-to-r from-[#00304e] via-[#003e47] to-[#000000]
          rounded-2xl
          shadow-xl
          p-6
          text-white
          relative
          overflow-hidden
          "
        >

         
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-gradient-to-br from-blue-400 to-gray-300 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-gradient-to-tr from-blue-500 to-gray-400 opacity-20 rounded-full blur-3xl"></div>

         
          <h2 className="text-xl font-bold italic mb-3">
            Hello{" "}
            <span className="bg-gradient-to-r from-blue-300 to-gray-200 bg-clip-text text-transparent">
              Nurse
            </span>{" "}
            <span className="bg-gradient-to-r from-gray-200 to-blue-300 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h2>

         
          <p className="text-gray-300 text-[13px] leading-relaxed max-w-[720px]">
            Welcome to your{" "}
            <span className="text-gray-200 font-semibold">nurse dashboard</span>. 
            From here you can assist doctors, monitor{" "}
            <span className="text-blue-200 font-medium">patient records</span>, 
            manage daily tasks, and help ensure smooth hospital operations while 
            providing the best care to patients.
          </p>

        </div>
      </div>
    </div>
  );
}

export default NurseDashboard;