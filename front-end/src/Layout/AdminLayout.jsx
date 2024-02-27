import React from "react";
import Sidebar from "../Components/Admin/Sidebar";
import HeaderStrip from "../Components/Admin/HeaderStrip";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
        <main className="bg-gray-50">
          <HeaderStrip />
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
