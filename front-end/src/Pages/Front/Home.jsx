import React, { useReducer, useEffect, useState } from "react";
import Header from "../../Components/Front/Header";
import Navbar from "../../Components/Front/Navbar";
import img from "../../Public/hero-bcg.a876f19f6786a3aca992.jpeg";
import img2 from "../../Public/hero-bcg-2.789918645915c8acb36f.jpeg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

const initialState = {
  loading: true,
  data: [],
  error: "",
  pageCount: 0,
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
        pageCount: Math.ceil(action.payload.totalPages),
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

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = async (pageNumber = 0) => {
    try {
      const result = await axios.get(
        `https://mushy-pike-button.cyclic.app/api/home/productswPage?page=${pageNumber}`
      );
      if (result.status === 200) {
        const data = result.data;
        return data;
      } else {
        return;
      }
    } catch (error) {
      console.log("Error", error.message);
      toast.error("Something went wrong");
      return;
    }
  };

  useEffect(() => {
    const fetchDataAndDispatch = async () => {
      try {
        const data = await fetchData(currentPage);

        dispatch({ type: ACTIONS.SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ACTIONS.ERROR, payload: error.message });
      }
    };

    fetchDataAndDispatch();
  }, [currentPage]);

  const handlePageChange = ({ selected }) => {
    const nextPage = selected + 1;
    setCurrentPage(nextPage);
  };
  console.log(currentPage);
  return (
    <div>
      <section className="h-fit bg-[#A4846D]">
        <Header> </Header>
        <Navbar />
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 align-middle py-6 pb-14">
            <div>
              <div className="w-full xl:w-[70%] p-4 md:p-8 xl:p-0">
                <h1 className="text-[30px] lg:text-[40px] font-[700] text-white opacity-80 my-2 md:my-4 lg:my-8 lg:mb-4">
                  Design Your <br /> Comfort Zone
                </h1>
                <p className="text-gray opacity-70 text-[18px]">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Similique deserunt voluptatibus et saepe possimus odit sint,
                  delectus, voluptatem deleniti sed enim explicabo amet
                  accusantium quo officia ab omnis exercitationem aperiam.
                  delectus, voluptatem deleniti sed enim explicabo amet
                  accusantium quo officia ab omnis exercitationem aperiam.
                </p>
              </div>
            </div>
            <div className="hidden lg:block p-0 md:p-4 lg:p-4 xl:p-0">
              <img
                src={img}
                alt=""
                className="w-[100%] h-[440px] object-cover rounded-md relative"
              />
              <img
                src={img2}
                alt=""
                className="lg:hidden xl:block absolute w-[280px] h-[200px] object-cover bottom-4 right-[40%] rounded-md"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="text-center my-4 md:my-8 xl:my-14">
          <h1 className="text-[30px] md:text-[40px] font-[700] text-gray opacity-70">
            Comfy Products
          </h1>
          <div className="underline"></div>
        </div>
        <div className="w-full md:w-[80%] mx-auto">
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
          <div className="mb-5">
            {state.pageCount > 1 && (
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            )}
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
