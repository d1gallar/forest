import React, { Component } from "react";
import SearchBar from "../SearchBar";
import SearchResults from "../SearchResults";

const BASE_URL = process.env.PUBLIC_URL;

type SearchModalProps = {
  isSearching: boolean;
  handleSearch: (toggleSearch: boolean) => void;
};

type SearchModalState = {
  query: string;
};

class SearchModal extends Component<SearchModalProps, SearchModalState> {
  constructor(props: SearchModalProps) {
    super(props);
    this.state = {
      query: "",
    };
    this.handleModalClick = this.handleModalClick.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
  }

  handleModalClick() {
    this.props.handleSearch(false);
  }

  handleQuery(query: string) {
    this.setState({ query });
  }

  componentDidUpdate(prevProps: Readonly<SearchModalProps>, prevState: Readonly<SearchModalState>, snapshot?: any): void {
      console.log(this.state,this.props)
  }

  renderModal() {
    return (
      <div className="bg-white w-full h-auto p-8 z-50 opacity-100">
        <div className="flex flex-row items-center justify-center">
          <div className="ml-auto mx-4">
            <SearchBar
              handleQuery={this.handleQuery}
              handleSearch={this.props.handleSearch}
            />
          </div>
          <div className="flex-shrink-0 ml-auto">
            <button className="scale-125" onClick={this.handleModalClick}>
              <img
                src={`${BASE_URL}/assets/close-icon.svg`}
                alt="Close Button"
              />
            </button>
          </div>
        </div>
        <SearchResults keyword={this.state.query} />
      </div>
    );
  }

  render() {
    const { isSearching } = this.props;
    return (
      <React.Fragment>{isSearching ? this.renderModal() : null}</React.Fragment>
    );
  }
}

export default SearchModal;
