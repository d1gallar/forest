import React, { Component } from "react";

type HeadingProps = {
  title: string;
  level: "1" | "2" | "3" | "4" | "5" | "6";
  className?: string | undefined;
};

const HEADING_STYLES = "font-Inter text-black font-semibold tracking-[-2%] mb-5";

class Heading extends Component<HeadingProps, {}> {
  render() {
    const {title, className} = this.props;
    switch (this.props.level) {
      case "1":
        return <h1 className={`${HEADING_STYLES} text-2xl ${className}`}>{title}</h1>;
      case "2":
        return <h2 className={`${HEADING_STYLES} text-xl ${className}`}>{title}</h2>;
      case "3":
        return <h3 className={`${HEADING_STYLES} text-lg ${className}`}>{title}</h3>;
      case "4":
        return <h4 className={`${HEADING_STYLES} text-base ${className}`}>{title}</h4>;
      case "5":
        return <h5 className={`${HEADING_STYLES} text-sm ${className}`}>{title}</h5>;
      case "6":
        return <h6 className={`${HEADING_STYLES} text-xsm ${className}`}>{title}</h6>;
      default:
        return null;
    }
  }
}

export default Heading;
