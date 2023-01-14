import React, { Component } from "react";
import { Link } from "react-router-dom";
import Heading from "../Heading";

type AccountNavState = {
  path: string;
};

export default class AccountNav extends Component<{}, AccountNavState> {
  constructor(props: {}) {
    super(props);
    this.state = { path: window.location.pathname.toString() || "" };
  }

  render() {
    const accountActive = this.state.path === "/account";
    const myOrders = this.state.path === "/orders";
    const myLiked = this.state.path === "/likes";
    return (
      <div className="w-full flex flex-row justify-start gap-6">
        <Link to={"/account"}>
          <Heading
            level="1"
            title="Your Account"
            className={
              accountActive ? "" : "text-opacity-40 hover:text-opacity-100"
            }
          />
        </Link>
        <Link to={"/orders"}>
          <Heading
            level="1"
            title="My Orders"
            className={myOrders ? "" : "text-opacity-40 hover:text-opacity-100"}
          />
        </Link>
        <Link to={"/likes"}>
          <Heading
            level="1"
            title="My Liked"
            className={myLiked ? "" : "text-opacity-40 hover:text-opacity-100"}
          />
        </Link>
      </div>
    );
  }
}
