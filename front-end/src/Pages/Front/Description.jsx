import axios from "axios";
import React, { useReducer, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  loading: true,
  data: "",
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

export default function Description() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const param = new URLSearchParams(window.location.search);
  const productId = param.get("id");

  const userDataString = sessionStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `https://mushy-pike-button.cyclic.app/api/home/products/${productId}`
        );
        if (result.status === 200) {
          const data = result.data;
          dispatch({ type: ACTIONS.SUCCESS, payload: data });
        } else {
          dispatch({ type: ACTIONS.ERROR, payload: result.data.message });
        }
      } catch (error) {
        console.log("Error", error.message);
      }
    };

    fetchData();
  }, [productId]);
  const color = state.data.quantity ? "green" : "red";

  async function loadScript(src) {
    if (!src) {
      alert("No script url found!, Please pass the URL");
      return;
    } else {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    }
  }

  const order_amount = state.data.price;
  const product = {
    product: state.data._id,
    quantity: state.data.quantity,
    price: state.data.price,
  };

  const displayRazorpay = async () => {
    if (!userData) {
      toast.error("Plese Login to Proceed");
      return;
    }

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failded to load!");
      return;
    }

    const rand = Math.floor(Math.random() * 1000000);

    // Ensure order_amount is a valid number
    if (!order_amount || isNaN(order_amount)) {
      toast.error("Invalid order amount!");
      return;
    }

    // Convert amount to paisa
    const amountInPaisa = Math.floor(order_amount * 100);

    const data = {
      amount: amountInPaisa, // Passing amount in paisa
      currency: "INR",
      receipt: `receipt_order_${rand}`,
    };

    // creating an order
    const orderResult = await axios.post(
      "https://mushy-pike-button.cyclic.app/api/orders",
      data
    );

    if (!orderResult) {
      toast.error("Couldn't create orders");
      return;
    }

    let { amount, id, currency } = orderResult.data.data;

    const options = {
      key: "rzp_test_wN6bb7sXiEXdOU",
      amount: amount, // No need to multiply by 100 again
      currency: currency,
      name: "nourish",
      description: "Testing our integration",
      order_id: id,
      handler: async function (response) {
        const paymentData = {
          orderCreationId: id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          userId: userData._id,
          products: product,
          totalAmount: amount,
        };

        const result = await axios
          .post("https://mushy-pike-button.cyclic.app/api/success", paymentData)
          .then((response) => {
            if (response.status === 200) {
              toast.success("Order Placed Successfully!");
            } else {
              toast.error("Payment Failed!");
            }
          })
          .catch((error) => {
            console.log("Error in payment:", error.message);
            toast.error("Payment Failed! Please try again later.");
            return;
          });
      },
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.mobile,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("userToken");
    window.location.reload();
  };
  console.log(state);
  return (
    <div className="h-fit">
      <header className="p-4 md:px-12 md:py-4">
        <div className="flex justify-end align-center">
          {!userData ? (
            <Link
              to="/login"
              style={{ color: "#a4846d", borderColor: "#a4846d" }}
              className="signin-button">
              Signin
            </Link>
          ) : (
            <button
              className="signin-button"
              style={{ color: "#a4846d", borderColor: "#a4846d" }}
              onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
        <div className="text-center leading-[61px]">
          <Link to="/">
            <h1 className="border-0 philosopher-bold tracking-tighter text-[#a4846d] opacity-80 text-[59px]">
              nourish
            </h1>
          </Link>
        </div>
      </header>
      <div className="h-fit bg-[#a4846d] flex">
        <div className="container p-3 text-white  ">
          <Link to="/" className="text-white">
            Home
          </Link>{" "}
          / {state.data.name}
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 space-x-8 h-screen">
        <div className="h-screen">
          {state.loading ? (
            <Skeleton height={220} className="my-4 md:my-8 xl:my-14 mx-auto" />
          ) : (
            <img
              src={state.data.file}
              alt=""
              className="w-[100%] object-contain h-[500px] my-4 md:my-8 xl:my-14 mx-auto"
            />
          )}
        </div>
        <div className="h-fit my-4 md:my-8 xl:my-14">
          <h1 className="my-auto text-[40px] font-[700]">
            {state.data.name || <Skeleton />}
          </h1>
          <p className="text-[#A4846D] text-xl font-bold">
            Rs {state.data.price || <Skeleton />}.00
          </p>
          <p className="my-4 md:my-8 ">
            {state.data.description || <Skeleton />}
          </p>
          <h4 className="font-bold">
            Available:{" "}
            <span
              className={`font-semibold text-${color}-400 ms-4`}
              style={{ color: color }}>
              {state.data.quantity ? "In-Stock" : "Out of Stock"}
            </span>
          </h4>
          {state.data.quantity ? (
            <button
              onClick={displayRazorpay}
              className="px-8 py-2 bg-[#a4846d] text-white mt-10 transition delay-100 rounded-md hover:-translate-y-1">
              Buy Now
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
