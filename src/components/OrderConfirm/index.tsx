import React, { Component } from "react";
import { IOrderLoad } from "../../models/order";
import { IOrderItem } from "../../models/orderItem";
import Heading from "../Heading";
import OrderConfirmItem from "../OrderConfirmItem";

type OrderConfirmProps = {
  order: IOrderLoad;
};

export default class OrderConfirm extends Component<OrderConfirmProps> {
  render() {
    const { order } = this.props;
    const items: Array<IOrderItem> = order?.items || [];
    if(!order) return null;
    return (
      <div className="flex flex-col w-full">
        <Heading title="Order Summary" level="4" />
        <div className="flex flex-col justify-center w-full gap-4">
          {items.map((item: IOrderItem) => {
            return <OrderConfirmItem item={item} key={item.productId} />;
          })}
        </div>
        <div className="flex flex-col mt-6 gap-4">
          <div className="border-[0.5px] border-[#DBDBDB] w-full"></div>
          <div className="flex flex-row justify-between items-center w-full">
            <p className="font-Inter text-sm text-black font-base">Subtotal</p>
            <p className="font-Inter text-sm text-black font-base">
              {`$${order.subtotal.toFixed(2)}`}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <p className="font-Inter text-sm text-black font-base">
              Shipping
            </p>
            <p className="font-Inter text-sm text-black font-base">
              {`$${order.shippingCost.toFixed(2)}`}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <p className="font-Inter text-sm text-black font-base">Tax</p>
            <p className="font-Inter text-sm text-black font-base">
              {`$${order.tax.toFixed(2)}`}
            </p>
          </div>
          <div className="border-[0.5px] border-[#DBDBDB] w-full"></div>
          <div className="flex flex-row justify-between items-center w-full">
            <p className="font-Inter text-sm text-black font-bold">Total</p>
            <p className="font-Inter text-sm text-black font-bold">
              {`$${order.total.toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
