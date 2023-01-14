import React, { Component } from "react";
import API_AUTH from "../../api/auth";
import API_ORDER from "../../api/order";
import { IOrder } from "../../models/order";
import Heading from "../Heading";
import Loader from "../Loader";
import OrderCard from "../OrderCard";

type OrderListState = {
  orders: Array<IOrder>;
  isFetching: boolean;
};

export default class OrderList extends Component<{}, OrderListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      orders: [],
      isFetching: false,
    };
  }

  async componentDidMount() {
    try {
      this.setState({ isFetching: true });
      const userId = await API_AUTH.getUserId();
      if (typeof userId === "string") {
        const orders: Array<IOrder> = await API_ORDER.getOrdersByUserIdSorted(
          userId
        );
        this.setState({ orders, isFetching: false });
      }
    } catch (error) {
      this.setState({ orders: [] });
    }
  }

  render() {
    if (this.state.isFetching)
      return (
        <div className="w-full h-[80vh] flex flex-row justify-center items-center">
          <Loader />
        </div>
      );
    return (
      <div className="flex flex-col gap-2 w-full h-auto rounded-lg bg-white p-5 md:p-10">
        {this.state.orders.length === 0 && !this.state.isFetching ? (
          <React.Fragment>
            <Heading level="2" title="No Orders" />
            <p className="font-Inter font-medium text-base text-[#898989]">
              You have not placed any orders yet.
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Heading level="2" title="Your Past Orders" />
            <div className="flex flex-col gap-4">
              {this.state.orders.map((order) => {
                return <OrderCard order={order} key={order._id?.toString()} />;
              })}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
