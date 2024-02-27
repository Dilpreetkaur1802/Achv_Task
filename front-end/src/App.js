import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Front/Home";
import Description from "./Pages/Front/Description";
import Products from "./Pages/Front/Products";
import Signin from "./Pages/Front/Signin";
import Signup from "./Pages/Front/Signup";
import Login from "./Pages/Admin/Login";
import Dashboard from "./Pages/Admin/Dashboard";
import UserHome from "./Pages/Admin/Users/Home";
import AddUser from "./Pages/Admin/Users/Add";
import UserEdit from "./Pages/Admin/Users/Edit";
import OrdersHome from "./Pages/Admin/Orders/Home";
import Details from "./Pages/Admin/Orders/Deatils";
import CategoriesHome from "./Pages/Admin/Categories/Home";
import AddCategory from "./Pages/Admin/Categories/Add";
import EditCategory from "./Pages/Admin/Categories/Edit";
import ProductHome from "./Pages/Admin/Products/Home";
import AddProducts from "./Pages/Admin/Products/Add";
import EditProducts from "./Pages/Admin/Products/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/details" element={<Description />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductHome />} />
        <Route path="/admin/addproducts" element={<AddProducts />} />
        <Route path="/admin/editproducts" element={<EditProducts />} />
        <Route path="/admin/categories" element={<CategoriesHome />} />
        <Route path="/admin/addcategories" element={<AddCategory />} />
        <Route path="/admin/editcategories" element={<EditCategory />} />
        <Route path="/admin/users" element={<UserHome />} />
        <Route path="/admin/addusers" element={<AddUser />} />
        <Route path="/admin/editusers" element={<UserEdit />} />
        <Route path="/admin/orders" element={<OrdersHome />} />
        <Route path="/admin/orderdetails" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
