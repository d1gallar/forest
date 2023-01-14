import React, { Component } from "react";
import SkeletonImg from "../SkeletonImg";
import SkeletonText from "../SkeletonText";

class SkeletonProduct extends Component {
  render(): React.ReactNode {
    return (
      <div className="flex flex-col w-[20rem] h-fit gap-5 hover:pointer base:w-[16rem]">
        <SkeletonImg />
        <div>
          <SkeletonText />
          <SkeletonText />
        </div>
      </div>
    );
  }
}

export default SkeletonProduct;
