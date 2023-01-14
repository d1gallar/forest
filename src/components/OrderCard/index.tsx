import React, { Component } from "react";
import { Link } from "react-router-dom";
import { IOrder } from "../../models/order";
import { formatDateToWMDY } from "../../util";
import OrderItem from "../OrderItem";

type OrderCardProps = {
  order: IOrder;
};

export default class OrderCard extends Component<OrderCardProps, {}> {
  render() {
    const { order } = this.props;
    const { shippingAddress, orderId } = order;
    const shipping = `${shippingAddress.line_1} ${shippingAddress.line_2} ${shippingAddress.city}, ${shippingAddress.stateProvinceCounty} ${shippingAddress.postalCode}`;
    const createdAt = order.createdAt
      ? formatDateToWMDY(new Date(order.createdAt))
      : "";
    return (
      <div className="flex flex-col bg-[#FCFCFC] border-[#F6F6F6] border-1 rounded-lg gap-6 p-6">
        <div className="flex flex-col justify-between md:flex-row md:items-start gap-4 md:gap-2">
          <div className="flex flex-col items-start gap-4 md:gap-2">
            <div className="w-full md:inline-flex font-Inter font-semibold font-base truncate">
              <p>Order ID /&nbsp;</p>
              <Link
                to={`/order/${order._id?.toString()}`}
                className="hover:underline"
              >
                {orderId.toString()}
              </Link>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <p className="font-Inter font-medium text-black font-base">
                Shipping Address:
              </p>
              <p className="font-Inter font-base text-[#474747] font-base">
                {shipping}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 md:gap-2 md:items-end">
            <div className="flex flex-col sm:gap-1 sm:flex-row">
              <p className="font-Inter font-medium text-[#474747] font-base">
                Purchased on
              </p>
              <p className="font-Inter font-medium text-[#474747] font-base">
                {createdAt}
              </p>
            </div>
            <p className="font-Inter font-semibold text-black text-lg">
              {order.status}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-start gap-10 w-full h-fit flex-col md:flex-row">
          <div className="flex flex-col items-start gap-6 w-full">
            <hr className="w-full bg-[#DBDBDB] mx-auto" />
            {order.items.map((item, i) => {
              return <OrderItem item={item} key={i} />;
            })}
            <hr className="w-full bg-[#DBDBDB] mx-auto" />
            <div className="flex flex-row items-start justify-between w-full">
              <p className="font-Inter font-bold text-black">Total:</p>
              <p className="font-Inter font-bold text-black">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="w-full h-fit flex flex-col items-center gap-4 md:items-end">
            <Link
              className="px-6 py-2 bg-black rounded-full text-white font-base text-center min-w-[150px] hover:bg-[#0000009f]"
              to={`/order/${order._id?.toString()}`}
            >
              View Order
            </Link>
            <Link
              className="border-2 border-black px-6 py-2 bg-transparent rounded-full text-black font-base text-center min-w-[150px] hover:bg-[#000000] hover:text-white"
              to="/contact"
            >
              Need help?
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
