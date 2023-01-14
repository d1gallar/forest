import React, { Component } from "react";
import { Link } from "react-router-dom";

const BASE_URL = process.env.PUBLIC_URL;
const INSTAGRAM_LINK = "https://www.instagram.com/";
const FACEBOOK_LINK = "https://www.facebook.com/";
const TWITTER_LINK = "https://twitter.com/";

class Footer extends Component {
  render(): React.ReactNode {
    return (
      <footer className="w-full h-fit-content bg-black py-4 2xsm:px-20 z-0">
        <div className="2xsm:flex 2xsm:flex-col-reverse md:grid md:grid-cols-2 md:grid-flow-col">
          <div className="2xsm:m-8 md:mt-0">
            <div className="flex gap-2 2xsm:justify-center md:justify-start">
              <img
                className="scale-100"
                src={`${BASE_URL}/assets/white-plant-logo.svg`}
                alt="Forest White Logo"
              />
              <h1 className="font-PlexSans font-medium text-white text-xl">
                forest
              </h1>
            </div>
            <div className="flex flex-col gap-3 justify-start">
              <p className="font-SansThai font-medium text-white text-[0.75rem] 2xsm:text-center md:text-left">
                A way to grow your garden.
              </p>
              <p className="font-SansThai font-base text-white text-[0.75rem] 2xsm:text-center md:text-left">
                &copy; 2022 forest. All rights reserved.
              </p>
            </div>
          </div>
          <div className="flex 2xsm:justify-center 2xsm:mt-3 2xsm:flex-wrap md:flex-nowrap md:mt-0 md:justify-end gap-10 2xsm:text-center md:text-left">
            <div className="flex-col justify-between gap-2 2xsm:w-full md:w-auto">
              <h5 className="font-PlexSans text-white font-semibold text-xs uppercase mb-1">
                Company
              </h5>
              <div>
                <Link
                  to="/about"
                  className="font-PlexSans text-white font-light text-xs hover:underline"
                >
                  About Us
                </Link>
              </div>
              <div>
                <Link
                  to="/moreinfo"
                  className="font-PlexSans text-white font-light text-xs hover:underline"
                >
                  More Info
                </Link>
              </div>
            </div>
            <div className="flex-col justify-between gap-2 2xsm:w-full md:w-auto">
              <h5 className="font-PlexSans text-white font-semibold text-xs uppercase mb-1">
                Customer Service
              </h5>
              <div>
                <Link
                  to="/contact"
                  className="font-PlexSans text-white font-light text-xs hover:underline"
                >
                  Contact Us
                </Link>
              </div>
              <div>
                <Link
                  to="/account"
                  className="font-PlexSans text-white font-light text-xs hover:underline"
                >
                  My Account
                </Link>
              </div>
              <div>
                <Link
                  to="/rewards"
                  className="font-PlexSans text-white font-light text-xs hover:underline"
                >
                  Redeem Rewards
                </Link>
              </div>
            </div>
            <div className="flex-col justify-between gap-2">
              <h5 className="font-PlexSans text-white font-semibold text-xs uppercase mb-3">
                Social Media
              </h5>
              <div className="flex justify-between gap-4 flex-shrink-0">
                <a href={FACEBOOK_LINK}>
                  <img
                    className="md:scale-125"
                    src={`${BASE_URL}/assets/facebook.svg`}
                    alt="Facebook Link"
                  />
                </a>
                <a href={INSTAGRAM_LINK}>
                  <img
                    className="md:scale-125"
                    src={`${BASE_URL}/assets/instagram.svg`}
                    alt="Instagram Link"
                  />
                </a>
                <a href={TWITTER_LINK}>
                  <img
                    className="md:scale-125"
                    src={`${BASE_URL}/assets/twitter.svg`}
                    alt="Twitter Link"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
