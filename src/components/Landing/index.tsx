import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render(): React.ReactNode {
    return (
      <section className="bg-[#829574] w-full flex justify-center items-center h-[50rem] md:h-[40rem] p-10">
        <div className="grid md:grid-cols-2 md:gap-[5%]">
          <div className="flex justify-center flex-col items-center order-2 md:order-1">
            <div className="flex justify-start flex-col items-start w-full my-10">
              <h1 className="font-PlexSans text-white font-bold tracking-tight md:leading-[3.7rem] xsm:leading-[3.7rem] base:text-[3rem] md:text-[2.6rem] xsm:text-[2.7rem] 2xsm:text-[1.8rem]">
                Grow your health. <br /> Grow a garden.
              </h1>
              <p className="inline font-PlexSans text-white text-lg tracking-tight order-1 mt-4">
                Preserve your nature. Plant a seed for the future
              </p>
              <p className="inline font-PlexSans text-white text-lg tracking-tight order-1">
                and sprout your inner passions.
              </p>
            </div>
            <Link
              to="/shop"
              className="box-border font-PlexSans leading-6 text-white 
            border-2 border-white border-solid rounded-md hover:bg-white hover:text-[#829574] md:text-xl py-2 px-6 2xsm:text-2xl 2xsm:py-2 2xsm:px-5"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex justify-center items-center order-1 md:order-2 h-fit w-fit">
            <img src="assets/landing-pic.svg" alt="Plant Leaves" className="!max-w-full"/>
          </div>
        </div>
      </section>
    );
  }
}

export default Landing;
