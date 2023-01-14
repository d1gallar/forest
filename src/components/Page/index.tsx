import React, { Component, ReactNode } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import SearchModal from "../SearchModal";

type PageProps = {
  children: ReactNode[] | ReactNode;
};

type PageState = {
  isSearching: boolean;
};

export default class Page extends Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      isSearching: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(toggleSearch: boolean) {
    this.setState({ isSearching: toggleSearch });
  }

  render() {
    return (
      <div>
        {this.state.isSearching ? (
          <SearchModal
            isSearching={this.state.isSearching}
            handleSearch={this.handleSearch}
          />
        ) : (
          <Navbar handleSearch={this.handleSearch} />
        )}
        <div
          className={this.state.isSearching ? "filter brightness-[30%]" : ""}
        >
          {this.props.children}
          <Footer />
        </div>
      </div>
    );
  }
}
