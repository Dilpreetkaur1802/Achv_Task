import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../../Provider/AdminProvider";

function HeaderStrip() {
  const { toggleSidebar, isMobile } = useAdminContext();
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="w-full flex justify-between md:justify-end p-6 bg-white shadow-md z-999">
      {isMobile && (
        <button onClick={toggleSidebar} className="text-[#A4846D] md:hidden">
          <i className="fa-solid fa-bars"></i>
        </button>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="inline-block text-[#A4846D] hover:-translate-y-1 transition-all duration-500">
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span className="">Logout</span>
        </span>
      </button>
    </div>
  );
}

export default HeaderStrip;
