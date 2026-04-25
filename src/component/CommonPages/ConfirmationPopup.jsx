import React from "react";
import MiniLoader from "../../component/CommonPages/MiniLoader";

const ConfirmAction = ({
  handleCancel,
  handleConfirm,
  handleCross,
  message,
  heading,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 backdrop-blur-sm z-[1000]">
      <div className="w-[340px] bg-white rounded-xl pt-5 pb-0 px-5 relative text-center shadow-[0_10px_25px_rgba(0,0,0,0.2)] animate-[popupJump_.4s_ease]">
        {/* Close Button */}
        <span
          onClick={handleCross}
          className="absolute right-3 top-2 text-[20px] text-gray-500 cursor-pointer hover:text-black"
        >
          &times;
        </span>

        
        <h3 className="text-[18px] font-semibold mb-2">{heading}</h3>

        {/* Text */}
        <p className="text-[14px] text-gray-600 leading-relaxed mb-5">{message}</p>
     
        {/* Buttons */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 text-[#00304e] font-medium hover:bg-gray-100 cursor-pointer
             hover:shadow-xl 
    transition-all duration-300 ease-in-out 
    active:scale-90 active:shadow-md"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-3 text-[#00304e] font-medium border-l border-gray-200 
  hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out 
  active:scale-90 active:shadow-md flex items-center justify-center
  ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-105 active:scale-95"}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <MiniLoader size="w-4 h-4" />
                <span className="text-sm">Processing...</span>
              </span>
            ) : (
              "Yes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAction;
