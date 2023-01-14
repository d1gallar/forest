// TODO: For search results render!!
import React, { Component } from "react";
import { IProduct } from "../../models/product";
import Grid from "../Grid";
import Products from "../Products";
import API_PRODUCT from "../../api/products";
import { Link } from "react-router-dom";

type SearchResultsProps = {
  keyword: string;
};

type SearchResultsState = {
  products: Array<IProduct>;
  filter: Array<IProduct>;
};

class SearchResults extends Component<SearchResultsProps, SearchResultsState> {
  constructor(props: SearchResultsProps) {
    super(props);
    this.state = {
      products: [],
      filter: [],
    };
  }

  async componentDidMount() {
    try {
      const products = await API_PRODUCT.getAllProducts();
      this.setState({ products });
    } catch (error) {
      this.setState({ products: [] });
    }
  }

  filterProducts() {
    const filter = this.state.products.filter((product) =>
      product.name.toLowerCase().includes(this.props.keyword.toLowerCase())
    );
    // console.log("filter", filter);
    this.setState({ filter });
  }

  componentDidUpdate(prevProps: SearchResultsProps) {
    // console.log(prevProps.keyword, this.props.keyword);
    if (this.props.keyword !== prevProps.keyword) {
      this.filterProducts();
    }
    // console.log(this.state);
  }

  render() {
    const hideResults = this.state.filter.length > 5;
    const limitFilter = this.state.filter.slice(0, 5) as Array<IProduct>;
    if (this.state.filter.length === 0 || this.props.keyword === "")
      return null;
    return (
      <div className="w-full h-fit pt-10 px-4 flex flex-col justify-center gap-5">
        <Grid className="w-full justify-between">
          <Products
            products={hideResults ? limitFilter : this.state.filter}
            skeletonLength={4}
          />
        </Grid>
        {hideResults && (
          <Link to={{pathname: "/shop", search: `?q=${this.props.keyword}`}}>
            <p className="font-PlexSans font-semibold hover:underline tracking-tight">Show more</p>
          </Link>
        )}
      </div>
    );
  }
}

export default SearchResults;
