import React, { Component } from "react";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import ProductCart from "../../components/ProductCart";
import { ICart, ICartLoad } from "../../models/cart";
import { ICartItem, IPopulatedCartItem } from "../../models/cartItem";
import API_CART from "../../api/cart";
import { IUser } from "../../models/user";
import CartSummary from "../CartSummary";

type CartProps = {
  user: IUser;
};

type CartState = {
  cart: ICartLoad;
  products: ICartItem[];
};

class ShoppingCart extends Component<CartProps, CartState> {
  constructor(props: CartProps) {
    super(props);
    this.state = {
      cart: null,
      products: [],
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleCartChange(updatedCart: ICart) {
    this.setState({
      cart: updatedCart,
      products: [...updatedCart.items],
    });
  }

  async handleSelectChange(_id: string, quantity: string) {
    try {
      const updatedCart = await API_CART.modifyItemQuantity(
        this.props.user._id.toString(),
        _id,
        Number.parseInt(quantity)
      ) as Object;
      if (Object.keys(updatedCart).includes("_id")) {
        const typedCart = updatedCart as ICart;
        this.handleCartChange(typedCart);
      }
    } catch (error) {
      console.log(error); 
    }
  }

  async handleDelete(index: number, _id: string) {
    const { user } = this.props;
    console.log("clicked")
    try {
      const updatedCart = await API_CART.removeItemFromCart(
        user._id.toString(),
        _id.toString()
      ) as Object;
      if (Object.keys(updatedCart).includes("_id")) {
        const typedCart = updatedCart as ICart;
        this.handleCartChange(typedCart);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async componentDidMount() {
    const { user } = this.props;
    try {
      const cart = (await API_CART.getPopulatedCart(
        user._id.toString()
        )) as Object;
      if (Object.keys(cart).includes("_id")) {
        const typedCart = cart as ICart;
        this.handleCartChange(typedCart);
        console.log("Fetched cart...",cart);
      }
    } catch (error) {
      console.log(error)
    }
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<CartState>,
    snapshot?: any
  ): void {
    console.log("state", this.state);
  }

  renderCheckoutBtn() {
    const { cart } = this.state;
    const isCartEmpty = cart === null || cart.items.length === 0;
    return (
      <Link
        to={isCartEmpty ? "#" : "/checkout"}
        className={`py-4 px-6 rounded-full w-full m-auto ${
          isCartEmpty
            ? "bg-[#DADADA] cursor-default "
            : "bg-black cursor-pointer"
        }`}
      >
        <p
          className={`font-Inter text-sm font-bold text-center ${
            isCartEmpty ? "text-[#AFAFAF]" : "text-white"
          } `}
        >
          Checkout
        </p>
      </Link>
    );
  }

  renderProducts() {
    const { cart, products } = this.state;
    const {user} = this.props;
    if (cart === null || user === null) return null;
    if (products.length === 0) {
      return (
        <p className="font-Inter text-sm text-black font-base">
          There are no items in your shopping cart.
        </p>
      );
    }
    console.log("Fetching products...", products);
    return (
      <React.Fragment>
        {products.map((item, i) => {
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
              onSelectChange={this.handleSelectChange}
              onDelete={this.handleDelete}
              canEdit={true}
            />
          );
        })}
      </React.Fragment>
    );
  }

  render(): React.ReactNode {
    const { cart } = this.state;
    const {user} = this.props;
    if(cart === null || user === null) return null;
    return (
      <section>
        <div className="flex flex-col items-start bg-[#FAFAFA] h-fit gap-10 md:flex-row">
          <div className="flex items-start flex-col gap-5 w-full h-fit">
            <Heading level="2" title="Your Shopping Cart" />
            {this.renderProducts()}
          </div>
          <div className="flex items-start flex-col gap-4 w-full md:px-[8vw] lg:px-">
            <Heading level="2" title="Summary" />
            <CartSummary cart={this.state.cart} />
            {this.renderCheckoutBtn()}
          </div>
        </div>
      </section>
    );
  }
}

export default ShoppingCart;
