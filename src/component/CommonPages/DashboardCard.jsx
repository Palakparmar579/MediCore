import React from "react";

function DashboardCard({ title, count, icon }) {
  return (
    <div className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-xl
      bg-white
      border border-[#01253c]/10
      shadow-sm
      hover:shadow-md hover:-translate-y-1
      transition-all duration-300 w-full">

      <div className="absolute left-0 top-0 h-full w-1 bg-[#01253c] rounded-l-xl"></div>

      <div className="absolute bottom-3 right-3 opacity-20">
        <div className="w-16 h-[2px] bg-[#00304e] mb-1"></div>
        <div className="w-12 h-[2px] bg-[#00304e] mb-1"></div>
        <div className="w-8 h-[2px] bg-[#00304e] mb-1"></div>
        <div className="w-5 h-[2px] bg-[#00304e]"></div>
      </div>

      <div className="flex items-center justify-center flex-shrink-0
        w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg
        bg-[#01253c]/10">
        <div className="text-[#01253c] text-base sm:text-lg">
          {icon}
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-xs sm:text-sm text-[#01253c]/70 font-medium truncate">
          {title}
        </h3>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#01253c]">
          {count}
        </p>
      </div>

    </div>
  );
}

export default DashboardCard;
