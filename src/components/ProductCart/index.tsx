import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import Select from "../Select";
import Option from "../SelectItem";

const BASE_URL = process.env.PUBLIC_URL;
const MAX_QUANTITY = 99; // the max quantity a customer could purchase

type ProductCartProps = {
  _id: string;
  index: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imgUrl: string;
  onSelectChange?: (_id: string, quantity: string) => void;
  onDelete?: (index: number, _id: string) => void;
  canEdit: boolean;
};

type ProductCartState = {
  quantity: string;
};

class ProductCart extends Component<ProductCartProps, ProductCartState> {
  constructor(props: ProductCartProps) {
    super(props);
    this.state = {
      quantity: this.props.quantity.toString(),
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  fillQuantityOptions() {
    let optionsArr = [] as ReactNode[];
    for (let i = 1; i <= MAX_QUANTITY; i++) {
      optionsArr.push(<Option key={i} value={`${i}`} />);
    }
    return <React.Fragment>{optionsArr}</React.Fragment>;
  }

  handleSelectChange(quantity: string) {
    const { _id, onSelectChange } = this.props;
    this.setState({
      quantity: quantity,
    });
    if (onSelectChange) onSelectChange(_id, quantity);
  }

  render() {
    return (
      <div className="flex flex-row justify-between w-full h-auto gap-4 md:gap-5">
        <Link to={`${BASE_URL}/shop/products/${this.props.productId}`}>
          <img
            src={this.props.imgUrl}
            alt={this.props.name}
            className="max-w-[80px] md:max-w-[110px] rounded-[10px]"
          />
        </Link>
        <div className="flex flex-col justify-center items-center w-full h-auto">
          <div className="flex flex-row justify-between items-center w-full h-auto gap-2">
            <Link to={`${BASE_URL}/shop/products/${this.props.productId}`}>
              <p className="font-SansThai font-medium text-black text-sm md:text-base hover:underline">
                {this.props.name}
              </p>
            </Link>
            <p className="font-SansThai font-medium tracking-tight text-black text-sm md:text-base">
              ${this.props.price.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-row justify-between w-full h-auto gap-0">
            <div className="flex flex-row justify-between gap-2 items-center align-middle">
              <p className="font-SansThai font-medium tracking-tight text-[#878787] text-sm md:text-base">
                Quantity:
              </p>
              {this.props.canEdit ? (
                <Select
                  id="quantity"
                  name="quantity"
                  value={this.props.quantity.toString()}
                  onChange={this.handleSelectChange}
                  styles="font-SansThai bg-[#FAFAFA] font-medium tracking-tight text-[#878787] text-sm md:text-base"
                >
                  {this.fillQuantityOptions()}
                </Select>
              ) : (
                <p className="font-SansThai font-medium tracking-tight text-[#878787] text-sm md:text-base">
                  {this.props.quantity.toString()}
                </p>
              )}
            </div>
            {this.props.canEdit && (
              <button
                onClick={() => {
                  this.props.onDelete &&
                    this.props.onDelete(this.props.index, this.props._id);
                }}
              >
                <img src={`${BASE_URL}/assets/delete-icon.svg`} alt="Delete" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCart;
