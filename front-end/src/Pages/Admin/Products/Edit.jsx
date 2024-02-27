import React, { useReducer, useEffect, useState } from "react";
import AdminLayout from "../../../Layout/AdminLayout";
import BreadCrumbs from "../../../Components/Admin/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const initialState = {
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  file: null,
  category: [], // Initialize as an empty array
  error: "",
};
const ACTIONS = {
  INPUT_CHANGE: "INPUT_CHANGE",
  IMAGE_CHANGE: "IMAGE_CHANGE",
  CATEGORY_CHANGE: "CATEGORY_CHANGE",
  ERROR: "error",
  RESET: "RESET",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "IMAGE_CHANGE":
      return {
        ...state,
        file: action.image,
      };
    case "CATEGORY_CHANGE":
      return {
        ...state,
        category: action.category,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const Edit = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [categoryData, setCategoryData] = useState([]);
  const [prevImage, setprevImage] = useState("");
  const navigate = useNavigate();

  const parms = new URLSearchParams(window.location.search);
  const productId = parms.get("id");

  useEffect(() => {
    if (!productId) {
      toast.error("Invalid category Id");
      return;
    }
    const getProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9002/api/products/${productId}`
        );

        if (response.status === 200) {
          const { name, price, quantity, category, file, description } =
            response.data.data;
          dispatch({ type: ACTIONS.INPUT_CHANGE, field: "name", value: name });
          dispatch({
            type: ACTIONS.INPUT_CHANGE,
            field: "description",
            value: description,
          });
          dispatch({
            type: ACTIONS.INPUT_CHANGE,
            field: "quantity",
            value: quantity,
          });
          dispatch({
            type: ACTIONS.INPUT_CHANGE,
            field: "price",
            value: price,
          });
          dispatch({
            type: ACTIONS.CATEGORY_CHANGE,
            category,
          });
          setprevImage(file);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.response.data.message);
      }
    };
    const getCategories = async () => {
      try {
        const result = await axios.get("http://localhost:9002/api/category");
        if (result.status === 200) {
          setCategoryData(result.data.data);
        } else {
          toast.error("Something went wrong");
          return;
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.response.data.message);
        return;
      }
    };

    getProductData();
    getCategories();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: ACTIONS.INPUT_CHANGE, field: name, value });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    dispatch({ type: ACTIONS.IMAGE_CHANGE, image });
  };

  const handleCategoryChange = (e) => {
    const category = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    dispatch({ type: ACTIONS.CATEGORY_CHANGE, category });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();

      formData.append("name", state.name);
      formData.append("price", state.price);
      formData.append("quantity", state.quantity);
      formData.append("description", state.description);
      formData.append("file", state.file);
      formData.append("category", state.category);

      const data = await axios.put(
        `http://localhost:9002/api/products/${productId}`,
        formData
      );
      if (data.status === 200) {
        toast.success("Product Updated");
        setTimeout(() => {
          navigate("/admin/products");
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <AdminLayout>
      <BreadCrumbs heading="Products" />
      <div className="flex justify-between items-center p-4 bg-white shadow-md mx-4 md:mx-6 lg:mx-10">
        <span>Edit Products</span>
        <span>
          <Link
            to="/admin/products"
            className="py-2 text-sm font-semibold text-white transition-colors bg-[#A4846D] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-gray-200 px-4">
            <i className="fa-solid fa-cart-shopping"></i> Products
          </Link>
        </span>
      </div>
      <div className="p-4 bg-white mx-4 md:mx-6 lg:mx-10 my-2">
        <form action="">
          <div className="grid grid-cols-1 md:grid-cols-2 space-x-2">
            <div className="mb-5">
              <input
                type="text"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="name"
                placeholder="Name"
                value={state.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-5">
              <input
                type="number"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="price"
                min={0}
                placeholder="Price"
                value={state.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-5">
              <select
                value={state.category}
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="category"
                onChange={handleCategoryChange}
                multiple>
                {categoryData.map((cats) => (
                  <option key={cats._id} value={cats._id}>
                    {cats.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleInputChange}
                value={state.description}
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                rows="3"></textarea>
            </div>
            <div className="mb-5">
              <input
                type="number"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="quantity"
                min={0}
                placeholder="Quantity"
                value={state.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-5">
              <input
                type="file"
                className="w-full px-4 py-3 border placeholder:text-gray-400 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                name="file"
                placeholder="File"
                onChange={handleImageChange}
              />
              <div>
                <img
                  className="w-[100px] h-[100px] mt-2"
                  src={`${prevImage}`}
                  alt=""
                />
              </div>
            </div>

            <div className="mb-5">
              <button
                type="submit"
                onClick={handleSubmit}
                className=" py-3 font-semibold text-white transition-colors bg-[#97755c] rounded-md hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-gray-200 px-4 text-sm">
                Edit Product
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </AdminLayout>
  );
};

export default Edit;
