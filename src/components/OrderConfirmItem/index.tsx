import React, { Component } from "react";
import { Link } from "react-router-dom";
import API_PRODUCT from "../../api/products";
import { IOrderItem } from "../../models/orderItem";
import { IProductLoad } from "../../models/product";

type OrderConfirmItemProps = {
  item: IOrderItem;
};

type OrderConfirmItemState = {
  product: IProductLoad;
  isFetching: boolean;
};

export default class OrderConfirmItem extends Component<
  OrderConfirmItemProps,
  OrderConfirmItemState
> {
  constructor(props: OrderConfirmItemProps) {
    super(props);
    this.state = {
      product: null,
      isFetching: false,
    };
  }

  async componentDidMount() {
    const { item } = this.props;
    this.setState({ isFetching: true });
    const product = await API_PRODUCT.getProduct(item.productId.toString());
    this.setState({ product, isFetching: false });
  }

  render() {
    const { item } = this.props;
    const { product, isFetching } = this.state;
    if (isFetching) return null;
    return (
      product && (
        <div
          className="flex items-center w-full h-full flex-row gap-4 xsm:gap-6"
          key={product.productId}
        >
          <Link to={`/shop/products/${product.productId}`}>
            <img
              src={product.imgUrl}
              alt={product.name}
              className="max-w-[90px]"
            />
          </Link>
          <div className="flex flex-col justify-between w-full h-full">
            <div className="flex w-full h-fit flex-row justify-between items-start">
              <Link
                to={`/shop/products/${product.productId}`}
                className="hover:underline"
              >
                <p className="font-PlexSans font-medium text-black text-xs 2xsm:text-sm">
                  {product.name}
                </p>
              </Link>
              <p className="font-PlexSans font-medium text-black text-xs 2xsm:text-sm">
                ${item.unitPrice.toFixed(2)}
              </p>
            </div>
            <p className="font-PlexSans font-medium text-[#878787] text-xs 2xsm:text-sm">
              Quantity: {item.quantity}
            </p>
          </div>
        </div>
      )
    );
  }
}
