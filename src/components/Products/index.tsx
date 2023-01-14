import React, { Component, lazy, Suspense } from "react";
import { IProduct } from "../../models/product";
import SkeletonProduct from "../SkeletonProduct";
import SkeletonProducts from "../SkeletonProducts";

const ProductPreview = lazy(() => import("../ProductPreview"));

type ProductsProps = {
  products: Array<IProduct> | null | undefined;
  skeletonLength: number;
};

class Products extends Component<ProductsProps, {}> {
  renderProducts() {
    const { products } = this.props;
    if (!products || products === undefined || products.length === 0 || null)
      return <SkeletonProducts length={this.props.skeletonLength} />;
    return products.map((product, i) => {
      const { productId } = product;
      return (
        <Suspense fallback={<SkeletonProduct key={i} />} key={i}>
            <ProductPreview key={productId} product={product} />
        </Suspense>
      );
    });
  }

  render(): React.ReactNode {
    return <React.Fragment>{this.renderProducts()}</React.Fragment>;
  }
}

export default Products;
