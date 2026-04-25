const CustomToolTip = ({ text, children }) => {
  return (
    <div className="relative inline-block">
      <div className="peer cursor-pointer">
        {children}
      </div>

      <span
        className="
        absolute -top-10 left-1/2 -translate-x-1/2
        opacity-0 peer-hover:opacity-100 peer-hover:-translate-y-1
        transition-all duration-200 ease-out
        bg-white text-gray-700 text-xs font-medium
        px-3 py-1.5 rounded-lg
        shadow-lg border border-gray-200
        whitespace-nowrap z-50
      "
      >
        {text}

        {/* Arrow */}
        <span
          className="
          absolute left-1/2 -bottom-1 -translate-x-1/2
          w-2 h-2 bg-white rotate-45
          border-r border-b border-gray-200
        "
        ></span>
      </span>
    </div>
  );
};

export default CustomToolTip;