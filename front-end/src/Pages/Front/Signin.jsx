import React, { useReducer } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  email: "",
  password: "",
};

const ACTIONS = {
  LOGIN: "login",
  ERROR: "error",
  RESET: "reset",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { ...state, [action.field]: action.value };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};
const Signin = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const naviagte = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: ACTIONS.LOGIN, field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state.email === "") {
      toast.error("Please enter email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) {
      toast.error("Please enter valid email");
      return;
    }

    if (state.password === "") {
      toast.error("Please enter password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9002/api/users/login",
        state
      );

      if (response.status === 200) {
        localStorage.setItem("userToken", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.data));
        naviagte("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return;
    }
  };

  return (
    <div>
      <header className="p-4 md:px-12 md:py-4">
        <div className="flex justify-end align-center">
          <Link className="signin-button">Signin</Link>
        </div>
        <div className="text-center leading-[61px]">
          <Link to="/">
            <h1 className="border-0 philosopher-bold tracking-tighter text-[#a4846d] opacity-80 text-[59px]">
              nourish
            </h1>
          </Link>
        </div>
      </header>
      <div className="w-[30%] text-center mx-auto flex flex-col justify-center h-[500px]">
        <form action="" onSubmit={handleSubmit}>
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
              type="password"
              className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white transition-colors bg-[#97755c] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-gray-200 px-4 text-sm">
              Sign in
            </button>
          </div>
          <p className="text-sm">
            Don't have an Account?{" "}
            <Link className=" text-red-400 " to="/signup">
              Sign up
            </Link>
          </p>
        </form>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default Signin;
