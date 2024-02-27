import React, { useReducer, useEffect, useState } from "react";
import AdminLayout from "../../../Layout/AdminLayout";
import BreadCrumbs from "../../../Components/Admin/Breadcrumb";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";

const initialState = {
  loading: true,
  data: [],
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    default:
      return state;
  }
};

const fetchData = async (page) => {
  try {
    const result = await axios.get(`http://localhost:9002/api/users`);
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
      .delete(`http://localhost:9002/api/users/${categoryID}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success("User deleted Successfully!");
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
      <BreadCrumbs heading="Users" />
      <div className="flex justify-between items-center p-4 bg-white shadow-md mx-4 md:mx-6 lg:mx-10">
        <span>Users</span>
        <span>
          <Link
            to="/admin/addusers"
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
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Mobile</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.map((user) => (
                    <tr key={user._id}>
                      <td className="border px-4 py-2">{i++}</td>
                      <td className="border px-4 py-2">{user.name}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.mobile}</td>
                      <td className=" border px-4 py-2 flex items-center justify-start space-x-5">
                        <Link to={`/admin/editusers?id=${user._id}`}>
                          <i className="fa-regular fa-pen-to-square text-blue-400"></i>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(user._id);
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
