import React, { Component } from "react";

const BASE_URL = process.env.PUBLIC_URL;

type CardBrandProps = {
  brand: string;
};

export default class CardBrand extends Component<CardBrandProps, {}> {
  renderBrand() {
    const { brand } = this.props;
    switch (brand) {
      case "visa":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/visa.svg`}
            alt="Visa"
            className="w-full"
          />
        );
      case "amex":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/american-express.svg`}
            alt="American Express"
            className="w-full"
          />
        );
      case "cartes_bancaires":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/sb.svg`}
            alt="Cartes Bancaires"
            className="w-full"
          />
        );
      case "diners":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/diners-club.png`}
            alt="Diners"
            className="w-full"
          />
        );
      case "discover":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/discover.svg`}
            alt="Discover"
            className="w-full"
          />
        );
      case "jcb":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/jcb.svg`}
            alt="JCB"
            className="w-full"
          />
        );
      case "mastercard":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/mastercard.svg`}
            alt="Mastercard"
            className="w-full"
          />
        );
      case "unionpay":
        return (
          <img
            src={`${BASE_URL}/assets/cardbrands/union-pay.svg`}
            alt="Union Pay"
            className="w-full"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return <div className="max-w-[36px]">{this.renderBrand()}</div>;
  }
}
