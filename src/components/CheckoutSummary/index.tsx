import React, { Component } from "react";
import { ICartLoad } from "../../models/cart";
import { IPopulatedCartItem } from "../../models/cartItem";
import CartSummary from "../CartSummary";
import Heading from "../Heading";
import ProductCart from "../ProductCart";

type CheckoutSummaryProps = {
  cart: ICartLoad;
  showTotal?: boolean;
};

export default class CheckoutSummary extends Component<
  CheckoutSummaryProps,
  {}
> {
  render() {
    return (
      <div className="flex items-start flex-col gap-2 w-full base:px-4vw md:px-[6vw] lg:px-[8vw] order-1">
        <Heading level="2" title="Summary" />
        {this.props.cart && this.props.cart.items && (
          <div className="flex flex-col gap-4 w-full">
            {this.props.cart.items.map((item, i) => {
              const product = item.productId;
              const { unitPrice, quantity } = item;
              const { _id, name, imgUrl, productId } =
                product as IPopulatedCartItem;
              return (
                <ProductCart
                  key={i}
                  index={i}
                  _id={_id.toString()}
                  productId={productId}
                  name={name}
                  imgUrl={imgUrl}
                  price={unitPrice}
                  quantity={quantity}
                  canEdit={false}
                />
              );
            })}
          </div>
        )}
        <div className="w-full flex flex-col gap-4 mt-8">
          <CartSummary cart={this.props.cart} showTotal={this.props.showTotal}/>
        </div>
      </div>
    );
  }
}
