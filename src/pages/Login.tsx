import React, { Component, DragEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import API_AUTH from "../api/auth";
import LoginForm from "../components/LoginForm";
import HTTPRequestError from "../util/httpError";

const BASE_URL = process.env.PUBLIC_URL;

type LoginState = {
  token: string | null;
  isValidToken: boolean;
};

class Login extends Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      token: API_AUTH.getAccessToken(),
      isValidToken: false,
    };
  }

  async validateToken() {
    const { token } = this.state;
    if (!token) this.setState({ isValidToken: false });
    try {
      const accessToken = (await API_AUTH.refresh()) as
        | string
        | HTTPRequestError;
      if (!Object.keys(accessToken).includes("success")) {
        this.setState({ token: accessToken as string, isValidToken: true });
        // console.log("refresh token given...", accessToken);
      }
      // console.log(accessToken);
    } catch (error) {
      this.setState({ isValidToken: false });
    }
  }

  async componentDidMount() {
    if (this.state.token) {
      await this.validateToken();
      try {
        const userId = (await API_AUTH.getUserId()) as string | HTTPRequestError;
        if (!Object.keys(userId).includes("message")) {
          this.setState({ isValidToken: true });
          // console.log("fetched user id...", userId);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    if (this.state.isValidToken) return <Navigate to="/" replace />;
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
                  draggable={false}
                  onDragStart={(e: DragEvent<HTMLImageElement>) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </span>
              <p className="font-SansThai text-black font-medium leading-5 text-4xl">
                forest.
              </p>
            </div>
          </div>
          <p className="w-full text-center text-Inter text-3xl text-black font-semibold my-8">
            Log in into your account
          </p>
          <LoginForm />
          <div className="w-full h-fit flex-row my-4 text-center justify-center md:text-right md:justify-end">
            <div className="flex gap-2 text-base flex-col sm:flex-row justify-center md:justify-end">
              <p className="font-Inter">Don't have an account?</p>
              <Link
                to="/signup"
                className="font-Inter font-semibold tracking-[2%] text-[#5f5f5f] hover:text-black hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full 2xsm:h-[10vh] md:h-full">
          <img
            src={`${BASE_URL}/assets/login-bg.jpg`}
            alt="Plant Background"
            className="w-full object-cover h-[10vh] 2xsm:object-bottom md:object-center md:h-screen"
          />
        </div>
      </div>
    );
  }
}

export default Login;
