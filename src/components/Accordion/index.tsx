import React, { Component } from "react";

const BASE_URL = process.env.PUBLIC_URL;

type AccordionProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

type AccordionState = {
  toggleCollapse: boolean;
};

class Accordion extends Component<AccordionProps, AccordionState> {
  constructor(props: AccordionProps) {
    super(props);
    this.state = {
      toggleCollapse: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener("onclick", this.handleClick);
  }

  handleClick() {
    this.setState({ toggleCollapse: !this.state.toggleCollapse });
  }

  render(): React.ReactNode {
    return (
      <div className="w-full h-full">
        <button
          className="flex flex-row justify-between w-full h-fit py-4 mb-4 mx-0"
          onClick={this.handleClick}
        >
          <p className="font-SansThai text-base text-left font-semibold text-black">
            {this.props.title}
          </p>
          <span>
            <img
              src={`${BASE_URL}/assets/collapse-down-icon.svg`}
              alt="Toggle Accordion"
            />
          </span>
        </button>
        {this.state.toggleCollapse && (
          <div className="opacity-100">{this.props.children}</div>
        )}
      </div>
    );
  }
}

export default Accordion;
