import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type ProductBreadcrumbProps = {
  name?: string;
}

class ProductBreadcrumb extends Component<ProductBreadcrumbProps, {}> {
  render(): React.ReactNode {
      return (
        <div className="w-full mb-4 inline-flex font-SansThai font-semibold text-base md:text-lg">
          <Link to="/shop" className="text-black hover:underline">
            Shop{" "}
          </Link>
          <p className="text-black">&nbsp; &gt; &nbsp;</p>
          <p className="text-[#878787]">{this.props.name}</p>
        </div>
      );
  }
}

export default ProductBreadcrumb;