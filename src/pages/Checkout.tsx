import React, { Component } from "react";

import PageContainer from "../components/PageContainer";
import Heading from "../components/Heading";
import Loader from "../components/Loader";
import Page from "../components/Page";
import API_AUTH from "../api/auth";
import API_CART from "../api/cart";
import API_USER from "../api/user";
import { ICart, ICartLoad } from "../models/cart";
import { IUser, IUserLoad } from "../models/user";
import CheckoutForm from "../components/CheckoutForm";

type CheckoutState = {
  cart: ICartLoad;
  user: IUserLoad;
  isFetching: boolean;
  isSuccess: boolean;
};

export default class Checkout extends Component<{}, CheckoutState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      cart: null,
      user: null,
      isFetching: false,
      isSuccess: false,
    };

    this.updateCart = this.updateCart.bind(this);
  }

  updateCart(cart: ICart) {
    this.setState({cart});
  }

  async componentDidMount() {
    try {
      this.setState({ isFetching: true });
      const userId = await API_AUTH.getUserId();
      if (typeof userId === "string") {
        const user = (await API_USER.getUserById(userId)) as Object;
        if (Object.keys(user).includes("_id")) {
          const responseUser = { ...user } as IUser;
          const cart = (await API_CART.getPopulatedCart(
            responseUser._id.toString()
          )) as ICart;
          this.setState({ user: responseUser, isSuccess: true, cart });
        } else {
          this.setState({ isSuccess: false });
          throw new Error("Failed to retrieve user");
        }
      } else {
        throw new Error("Failed to retrieve userId.");
      }
      this.setState({ isFetching: false });
    } catch (error) {
      this.setState({ isSuccess: false });
      window.location.href = "/login";
    }
  }

  render() {
    return (
      <Page>
        <PageContainer>
          {this.state.isFetching ? (
            <div className="w-full h-[80vh] flex flex-row justify-center items-center">
              <Loader />
            </div>
          ) : (
            <React.Fragment>
              <Heading level="1" title="Checkout" />
              <CheckoutForm cart={this.state.cart} updateCart={this.updateCart}/>
            </React.Fragment>
          )}
        </PageContainer>
      </Page>
    );
  }
}
