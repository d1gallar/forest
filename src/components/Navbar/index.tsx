import React, { Component } from "react";
import { Link } from "react-router-dom";
import API_AUTH from "../../api/auth";
import API_CART from "../../api/cart";
import { ICartLoad } from "../../models/cart";
import { ICartItem } from "../../models/cartItem";

import NavTab from "../NavTab";
import SearchButton from "../SearchButton";

const SM_BREAKPT = 640; // SM Width Breakpoint (px)
const BASE_URL = process.env.PUBLIC_URL;

const calculateQuantityPerItem = (items: ICartItem[]) => {
  let totalItems = 0;
  items.forEach(item => {
    totalItems += item.quantity
  })
  if(totalItems > 99) return "99+";
  return totalItems.toString();
}

type NavProp = {
  handleSearch: (toggleSearch: boolean) => void;
};

type NavState = {
  width: Number;
  collapse: boolean;
  cart: ICartLoad;
};

class Navbar extends Component<NavProp, NavState> {
  constructor(props: NavProp) {
    super(props);
    this.state = {
      width: window.innerWidth,
      collapse: false,
      cart: null,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  renderInnerTabs() {
    if (this.state.width < SM_BREAKPT) return null;
    return (
      <div className="flex justify-between items-center font-Inter text-sm font-medium">
        <NavTab path="/" name="Home" />
        <NavTab path="/shop" name="Shop" />
        <NavTab path="/contact" name="Contact" />
      </div>
    );
  }

  renderAccount() {
    if (this.state.width < SM_BREAKPT) return null;
    return (
      <Link to="/account">
        <img
          className="scale-125 md:scale-100"
          src={`${BASE_URL}/assets/user-account.svg`}
          alt="User Account Icon"
        />
      </Link>
    );
  }

  renderCollapse() {
    this.setState({ collapse: !this.state.collapse });
  }

  renderHamburger() {
    if (this.state.width > SM_BREAKPT) return null;
    return (
      <button onClick={() => this.renderCollapse()}>
        <img
          className="scale-125 md:scale-100"
          src={`${BASE_URL}/assets/bar-icon.svg`}
          alt="Collapsable Icon"
        />
      </button>
    );
  }

  async componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    const userId = await API_AUTH.getUserId();
    if (typeof userId !== "string") return;
    console.log("userId", userId);
    const cart = await API_CART.getCartByUserId((userId as string).toString());
    this.setState({ cart });
    console.log(cart);
  }

  handleResize() {
    this.setState({ width: window.innerWidth });
    if (this.state.width > SM_BREAKPT) this.setState({ collapse: false });
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <nav className="w-full">
          <div
            className={`bg-white flex justify-between w-full h-16 md:h-12 z-50 ${
              this.state.collapse ? "" : "shadow-lg shadow-black-500"
            }`}
          >
            <Link
              to="/"
              className="flex justify-between gap-2.5 items-center pl-12 flex-grow-0 shrink-0"
            >
              <span>
                <img
                  className="scale-125 md:scale-100"
                  src={`${BASE_URL}/assets/plant-logo.svg`}
                  alt="Forest Leaf Logo"
                />
              </span>
              <span>
                <p className="font-SansThai text-black font-medium leading-5 text-2xl md:text-lg">
                  forest
                </p>
              </span>
            </Link>
            {this.renderInnerTabs()}
            <div className="flex justify-end items-center gap-6 pr-12">
              <SearchButton handleSearch={this.props.handleSearch} />
              <div className="relative">
                <Link to="/cart">
                  <img
                    className="scale-125 md:scale-100"
                    src={`${BASE_URL}/assets/shopping-cart.svg`}
                    alt="Shopping Cart Icon"
                  />
                  {this.state.cart && this.state.cart.items.length > 0 && (
                    <span className="absolute w-fit min-w-[0.7rem] h-fit top-[-.2rem] left-2/3 bg-black rounded-full z-50">
                      <p className="text-white text-center font-Inter font-bold text-[.4rem] mt-[.04rem] px-[.1rem]">
                        {calculateQuantityPerItem(this.state.cart.items)}
                      </p>
                    </span>
                  )}
                </Link>
              </div>
              {this.renderAccount()}
              {this.renderHamburger()}
            </div>
          </div>
          {this.state.collapse && (
            <div
              className={`w-full h-fit flex flex-col bg-white ${
                this.state.collapse ? "shadow-lg shadow-black-500" : ""
              }`}
            >
              <div className="w-full flex flex-row justify-center items-center p-5 font-medium text-lg text-[#0000003f]">
                <NavTab path="/" name="Home" />
              </div>

              <div className="w-full flex flex-row justify-center items-center p-5 font-medium text-lg text-[#0000003f] hover:text-black">
                <NavTab path="/shop" name="Shop" />
              </div>
              <div className="w-full flex flex-row justify-center items-center p-5 font-medium text-lg text-[#0000003f] hover:text-black">
                <NavTab path="/contact" name="Contact" />
              </div>
              <div className="w-full flex flex-row justify-center items-center p-5 font-medium text-lg text-[#0000003f] hover:text-black">
                <NavTab path="/account" name="Account" />
              </div>
            </div>
          )}
        </nav>
      </React.Fragment>
    );
  }
}

export default Navbar;
