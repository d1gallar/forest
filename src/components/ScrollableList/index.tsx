import React, { Component } from "react";

type ScrollableListProps = {
  children: React.ReactNode | React.ReactNode[];
};

class ScrollableList extends Component<ScrollableListProps, {}> {
  render(): React.ReactNode {
    const { children } = this.props;
    return (
      <div className="flex flex-row justify-between gap-6 items-center overflow-x-scroll overflow-y-hidden snap-proximity scroll-mt-[10rem]">
        {children}
      </div>
    );
  }
}

export default ScrollableList;
