import React, { Component } from "react";
import SkeletonProduct from "../SkeletonProduct";

type SkeletonProductsProps = {
  length: number;
}

class SkeletonProducts extends Component<SkeletonProductsProps, {}> {
  render(): React.ReactNode {
    const skeletonArr = new Array<React.ReactNode>();
    for (let i = 0; i < this.props.length; i++) {
      skeletonArr.push(<SkeletonProduct key={i} />);
    }
    return <React.Fragment>{skeletonArr}</React.Fragment>;
  }
}

export default SkeletonProducts;
