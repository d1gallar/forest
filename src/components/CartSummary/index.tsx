import React, { Component } from "react";
import { ICartLoad } from "../../models/cart";

type CartSummaryProps = {
  cart: ICartLoad;
  showTotal?: boolean;
};

export default class CartSummary extends Component<CartSummaryProps, {}> {
  render() {
    const { cart } = this.props;
    return (
      <React.Fragment>
        <div className="flex flex-row justify-between items-center w-full">
          <p className="font-Inter text-sm text-black">Subtotal</p>
          <p className="font-Inter text-sm text-black">
            {cart === null ? "-" : `$${cart?.subtotal}`}
          </p>
        </div>
        <div className="flex flex-row justify-between items-center w-full">
          <p className="font-Inter text-sm text-black">
            Estimated Shipping and Handling
          </p>
          <p className="font-Inter text-sm text-black">{this.props.showTotal ? `$${cart?.shippingCost.toFixed(2)}` : "-"}</p>
        </div>
        <div className="flex flex-row justify-between items-center w-full">
          <p className="font-Inter text-sm text-black">
            Estimated Tax
          </p>
          <p className="font-Inter text-sm text-black">{this.props.showTotal ? `$${cart?.tax.toFixed(2)}` : "-"}</p>
        </div>
        <div className="border-[0.5px] border-[#DBDBDB] w-full"></div>
        <div className="flex flex-row justify-between items-center w-full">
          <p className="font-Inter text-sm text-black font-bold">Total</p>
          <p className="font-Inter text-sm text-black font-bold">{this.props.showTotal ? `$${cart?.total.toFixed(2)}` : "-"}</p>
        </div>
        <div className="border-[0.5px] border-[#DBDBDB] w-full mb-4"></div>
      </React.Fragment>
    );
  }
}
