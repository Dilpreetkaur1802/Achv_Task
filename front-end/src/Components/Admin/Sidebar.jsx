import React from "react";
import { Link } from "react-router-dom";
import { useAdminContext } from "../../Provider/AdminProvider";

function Sidebar() {
  const { isMobile, isSidebarOpen, toggleSidebar } = useAdminContext();

  return (
    <div
      className={`fixed z-[111] md:static flex-0 top-0 left-0 w-72 h-screen bg-[#A4846D] text-[#D4BFAE] duration-300 ease-linear p-4 ${
        isMobile
          ? isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          : "translate-x-0"
      }`}>
      {isMobile && (
        <button onClick={toggleSidebar} className="text-white">
          {isSidebarOpen ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </button>
      )}
      <div className="w-full">
        <div className="p-4 pt-0">
          <Link
            className="text-[40px] font-[700] tracking-[4.5px] philosopher-bold border-t-[1px] border-b-[1px] border-white"
            to="/">
            Noruish
          </Link>
        </div>
        <ul className="w-full flex flex-col items-start p-4 flex-1">
          <li className="my-2 p-2 text-white cursor-pointer w-full hover:bg-white hover:font-semibold hover:text-[#A4846D] transition duration-300 rounded-sm">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-table"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="my-2 p-2 text-white cursor-pointer w-full hover:bg-white hover:font-semibold hover:text-[#A4846D] transition duration-300 rounded-sm">
            <Link
              to="/admin/products"
              className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Products</span>
            </Link>
          </li>
          <li className="my-2 p-2 text-white cursor-pointer w-full hover:bg-white hover:font-semibold hover:text-[#A4846D] transition duration-300 rounded-sm">
            <Link
              to="/admin/categories"
              className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-list-ul"></i>
              <span>Category</span>
            </Link>
          </li>
          <li className="my-2 p-2 text-white cursor-pointer w-full hover:bg-white hover:font-semibold hover:text-[#A4846D] transition duration-300 rounded-sm">
            <Link to="/admin/users" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-users"></i>
              <span>User</span>
            </Link>
          </li>
          <li className="my-2 p-2 text-white cursor-pointer w-full hover:bg-white hover:font-semibold hover:text-[#A4846D] transition duration-300 rounded-sm">
            <Link to="/admin/orders" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Orders</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
