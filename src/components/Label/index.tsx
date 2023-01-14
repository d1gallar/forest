import React, { Component, ReactNode } from "react";

type LabelProps = {
  htmlFor: string;
  children: ReactNode[] | ReactNode;
}

class Label extends Component<LabelProps, {}> {
  render() {
    return (
      <React.Fragment>
        <label
          htmlFor={this.props.htmlFor}
          className="font-Inter text-base font-medium tracking-tight text-[#7E7E7E] mb-1"
        >
         {this.props.children}
        </label>
      </React.Fragment>
    );
  }
}

export default Label;
