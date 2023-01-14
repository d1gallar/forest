import React, { Component } from "react";
import API_AUTH from "../../api/auth";
import API_LIKE from "../../api/like";
import API_PRODUCT from "../../api/products";
import { ILike, IUserLike } from "../../models/likes";

type FavoriteButtonState = {
  isFetching: boolean;
  isHovering: boolean;
  isLiked: boolean;
  userId: string | null;
  userLiked: IUserLike[];
};

export default class FavoriteButton extends Component<{}, FavoriteButtonState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isFetching: false,
      isHovering: false,
      isLiked: false,
      userId: null,
      userLiked: [],
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.createLike = this.createLike.bind(this);
    this.removeLike = this.removeLike.bind(this);
  }

  handleMouseEnter() {
    this.setState({ isHovering: true });
  }

  handleMouseLeave() {
    this.setState({ isHovering: false });
  }

  async createLike() {
    if (this.state.userId) {
      const pathname = window.location.pathname;
      const paths = pathname.slice(1, pathname.length);
      const pathArr = paths.split("/");
      const productId: string = pathArr[pathArr.length - 1];
      const product = await API_PRODUCT.getProduct(productId);

      this.setState({ isFetching: true });
      const like: ILike = {
        productId: product._id.toString(),
        userId: this.state.userId,
      };
      await API_LIKE.createLike(like);
      this.setState({ isFetching: false });
      this.setState({ isLiked: true });
    }
  }

  async removeLike() {
    if (this.state.userId) {
      const pathname = window.location.pathname;
      const paths = pathname.slice(1, pathname.length);
      const pathArr = paths.split("/");
      const productId: string = pathArr[pathArr.length - 1];
      const product = await API_PRODUCT.getProduct(productId);

      this.setState({ isFetching: true });
      await API_LIKE.deleteLike(product._id.toString());
      this.setState({ isLiked: false });
      this.setState({ isFetching: false });
    }
  }

  handleClick() {
    if (!this.state.userId) window.location.href = "/login";
    if (this.state.isLiked) {
      this.removeLike();
    } else {
      this.createLike();
    }
  }

  async componentDidMount() {
    // product id
    const pathname = window.location.pathname;
    const paths = pathname.slice(1, pathname.length);
    const pathArr = paths.split("/");
    const productId: string = pathArr[pathArr.length - 1];

    this.setState({ isFetching: true });

    // user id
    const userId = await API_AUTH.getUserId();
    if (typeof userId !== "string") this.setState({ userId: null });
    else this.setState({ userId });

    // updates users liked
    const userLiked: IUserLike[] = await API_LIKE.getUserLikes(
      userId as string
    );
    if (userLiked.length > 0) this.setState({ userLiked });

    // updates if there is a match
    userLiked.forEach((like) => {
      if (like.productId === productId) {
        this.setState({ isLiked: true });
      }
    });
    this.setState({ isFetching: false });
  }

  render() {
    if (this.state.isFetching) return null;
    return this.state.isLiked ? (
      <button
        className="w-full min-w-[180px] text-white text-center bg-black font-SansThai font-semibold rounded-full py-3 px-8 border-black border-2 lg:w-1/2"
        onClick={this.handleClick}
        onMouseEnter={(e) => this.handleMouseEnter()}
        onMouseLeave={(e) => this.handleMouseLeave()}
      >
        <div className="flex flex-row justify-center items-center gap-6">
          <img
            src="/assets/heart-white-filled-icon.svg"
            alt="White Heart Icon"
          />
          <p>Liked</p>
        </div>
      </button>
    ) : (
      <button
        className="w-full min-w-[180px] text-center bg-white font-SansThai font-semibold rounded-full text-black py-3 px-8 border-black border-2 lg:w-1/2 hover:text-white hover:bg-black"
        onClick={() => this.handleClick()}
        onMouseEnter={(e) => this.handleMouseEnter()}
        onMouseLeave={(e) => this.handleMouseLeave()}
      >
        <div className="flex flex-row justify-center items-center gap-6">
          {this.state.isHovering ? (
            <img
              src="/assets/heart-white-filled-icon.svg"
              alt="White Heart Icon"
            />
          ) : (
            <img
              src="/assets/heart-black-filled-icon.svg"
              alt="Black Heart Icon"
            />
          )}
          <p>Favorite</p>
        </div>
      </button>
    );
  }
}
