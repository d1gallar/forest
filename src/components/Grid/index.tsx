import React, { Component } from "react";

type GridProps = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

class Grid extends Component<GridProps, {}> {
  render(): React.ReactNode {
    return (
      <div
        className={
          `flex flex-row flex-wrap flex-grow-1 gap-4` +
          (this.props.className ? ` ${this.props.className}` : "")
        }
      >
        {this.props.children}
      </div>
    );
  }
}

export default Grid;
