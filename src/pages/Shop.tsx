import React, { Component, lazy, Suspense } from "react";

import { IProduct } from "../models/product";
import API_PRODUCT from "../api/products";

import Grid from "../components/Grid";
import SkeletonProducts from "../components/SkeletonProducts";
import PageContainer from "../components/PageContainer";
import Page from "../components/Page";
import Heading from "../components/Heading";
import Search from "./Search";
const Products = lazy(() => import("../components/Products"));

type ShopState = {
  isSearching: boolean;
  products: Array<IProduct> | null;
};

const SHOP_SKELETON_LENGTH = 20;

class Shop extends Component<{}, ShopState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isSearching: false,
      products: null,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(toggleSearch: boolean) {
    this.setState({ isSearching: toggleSearch });
  }

  async componentDidMount() {
    const products = await API_PRODUCT.getAllProducts();
    this.setState({ products });
  }

  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get("q");
    if (name) return <Search />;
    return (
      <Page>
        <PageContainer>
          <Heading level="1" title="Shop Now" />
          <Grid>
            <Suspense
              fallback={<SkeletonProducts length={SHOP_SKELETON_LENGTH} />}
            >
              <Products
                products={this.state.products}
                skeletonLength={SHOP_SKELETON_LENGTH}
              />
            </Suspense>
          </Grid>
        </PageContainer>
      </Page>
    );
  }
}

export default Shop;
