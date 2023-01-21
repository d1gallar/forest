import React, { Component } from "react";
import { IProduct } from "../../models/product";
import { Link } from "react-router-dom";
import SkeletonProduct from "../SkeletonProduct";
import SkeletonText from "../SkeletonText";
import SkeletonImg from "../SkeletonImg";

type ProductPreviewProps = {
  product: IProduct | null;
};

class ProductPreview extends Component<ProductPreviewProps> {
  render(): React.ReactNode {
    const { product } = this.props;
    if (!product) return <SkeletonProduct />;
    const { productId, name, imgUrl, price } = product;
    return (
      <div className="w-full flex flex-col h-fit gap-5 hover:pointer md:scale-95 md:hover:scale-100 transition-transform duration-100 sm:w-[14rem] base:w-[16rem]">
        {!imgUrl ? (
          <SkeletonImg />
        ) : (
          <Link to={`/shop/products/${productId}`}>
            <img
              className="w-full h-fit min-w-[200px]"
              src={imgUrl}
              alt={name}
            />
          </Link>
        )}
        <div>
          {!name ? (
            <SkeletonText />
          ) : (
            <Link to={`/shop/products/${productId}`}>
              <h4 className="font-SansThai font-medium text-black mb-1 text-sm md:text-base hover:underline">
                {name}
              </h4>
            </Link>
          )}
          {!price ? (
            <SkeletonText />
          ) : (
            <p className="font-SansThai font-medium text-[#878787] text-sm md:text-base">
              {`$${price.toFixed(2)}`}
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default ProductPreview;
