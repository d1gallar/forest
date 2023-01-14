import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Product from "./pages/Product";
import Order from "./pages/Order";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserAuth from "./components/UserAuth";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Receipt from "./pages/Receipt";
import Likes from "./pages/Like";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/shop/products/:id" element={<Product />}></Route>
          <Route
            path="/cart"
            element={
              <UserAuth>
                <Cart />
              </UserAuth>
            }
          ></Route>
          <Route
            path="/account"
            element={
              <UserAuth>
                <Account />
              </UserAuth>
            }
          ></Route>
          <Route
            path="/orders"
            element={
              <UserAuth>
                <Order />
              </UserAuth>
            }
          ></Route>
          <Route
            path="/order/:id"
            element={
              <UserAuth>
                <Receipt />
              </UserAuth>
            }
          ></Route>
          <Route
            path="/likes"
            element={
              <UserAuth>
                <Likes />
              </UserAuth>
            }
          ></Route>
          <Route
            path="/checkout"
            element={
              <UserAuth>
                <Checkout />
              </UserAuth>
            }
          ></Route>
          <Route
            path="/checkout/complete"
            element={
              <UserAuth>
                <OrderConfirmation />
              </UserAuth>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
