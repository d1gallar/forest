import React, { Component } from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
const BASE_URL = process.env.PUBLIC_URL;

class SignUp extends Component {
  render() {
    // const token = localStorage.getItem("user");
    // if(token) return <Navigate to="/" replace />
    return (
      <div className="w-screen flex flex-col-reverse justify-start md:flex-row 2xsm:shrink-0">
        <div className="bg-white flex flex-col justify-start items-center my-10 mx-5 2xsm:m-10 md:w-3/5">
          <div className="w-full flex flex-row justify-center my-10">
            <div className="w-full flex flex-row gap-4 justify-center items-center">
              <span>
                <img
                  src={`${BASE_URL}/assets/plant-logo.svg`}
                  alt="Forest Leaf Logo"
                  className="scale-[140%] pointer-events-none"
                />
              </span>
              <p className="font-SansThai text-black font-medium leading-5 text-4xl">
                forest.
              </p>
            </div>
          </div>
          <p className="w-full text-center text-Inter text-3xl text-black font-semibold my-8">
            Create your account
          </p>
          <RegisterForm />
          <div className="w-full h-fit flex-row my-4 text-center justify-center md:text-right md:justify-end">
            <div className="flex gap-2 text-base flex-col sm:flex-row justify-center md:justify-end">
              <p className="font-Inter">Already have an account?</p>
              <Link
                to="/login"
                className="font-Inter font-semibold tracking-[2%] text-[#5f5f5f] hover:text-black hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full 2xsm:h-[10vh] md:h-full">
          <img
            src={`${BASE_URL}/assets/sign-up-bg.jpg`}
            alt="Plant Background"
            className="w-full object-cover h-[10vh] 2xsm:object-bottom md:object-center md:h-screen"
          />
        </div>
      </div>
    );
  }
}

export default SignUp;
