import React, { ChangeEvent, Component } from "react";

const MAX_QUANTITY = 99; // the max quantity a customer could purchase
const BASE_URL = process.env.PUBLIC_URL;

type ProductQuantityProps = {
  handleQuantity: (newQuantity: number) => void;
}

type ProductQuantityState = {
  quantity: number;
};

class ProductQuantity extends Component<ProductQuantityProps, ProductQuantityState> {
  constructor(props: ProductQuantityProps) {
    super(props);
    this.state = {
      quantity: 1,
    };

    this.decrease = this.decrease.bind(this);
    this.increase = this.increase.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  decrease(): void {
    if (this.state.quantity <= 1) return;
    const newQuantity = this.state.quantity - 1;
    this.setState({ quantity: newQuantity});
    this.props.handleQuantity(newQuantity);
  }

  increase(): void {
    if (this.state.quantity >= MAX_QUANTITY) return;
    const newQuantity = this.state.quantity + 1;
    this.setState({ quantity: newQuantity });
    this.props.handleQuantity(newQuantity);
  }

  handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.value === "") {
      e.currentTarget.value = "1";
    }
    const value = Number.parseInt(e.currentTarget.value);
    if (value > MAX_QUANTITY) this.setState({quantity: MAX_QUANTITY});
    else this.setState({quantity: value});
    this.props.handleQuantity(this.state.quantity);
  }

  render(): React.ReactNode {
    return (
      <div>
        <p className="font-SansThai text-base font-bold tracking-tight">
          Quantity
        </p>
        <div className="flex items-center my-4">
          <button
            className="bg-[#f1f1f1] p-2 rounded-sm"
            onClick={this.decrease}
          >
            <img src={`${BASE_URL}/assets/minus-icon.svg`} alt="Remove" />
          </button>
          <input
            className="mx-4 h-fit p-1 text-center w-8"
            type="number"
            name="quantity"
            id="quantity"
            max={MAX_QUANTITY}
            min={1}
            value={this.state.quantity}
            onChange={(e) => this.handleChange(e)}
          />
          <button
            className="bg-[#f1f1f1] p-2 rounded-sm"
            onClick={this.increase}
          >
            <img src={`${BASE_URL}/assets/plus-icon.svg`} alt="Add" />
          </button>
        </div>
      </div>
    );
  }
}

export default ProductQuantity;
