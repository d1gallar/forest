import React, { Component } from "react";
import Accordion from "../Accordion";

class ProductPolicy extends Component {
  render(): React.ReactNode {
    return (
      <Accordion title="Shipping &amp; Returns">
        <section className="mb-2 font-SansThai text-base text-left font-base text-[#363636] tracking-tight">
          <p className="font-semibold">Shipping</p>
          <p>
            We are working on the best way to ship live plants, please check
            back soon for updates or sign up for our newsletter to be the first
            to know. All items are for pickup at our store or local delivery
            only at this time.
          </p>
        </section>
        <section className="mb-2 font-SansThai text-base text-left font-base text-[#363636] tracking-tight">
          <p className="font-semibold">Returns</p>
          <p>
            As a small production, we are unable to accommodate returns or
            exchanges at this time. We are always happy to talk through any
            plant care and product questions you may have before purchasing to
            ensure you are completely happy with your order.
          </p>
        </section>
      </Accordion>
    );
  }
}

export default ProductPolicy;
