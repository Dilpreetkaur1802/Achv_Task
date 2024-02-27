import React, { useReducer, useEffect, useState } from "react";
import AdminLayout from "../../../Layout/AdminLayout";
import BreadCrumbs from "../../../Components/Admin/Breadcrumb";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

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
      `http://localhost:9002/api/category?page=${page}`
    );
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

const Home = () => {
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

  var i = 1;

  const deleteCategory = async (categoryID) => {
    if (!categoryID) {
      toast.error("Invalid category ID");
      return;
    }
    await axios
      .delete(`http://localhost:9002/api/category/${categoryID}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Category deleted Successfully!");
          setRefresh((prev) => !prev);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log("Error!");
        toast.error(error.response.data.message);
      });
  };

  const handleDelete = (categoryId) => {
    if (!categoryId) {
      toast.error("Please proide category Id");
      return;
    }

    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to Delete?",
      buttons: [
        {
          label: "yes",
          onClick: () => {
            deleteCategory(categoryId);
          },
        },
        {
          label: "No",
          onClick: () => console.log("Deletion canceled"),
        },
      ],
    });
  };

  return (
    <AdminLayout>
      <BreadCrumbs heading="Category" />
      <div className="flex justify-between items-center p-4 bg-white shadow-md mx-4 md:mx-6 lg:mx-10">
        <span>Category</span>
        <span>
          <Link
            to="/admin/addcategories"
            className="py-2 text-sm font-semibold text-white transition-colors bg-[#A4846D] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-gray-200 px-4">
            <i className="fa-solid fa-plus"></i> Add
          </Link>
        </span>
      </div>
      <div className="container">
        <div className="table-container">
          {state.loading ? (
            <div>Loading...</div>
          ) : state.error ? (
            <div>Error: {state.error}</div>
          ) : (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.map((category) => (
                    <tr key={category._id}>
                      <td className="border px-4 py-2">{i++}</td>
                      <td className="border px-4 py-2">{category.name}</td>
                      <td className=" border px-4 py-2 flex items-center justify-start space-x-5">
                        <Link to={`/admin/editcategories?id=${category._id}`}>
                          <i className="fa-regular fa-pen-to-square text-blue-400"></i>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(category._id);
                          }}>
                          <i className="fa-solid fa-trash text-red-400"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </AdminLayout>
  );
};

export default Home;
