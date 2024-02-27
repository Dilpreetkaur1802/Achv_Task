import React from "react";
import { Link } from "react-router-dom";

function Breadcrumb({ heading }) {
  return (
    <div className="p-4 flex justify-between mt-6 px-4 md:px-6 xl:px-10">
      <span>
        <h1 className="font-bold text-[15px] capitalize text-[#A4846D]">
          <Link to="/admin/dashboard">Dashboard / </Link> {heading}
        </h1>
      </span>
      <span></span>
    </div>
  );
}

export default Breadcrumb;
