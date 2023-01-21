import React, { Component } from "react";

import PageContainer from "../components/PageContainer";
import Page from "../components/Page";
import API_AUTH from "../api/auth";
import { IUserLoad } from "../models/user";
import { Link } from "react-router-dom";
import API_ORDER from "../api/order";
import { IOrder, IOrderLoad } from "../models/order";
import OrderConfirm from "../components/OrderConfirm";
import Loader from "../components/Loader";

const BASE_URL = process.env.PUBLIC_URL;

type OrderConfirmationState = {
  user: IUserLoad;
  order: IOrderLoad;
  isFetching: boolean;
  isSuccess: boolean;
};

export default class OrderConfirmation extends Component<
  {},
  OrderConfirmationState
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user: null,
      order: null,
      isFetching: false,
      isSuccess: false,
    };
  }

  async componentDidMount() {
    let paramString = window.location.href.split("?")[1];
    let queryString = new URLSearchParams(paramString);
    const paymentId = queryString.get("payment_intent") as string;
    // console.log(paymentId);
    try {
      this.setState({ isFetching: true });
      const userId = await API_AUTH.getUserId();
      // console.log(userId);
      if (typeof userId === "string") {
        const order = (await API_ORDER.getCompletedOrder(
          userId,
          paymentId
        )) as IOrder;
        this.setState({ order, isSuccess: true });
        // console.log(order);
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
            <div
              className="w-full 
            h-full flex flex-col justify-center items-center gap-6"
            >
              <div className="flex flex-col gap-10 justify-center items-center w-full md:w-1/3">
                <img
                  src={`${BASE_URL}/assets/payment-success.svg`}
                  alt="Successful Payment"
                  className="w-full p-5 md:max-w-[30rem]"
                />
              </div>
              <div className="w-fit flex flex-col gap-10 justify-center items-center">
                <div className="w-full font-Inter flex flex-col gap-4 items-center">
                  <b className="text-2xl">Order Completed!</b>
                  <p className="text-center md:text-left">
                    Your payment was successful and your order was completed!
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2 p-5 bg-white rounded-lg items-start">
                  <OrderConfirm order={this.state.order} />
                </div>
                <div className="w-full flex flex-col justify-between gap-2">
                  <Link
                    to={`/order/${this.state.order?._id?.toString()}`}
                    className="bg-black text-white rounded-full px-2 py-3 mt-6 w-full text-center hover:bg-[#000000ae]"
                  >
                    View Order
                  </Link>
                  <Link
                    to="/shop"
                    className="bg-black text-white rounded-full px-2 py-3 mt-6 w-full text-center hover:bg-[#000000ae]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </Page>
    );
  }
}
