import React, { useReducer, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const initialState = {
  loading: true,
  data: [],
  error: "",
};

const ACTIONS = {
  SUCCESS: "FETCH_SUCCESS",
  ERROR: "FETCH_ERROR",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };

    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    default:
      return state;
  }
};

const Products = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const param = new URLSearchParams(window.location.search);
  const categoryId = param.get("categoryId");

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) {
        toast.error("Invalid Category ID");
        return;
      }

      try {
        const result = await axios.get(
          `https://mushy-pike-button.cyclic.app/api/home/productwc/${categoryId}`
        );
        if (result.status === 200) {
          const data = result.data;
          dispatch({ type: ACTIONS.SUCCESS, payload: data });
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Something went wrong");
      }
    };

    fetchData();
  }, [categoryId]);

  console.log(state);
  return (
    <section>
      <div className="my-5">
        <Link to="/"></Link>
      </div>
      <div className="text-center my-4 md:my-8 xl:my-14">
        <h1 className="text-[30px] md:text-[40px] font-[700] text-gray opacity-70">
          Comfy Products
        </h1>
        <div className="underline"></div>
      </div>
      <div className="w-full md:w-[80%] mx-auto">
        {state.data.length !== 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {state.loading ? (
              <div>Loading ...</div>
            ) : state.error ? (
              <div>Error: {state.error}</div>
            ) : (
              state.data.map((products) => {
                return (
                  <article className="m-4">
                    <div className="group relative cursor-pointer bg-black">
                      <img
                        src={products.file}
                        alt=""
                        className="w-full object-cover rounded-sm h-[225px] transition delay-50 ease-linear group-hover:opacity-50"
                      />
                      <Link
                        to={`/details?id=${products._id}`}
                        className="absolute top-[45%] left-[45%] bg-[#A4846D] rounded-[50%] p-2 px-3 opacity-0 group-hover:opacity-100 transition delay-50 ease-linear">
                        <i className="fa-solid fa-magnifying-glass text-white"></i>
                      </Link>
                    </div>
                    <footer className="flex justify-between align-middle my-4">
                      <h5>{products.name}</h5>
                      <p className="text-[#A4846D]">
                        Rs {`${products.price}.00`}
                      </p>
                    </footer>
                  </article>
                );
              })
            )}
            {/* <article className="m-4">
              <div className="group relative cursor-pointer bg-black">
                <img
                  src={img3}
                  alt=""
                  className="w-full object-cover rounded-sm h-[225px] transition delay-150 ease-linear group-hover:opacity-50"
                />
                <Link className="absolute top-[45%] left-[45%] bg-[#A4846D] rounded-[50%] p-2 px-3 opacity-0 group-hover:opacity-100 transition delay-150 ease-linear">
                  <i className="fa-solid fa-magnifying-glass text-white"></i>
                </Link>
              </div>
              <footer className="flex justify-between align-middle my-4">
                <h5>Red Sweater</h5>
                <p className="text-[#A4846D]">Rs 499.00</p>
              </footer>
            </article> */}
          </div>
        ) : (
          <div className="text-center">
            <p className="my-5">No products found</p>
            <Link className="bg-[#a4846d] p-2 text-white" to="/">
              Back <i className="fa-solid fa-home"></i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
