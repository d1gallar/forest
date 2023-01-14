import React, { Component, Suspense } from "react";
import API_PRODUCT from "../api/products";
import Grid from "../components/Grid";
import Heading from "../components/Heading";
import Page from "../components/Page";
import PageContainer from "../components/PageContainer";
import PopularProducts from "../components/PopularProducts";
import Products from "../components/Products";
import SkeletonProducts from "../components/SkeletonProducts";
import { IProduct } from "../models/product";

const SHOP_SKELETON_LENGTH = 20;

type SearchState = {
  isSearching: boolean;
  products: Array<IProduct>;
  filter: Array<IProduct>;
  isFetching: boolean;
};

class Search extends Component<{}, SearchState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isSearching: false,
      products: [],
      filter: [],
      isFetching: false
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(toggleSearch: boolean) {
    this.setState({ isSearching: toggleSearch });
  }

  async componentDidMount() {
    try {
      const query = window.location.search;
      const keyword = query.replace("?q=", "");
      this.setState({isFetching: true})
      const products = await API_PRODUCT.getAllProducts();
      const filter = products.filter((product) =>
      product.name.includes(keyword)
      );
      this.setState({ products, filter });
      this.setState({isFetching: false})
    } catch (error) {
      this.setState({ products: [], isFetching: false });
    }
  }

  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const keyword = queryParams.get("q");
    if(this.state.isFetching) return null;
    return (
      <Page>
        <PageContainer>
          {this.state.isFetching ? (
            null
          ) : (
            <div className="w-full h-full p-0 m-0 base:p-10">
            {this.state.filter.length === 0 ? (
              <React.Fragment>
                <div className="py-10 flex flex-col justify-between items-center">
                  <Heading
                    level="1"
                    title={`We could not find anything for "${keyword}".`}
                    className="text-lg sm:text-2xl"
                  />
                </div>
                <div className="w-full flex ml-2">
                  <Heading
                    level="4"
                    title={`These popular products might interest you.`}
                    className="font-medium"
                  />
                </div>
                <PopularProducts />
                <div className="pb-10"></div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Heading level="1" title={`Search Results for "${keyword}" `} className="ml-2"/>
                <Grid className="justify-evenly">
                  <Suspense
                    fallback={
                      <SkeletonProducts length={SHOP_SKELETON_LENGTH} />
                    }
                  >
                    <Products
                      products={this.state.filter}
                      skeletonLength={SHOP_SKELETON_LENGTH}
                    />
                  </Suspense>
                </Grid>
              </React.Fragment>
            )}
          </div>
          )}
          
        </PageContainer>
      </Page>
    );
  }
}

export default Search;
