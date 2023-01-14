import React, { Component } from "react";
import Heading from "../Heading";

type ProductPageDetailsProps = {
  name?: string;
  price?: number;
  description?: string;
};

class ProductPageDetails extends Component<ProductPageDetailsProps, {}> {
  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Heading level="1" title={`${this.props.name}`} />
        <p className="mt-2 font-SansThai text-lg text-left font-semibold text-[#878787] tracking-tight">
          {`$${this.props.price?.toFixed(2)}`}
        </p>
        <div className="my-4">
          <p className="font-SansThai text-base text-left font-bold text-black tracking-tight">
            Description
          </p>
          <p className="font-SansThai text-base text-left font-base text-[#363636] tracking-tight">
            {this.props.description}
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default ProductPageDetails;
