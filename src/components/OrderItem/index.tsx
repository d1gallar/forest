import React, { Component } from "react";
import { Link } from "react-router-dom";
import API_PRODUCT from "../../api/products";
import { IOrderItem } from "../../models/orderItem";
import { IProductLoad } from "../../models/product";

type OrderItemProps = {
  item: IOrderItem;
};

type OrderItemState = {
  product: IProductLoad;
  isFetching: boolean;
};

export default class OrderItem extends Component<
  OrderItemProps,
  OrderItemState
> {
  constructor(props: OrderItemProps){
    super(props);
    this.state = {
      product: null,
      isFetching: false
    }
  }

  async componentDidMount() {
    const { item } = this.props;
    this.setState({isFetching: true})
    const product = await API_PRODUCT.getProduct(item.productId.toString());
    this.setState({product, isFetching: false});
  }

  render() {
    const {item} = this.props;
    const {product,isFetching} = this.state;
    if(isFetching) return null;
    return product && (
      <div
        className="flex items-center w-full h-full flex-col gap-4 xsm:flex-row xsm:gap-6"
        key={product.productId}
      >
        <Link to={`/shop/products/${product.productId}`}>
          <img
            src={product.imgUrl}
            alt={product.name}
            className="max-w-[100px] xsm:max-w-[90px]"
          />
        </Link>
        <div className="flex flex-col justify-between w-full h-full items-center xsm:items-start">
          <div className="flex w-full h-fit flex-col justify-between items-center xsm:items-start xsm:flex-row xsm:justify-between">
            <Link
              to={`/shop/products/${product.productId}`}
              className="hover:underline"
            >
              <p className="font-PlexSans font-medium text-black">
                {product.name}
              </p>
            </Link>
            <p className="font-PlexSans font-medium text-black">
              ${item.unitPrice.toFixed(2)}
            </p>
          </div>
          <p className="font-PlexSans font-medium text-[#878787]">
            Quantity: {item.quantity}
          </p>
        </div>
      </div>
    );
  }
}
