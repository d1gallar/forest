import React, { Component } from "react";
import Page from "../components/Page";
import ProductImgSelect from "../components/ProductImgSelect";
import ProductPageDetails from "../components/ProductPageDetails";
import ProductPolicy from "../components/ProductPolicy";
import ProductBreadcrumb from "../components/ProductBreadcrumb";
import ProductQuantity from "../components/ProductQuantity";
import { ICart, ICartLoad } from "../models/cart";
import { IProduct } from "../models/product";
import API_PRODUCT from "../api/products";
import API_CART from "../api/cart";
import { Navigate } from "react-router-dom";
import API_AUTH from "../api/auth";
import { AxiosError } from "axios";
import FavoriteButton from "../components/FavoriteButton";

const BASE_URL = process.env.PUBLIC_URL;

type ProductState = {
  isSearching: boolean;
  quantity: number;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  cart: ICartLoad;
  currentProduct: IProduct | null;
  isBtnDisabled: boolean;
};

class Product extends Component<{}, ProductState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isSearching: false,
      isFetching: false,
      isSuccess: false,
      isError: false,
      quantity: 1,
      cart: null,
      currentProduct: null,
      isBtnDisabled: false,
    };

    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
  }

  async fetchCart() {
    try {
      this.setState({ isFetching: true });
      const userId = await API_AUTH.getUserId();
      if (typeof userId !== "string") throw Error(JSON.stringify(userId));
      const cart: ICart = await API_CART.getCartByUserId(userId);
      this.setState({
        cart,
        isFetching: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    const pathname = window.location.pathname;
    const paths = pathname.slice(1, pathname.length);
    const pathArr = paths.split("/");
    const productId: string = pathArr[pathArr.length - 1];

    this.setState({ isFetching: true });
    await API_PRODUCT.getProduct(productId).then((product: IProduct) => {
      this.setState({ currentProduct: product });
    });
    this.setState({ isFetching: false });
  }

  async handleAddToCart() {
    const { currentProduct, quantity } = this.state;
    if (!currentProduct || !currentProduct.price || !currentProduct.productId) {
      return null;
    }
    try {
      this.setState({ isFetching: true });
      const userId = await API_AUTH.getUserId();
      if (typeof userId !== "string") throw Error(JSON.stringify(userId));
      const cart = (await API_CART.getCartByUserId(userId as string).catch(
        (e: AxiosError) => {
          console.log(e.response?.data);
        }
      )) as ICart;
      this.setState({ cart });
      const updatedCart = (await API_CART.addItemToCart(
        userId,
        currentProduct._id.toString(),
        currentProduct.price,
        quantity
      ).catch((e: AxiosError) => {
        console.log(e.response?.data);
      })) as ICart;
      this.setState({ cart: updatedCart, isFetching: false, isSuccess: true });
    } catch (error) {
      this.setState({ isError: true, isFetching: false });
    }
    // window.location.href = "/cart";
  }

  handleQuantity(newQuantity: number) {
    this.setState({ quantity: newQuantity });
  }

  handleSearch(toggleSearch: boolean) {
    this.setState({ isSearching: toggleSearch });
  }

  loadProductDetails() {
    const { currentProduct, isBtnDisabled } = this.state;

    const imgUrl = currentProduct?.imgUrl;
    const name = currentProduct?.name;
    const price = currentProduct?.price;
    const description = currentProduct?.description;
    const images: Array<{ imgUrl: string; alt: string }> = [];
    const stockQuantity = currentProduct?.stockQuantity;
    if (stockQuantity === 0) this.setState({ isBtnDisabled: true });

    if (imgUrl !== undefined && name !== undefined) {
      images.push({ imgUrl, alt: name });
    }
    return (
      <main className="w-full h-fit bg-[#FDFDFD] py-10 z-1 md:mb-[10rem] px-16">
        <ProductBreadcrumb name={name} />
        <section className="w-full h-fit flex flex-col justify-center gap-10 md:flex-row">
          <ProductImgSelect images={images} />
          <div className="w-full h-fit m-0 sm:px-[3rem] md:px-0">
            <ProductPageDetails
              name={name}
              price={price}
              description={description}
            />
            {stockQuantity !== 0 ? (
              <ProductQuantity handleQuantity={this.handleQuantity} />
            ) : (
              <div className="mb-4">
                <p className="font-SansThai text-base font-bold tracking-tight">
                  Out of Stock
                </p>
                <p className="font-SansThai text-base text-left font-base text-[#363636] tracking-tight">
                  Sorry! This product is currently out of stock!
                </p>
              </div>
            )}
            <hr className="bg-[#f0f0f0]" />
            <ProductPolicy />
            <div className="mt-4 flex flex-col justify-center items-center gap-4">
              <button
                className="w-full min-w-[180px] text-center bg-black font-SansThai font-semibold rounded-full text-white py-3 px-8 lg:w-1/2 focus:border-blue focus:border-8 disabled:bg-[#0000005a] md:w-full"
                onClick={() => this.handleAddToCart()}
                disabled={isBtnDisabled}
              >
                Add To Cart
              </button>
              <FavoriteButton />
            </div>
          </div>
        </section>
      </main>
    );
  }

  render(): React.ReactNode {
    if (this.state.isError) return <Navigate to="/login" replace />;
    if (this.state.isSuccess) return <Navigate to="/cart" replace />;
    return (
      <Page>
        {this.state.currentProduct ? (
          this.loadProductDetails()
        ) : (
          <div className="h-[50rem]"></div>
        )}
      </Page>
    );
  }
}

export default Product;
