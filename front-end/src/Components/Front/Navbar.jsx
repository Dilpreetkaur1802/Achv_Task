import React, { useReducer, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

const initialState = {
  loading: true,
  data: [],
  error: "",
  pageCount: 0,
  currentPage: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        pageCount: Math.ceil(action.payload.total / 1),
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case "CHANGE_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

const fetchData = async (page) => {
  try {
    const result = await axios.get(
      `https://mushy-pike-button.cyclic.app/api/category`
    );
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default function Navbar() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchDataAndDispatch = async () => {
      try {
        const data = await fetchData(state.currentPage);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchDataAndDispatch();
  }, [state.currentPage, refresh]);

  return (
    <nav className="px-2 md:px-4 xl:px-10 flex w-full">
      <div className="border-t-[1px] border-b-[1px] border-white w-[50%] md:w-[80%] lg:w-[90%]">
        <ul className="hidden md:flex flex-wrap justify-center md:space-x-5 md:text-sm lg:space-x-20 align-middle my-2">
          {state.data.map((category) => (
            <li className="text-white" key={category._id}>
              <Link to={`/products?categoryId=${category._id}`}>
                {category.name || <Skeleton />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-[50%] md:w-[20%] lg:w-[10%] border-t-[1px] border-b-[1px] border-white">
        <ul className="flex align-middle justify-center space-x-3 my-2">
          <li>
            <Link>
              <i className="fa-brands fa-instagram text-white"></i>
            </Link>
          </li>
          <li>
            <Link>
              <i className="fa-brands fa-facebook-f text-white"></i>
            </Link>
          </li>
          <li>
            <Link>
              <i className="fa-brands fa-twitter text-white"></i>
            </Link>
          </li>
        </ul>
        {/* <button></button> */}
      </div>
    </nav>
  );
}
