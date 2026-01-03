import React from "react";

export const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        {/* animated spinner */}
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* message */}
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};
