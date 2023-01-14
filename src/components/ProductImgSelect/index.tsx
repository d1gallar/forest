import React, { Component } from "react";

type ProductImgSelectProps = {
  images: Array<{imgUrl:string, alt: string}>;
}

type ProductImgSelectState = {
  activeIndex: number;
}

class ProductImgSelect extends Component<ProductImgSelectProps, ProductImgSelectState> {
  constructor(props: ProductImgSelectProps){
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

  renderImageSelector(){
    const {images} = this.props;
    
    return (
      <div className="flex flex-row gap-2 w-[4rem] items-center md:justify-start md:items-start md:flex-col">
        {images.map(({imgUrl, alt},i) =>{
          const activeStyles = this.state.activeIndex === i ? "border-black border-2" : "";
          return <img
          className= {`min-w-[4rem] w-[4rem] h-fit hover:border-black hover:border-2 hover:cursor-pointer ${activeStyles}`}
          onClick={e => this.setState({activeIndex: i})}
          key={i}
          src={imgUrl}
          alt={alt}
        />
        })}
      </div>
    );
  }

  renderMainImage(){
    const {activeIndex} = this.state;
    const {images} = this.props;
    const resizeCSS = this.props.images.length === 1 ? "sm:px-[3rem] md:px-0" : "md:w-[45rem]";
    return <img src={images[activeIndex].imgUrl} className={`w-full ${resizeCSS} h-auto`} alt={images[activeIndex].alt} />
  }

  render(): React.ReactNode {
    const resizeCSS = this.props.images.length === 1 ? "" : "";
    return (
      <div className={`w-full ${resizeCSS} h-fit flex flex-col-reverse items-center gap-5 sm:flex-row`}>
        {this.props.images.length > 1 ? this.renderImageSelector() : null}
        {this.renderMainImage()}
      </div>
    );
  }
}

export default ProductImgSelect;
