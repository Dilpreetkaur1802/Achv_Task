import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const userDataString = sessionStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  return (
    <header className="p-4 md:px-12 md:py-4">
      <div className="flex justify-end align-center">
        {!userData ? (
          <Link to="/login" className="signin-button">
            Signin
          </Link>
        ) : (
          <button className="signin-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <div className="text-center leading-[61px]">
        <Link to="/">
          <h1 className="border-0 philosopher-bold tracking-tighter text-white opacity-80 text-[59px]">
            nourish
          </h1>
        </Link>
      </div>
    </header>
  );
}
