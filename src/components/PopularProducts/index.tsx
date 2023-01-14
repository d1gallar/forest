import React, { Component, lazy, Suspense } from "react";
import API_PRODUCT from "../../api/products";
import { IProduct } from "../../models/product";
import ScrollableList from "../ScrollableList";
import SkeletonList from "../SkeletonProducts";

const Products = lazy(() => import("../Products"));
const POPULAR_SKELETON_LENGTH = 5;

type PopularProductState = {
  popularProducts: Array<IProduct> | null;
};

class PopularProducts extends Component<{}, PopularProductState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      popularProducts: null,
    };
  }

  async componentDidMount() {
    await API_PRODUCT.getPopularProducts().then((popularProducts) => {
      this.setState({ popularProducts: popularProducts });
    });
  }

  render(): React.ReactNode {
    return (
      <ScrollableList>
        <Suspense fallback={<SkeletonList length={POPULAR_SKELETON_LENGTH} />}>
            <Products
              products={this.state.popularProducts}
              skeletonLength={POPULAR_SKELETON_LENGTH}
            />
        </Suspense>
      </ScrollableList>
    );
  }
}

export default PopularProducts;
