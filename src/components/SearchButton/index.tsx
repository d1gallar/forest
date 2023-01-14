import React, { Component } from 'react';

const BASE_URL = process.env.PUBLIC_URL;

type SearchButtonProps = {
  handleSearch: (toggleSearch: boolean) => void;
}

class SearchButton extends Component<SearchButtonProps,{}>{
  constructor(props: SearchButtonProps){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.handleSearch(true);
  }

  render(): React.ReactNode {
      return (
        <button onClick={this.handleClick}>
          <img className="scale-125 md:scale-100" src={`${BASE_URL}/assets/search.svg`} alt="Search Icon" />
        </button>
      );
  }
}

export default SearchButton;