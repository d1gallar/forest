import React, { Component } from "react";

import Landing from "../components/Landing";
import PopularProducts from "../components/PopularProducts";
import Testimonials from "../components/Testimonials";
import Page from "../components/Page";
import Heading from "../components/Heading";

class Home extends Component {
  render() {
    return (
      <Page>
        <Landing />
        <section className="bg-[#FDFDFD] w-full h-fit py-12 px-10 md:p-10">
          <Heading level="1" title="Popular Products" />
          <PopularProducts />
        </section>
        <Testimonials />
      </Page>
    );
  }
}

export default Home;
