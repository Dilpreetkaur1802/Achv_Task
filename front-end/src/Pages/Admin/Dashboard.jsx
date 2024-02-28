import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import { useAdminContext } from "../../Provider/AdminProvider";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Dashboard() {
  const [cats, setCats] = useState(0);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [orders, setOrders] = useState(0);

  const { isAdminLoggedIn } = useAdminContext();
  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = isAdminLoggedIn();
    if (hasToken === false) {
      navigate("/admin/login");
    }
    try {
      axios
        .get("https://mushy-pike-button.cyclic.app/api/users")
        .then((resp) => {
          if (resp.status === 200) {
            setUsers(resp.data.total);

            axios
              .get("https://mushy-pike-button.cyclic.app/api/products")
              .then((resp) => {
                if (resp.status === 200) {
                  setProducts(resp.data.total);

                  axios
                    .get("https://mushy-pike-button.cyclic.app/api/category")
                    .then((resp) => {
                      if (resp.status === 200) {
                        setCats(resp.data.total);

                        axios
                          .get(
                            "https://mushy-pike-button.cyclic.app/api/orderList"
                          )
                          .then((resp) => {
                            if (resp.status === 200) {
                              setOrders(resp.data.data.length);
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                            toast.error(err.response.data.message);
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error(err.response.data.message);
                    });
                }
              })
              .catch((err) => {
                toast.error(err.message);
              });
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <AdminLayout>
      <div className="container">
        <div className="grid grid-cols-3 space-x-4 space-y-3 mt-4">
          <div className="text-center bg-white rounded-md">
            <Link to="/admin/categories">
              <div className="text-[40px] my-5">{cats}</div>
              <div className="my-4">
                {" "}
                <i className="fa-solid fa-list-ul mx-1"></i>
                Categories
              </div>
            </Link>
          </div>
          <div className="text-center bg-white rounded-md">
            <Link to="/admin/products">
              <div className="text-[40px] my-5">{products}</div>
              <div className="my-4">
                <i className="fa-solid fa-cart-shopping"></i> Products
              </div>
            </Link>
          </div>
          <div className="text-center bg-white rounded-md">
            <Link to="/admin/users">
              <div className="text-[40px] my-5">{users}</div>
              <div className="my-4">
                <i className="fa-solid fa-users"></i> Users
              </div>
            </Link>
          </div>
          <div className="text-center bg-white rounded-md">
            <Link to="/admin/orders">
              <div className="text-[40px] my-5">{orders}</div>
              <div className="my-4">
                <i className="fa-solid fa-bag-shopping"></i> Orders
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AdminLayout>
  );
}
