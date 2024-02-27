import React, { useEffect, useReducer } from "react";
import AdminLayout from "../../../Layout/AdminLayout";
import BreadCrumbs from "../../../Components/Admin/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const fetchData = async (orderId) => {
  try {
    const result = await axios.get(
      `http://localhost:9002/api/orderDeatils/${orderId}`
    );
    const data = result.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

const Details = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const parms = new URLSearchParams(window.location.search);
  const orderId = parms.get("id");

  useEffect(() => {
    const fetchDataAndDispatch = async () => {
      try {
        const data = await fetchData(orderId);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchDataAndDispatch();
  }, []);
  return (
    <AdminLayout>
      <BreadCrumbs heading="Order Details" />
      <div className="container p-4 bg-white my-2">
        {state.data.map((order) => (
          <span className="flex flex-col space-y-3">
            <div>Order Id: {order._id}</div>
            <div>
              Payment Status:{" "}
              <span className="text-green-400 bg-green-100 px-4 py-2 mx-auto uppercase rounded-sm">
                {order.paymentStatus}
              </span>
            </div>
            <div>Total Amount: {order.totalAmount} Rs</div>
            <div>User: {order.userName}</div>
            <div>User Email : {order.user.email}</div>
            {order.products.map((product) => (
              <span className="flex flex-col space-y-3">
                <div>Product Name: {product.name}</div>
                <div>Product Quantity: {product.quantity}</div>
                <div>Product Price: {product.price}</div>
              </span>
            ))}
          </span>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Details;
