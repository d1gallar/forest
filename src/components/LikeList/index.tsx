import React, { Component } from "react";
import API_AUTH from "../../api/auth";
import API_LIKE from "../../api/like";
import { IProduct } from "../../models/product";
import Grid from "../Grid";
import Heading from "../Heading";
import Loader from "../Loader";
import Products from "../Products";

type LikeListState = {
  isFetching: boolean;
  userLiked: Partial<IProduct>[];
};

export default class LikeList extends Component<{}, LikeListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isFetching: false,
      userLiked: [],
    };
  }

  async componentDidMount() {
    this.setState({ isFetching: true });
    const userId = await API_AUTH.getUserId();
    if (typeof userId !== "string") window.location.href = "/login";
    const userLiked =
      (await API_LIKE.getUserLikedProducts()) as Partial<IProduct>[];

    this.setState({ userLiked });
    this.setState({ isFetching: false });
  }

  render() {
    const { userLiked, isFetching } = this.state;
    if (isFetching) {
      return (
        <div className="w-full h-[80vh] flex flex-row justify-center items-center">
          <Loader />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="flex flex-col gap-2 w-full h-auto rounded-lg bg-white p-5 md:p-10">
          <Heading level="2" title="Liked Products" />
          {userLiked.length > 0 ? (
            <Grid>
              <Products products={userLiked as IProduct[]} skeletonLength={5} />
            </Grid>
          ) : (
            <p className="font-Inter font-medium text-base text-[#898989]">
              You have not liked any products yet.
            </p>
          )}
        </div>
      </React.Fragment>
    );
  }
}
