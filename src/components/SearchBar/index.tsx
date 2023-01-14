import React, { ChangeEvent, Component, KeyboardEvent } from "react";

const BASE_URL = process.env.PUBLIC_URL;

type SearchProps = {
  handleQuery: (query: string) => void;
  handleSearch: (toggleSearch: boolean) => void;
};

type SearchState = {
  input: string;
};

class SearchBar extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      input: "",
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const key = e.key;
    if (
      key === "Enter" ||
      (e.ctrlKey && e.code === "KeyF") ||
      (e.metaKey && e.code === "KeyF")
    ) {
      console.log("Search: ", this.state.input);
      this.handleSubmit();
      this.setState({ input: "" });
    }
  }

  handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    this.setState({ input: value });
    this.props.handleQuery(value);
  }

  handleSubmit() {
    if (this.state.input === "") this.props.handleSearch(false);
    else {
      window.location.href = `/shop?q=${this.state.input}`;
    }
  }

  render() {
    return (
      <div className="flex justify-start sm:w-[33rem] xsm:w-[19.5rem] 2xsm:w-[15rem] px-4 py-2 bg-slate-50 rounded-[.75rem] z-50 gap-2">
        <button
          className="p-2 md:p-[.9rem] rounded-[50%] hover:bg-[#f0f0f0]"
          onClick={this.handleSubmit}
        >
          <img
            className="scale-125 md:scale-120"
            src={`${BASE_URL}/assets/search.svg`}
            alt="Search Icon"
          />
        </button>
        <input
          className="outline-none w-full bg-slate-50 font-SansThai text-black/40 font-medium text-base"
          value={this.state.input}
          placeholder="Search for products"
          type="text"
          name="q"
          id="search"
          autoComplete="off"
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e)}
        />
      </div>
    );
  }
}

export default SearchBar;
