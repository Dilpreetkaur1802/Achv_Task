import React, { useReducer, useEffect } from "react";
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
    const result = await axios.get(
      `https://mushy-pike-button.cyclic.app/api/orderList`
    );
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
  }, []);

  var i = 1;
  console.log(state);
  return (
    <AdminLayout>
      <BreadCrumbs heading="Orders" />
      <div className="flex justify-between items-center p-4 bg-white shadow-md mx-4 md:mx-6 lg:mx-10">
        <span>Orders</span>
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
                    <th className="px-4 py-2">Order Id</th>
                    <th className="px-4 py-2">User Name</th>
                    <th className="px-4 py-2">Total Amount</th>
                    <th className="px-4 py-2">Paymet Status</th>
                    <th className="px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.map((order) => (
                    <tr key={order._id}>
                      <td className="border px-4 py-2">{i++}</td>
                      <td className="border px-4 py-2">{order._id}</td>
                      <td className="border px-4 py-2">{order.userName}</td>
                      <td className="border px-4 py-2">{order.totalAmount}</td>
                      <td className="border px-4 py-2 text-center">
                        <span className="text-green-400 bg-green-100 px-4 py-2 mx-auto uppercase rounded-sm">
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <Link to={`/admin/orderdetails?id=${order._id}`}>
                          <i className="fa-solid fa-eye text-gray-400"></i>
                        </Link>
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
