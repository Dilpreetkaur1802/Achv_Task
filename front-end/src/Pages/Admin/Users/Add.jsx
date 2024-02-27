import React, { useReducer } from "react";
import AdminLayout from "../../../Layout/AdminLayout";
import BreadCrumbs from "../../../Components/Admin/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const initialState = {
  name: "",
  error: "",
};

const ACTIONS = {
  ADD: "add",
  ERROR: "error",
  RESET: "reset",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        [action.field]: action.value,
      };
    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
};

const Add = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: ACTIONS.ADD, field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.name === "") {
      toast.error("Please enter User name");
      return;
    }
    if (!isNaN(state.name)) {
      toast.error("Please enter valid name");
      return;
    }

    try {
      const data = await axios.post(`http://localhost:9002/api/users/`, state);
      if (data.status === 200) {
        toast.success("User Added");
        setTimeout(() => {
          navigate("/admin/users");
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <AdminLayout>
      <BreadCrumbs heading="Users" />
      <div className="flex justify-between items-center p-4 bg-white shadow-md mx-4 md:mx-6 lg:mx-10">
        <span>Add User</span>
        <span>
          <Link
            to="/admin/users"
            className="py-2 text-sm font-semibold text-white transition-colors bg-[#A4846D] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-gray-200 px-4">
            <i className="fa-solid fa-list-ul"></i> Users
          </Link>
        </span>
      </div>
      <div className="p-4 bg-white mx-4 md:mx-6 lg:mx-10 my-2">
        <form action="">
          <div className="grid space-x-2">
            <div className="mb-5">
              <input
                type="text"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="name"
                placeholder="Name"
                value={state.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <input
                type="email"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="email"
                placeholder="Email"
                value={state.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <input
                type="number"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="mobile"
                placeholder="Mobile"
                value={state.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <button
                type="submit"
                onClick={handleSubmit}
                className=" py-3 font-semibold text-white transition-colors bg-[#97755c] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-gray-200 px-4 text-sm">
                Add User
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer autoClose={2000} />
    </AdminLayout>
  );
};

export default Add;
