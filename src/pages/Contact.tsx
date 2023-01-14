import React, { Component } from "react";
import ContactForm from "../components/ContactForm";
import Page from "../components/Page";
const BASE_URL = process.env.PUBLIC_URL;

class Contact extends Component {
  render() {
    return (
      <Page>
        <div className="bg-[#1F1F1F] w-full h-fit justify-center items-center flex flex-col-reverse py-20 px-8 gap-20 md:px-10 md:py-0 md:flex-row md:gap-5">
          <ContactForm />
          <img
            src={`${BASE_URL}/assets/contact-bg.svg`}
            className="w-full h-auto md:scale-[70%] xsm:px-10"
            alt="Plant"
          />
        </div>
      </Page>
    );
  }
}

export default Contact;
