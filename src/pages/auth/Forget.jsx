import React, { useState, useEffect } from "react";

const ForgetPass = ({ handleCancel, handleConfirm, handleCross }) => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [emailError, setemailError] = useState("");

  useEffect(() => {
    // trigger animation on mount
    setShow(true);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) return setemailError("Email is required");
    handleConfirm(email);
    setEmail("");
    setemailError("");
  };

  return (
  <div
    className={`fixed inset-0 flex items-center justify-center z-[1000]
    bg-black/60 backdrop-blur-sm
    transition-opacity duration-300
    ${show ? "opacity-100" : "opacity-0"}`}
  >
    {/* Modal */}
    <div
      className={`relative w-[92%] max-w-md bg-[#0f172a]/95 backdrop-blur-xl border border-blue-900/40
      shadow-[0_25px_70px_rgba(0,0,0,0.6)] rounded-2xl p-6 sm:p-8
      transition-all duration-300
      ${show ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-6 opacity-0"}`}
    >

      {/* Close Button */}
      <span
        onClick={handleCross}
        className="absolute right-4 top-3 text-xl text-gray-400 cursor-pointer
        hover:text-blue-400 transition"
      >
        &times;
      </span>

      {/* Header */}
      <h3 className="text-xl font-semibold text-white">
        Forgot Password?
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        Request a password reset from admin
      </p>

      {/* Divider */}
      <div className="my-4 h-[1px] bg-blue-900/40"></div>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed mb-5">
        Provide your email address and the administrator will be notified to
        initiate your password reset.
      </p>

      {/* Input */}
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setemailError("");
          }}
          className="w-full mb-2 px-4 py-3 rounded-xl bg-[#111827] text-white border border-blue-900/40
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition placeholder-gray-500"
        />

        {emailError && (
          <p className="text-red-400 text-xs mb-3">{emailError}</p>
        )}

        {/* Buttons */}
        <div className="flex border-t border-blue-900/40 mt-4">

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 text-gray-400 font-medium hover:bg-blue-900/30
            transition active:scale-95"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!email}
            className={`flex-1 py-3 font-medium border-l border-blue-900/40 transition
            ${
              email
                ? "text-blue-400 hover:bg-blue-600 hover:text-white active:scale-95 cursor-pointer"
                : "text-gray-600 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </form>

    </div>
  </div>
);};

export default ForgetPass;
