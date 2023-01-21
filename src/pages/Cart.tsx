import React, { Component } from "react";
import Page from "../components/Page";
import PageContainer from "../components/PageContainer";
import ShoppingCart from "../components/ShoppingCart";
import { IUser, IUserLoad } from "../models/user";
import API_AUTH from "../api/auth";
import API_USER from "../api/user";
import { Navigate } from "react-router-dom";
import HTTPRequestError from "../util/httpError";
import { IFormError } from "../util/mongooseValidator";
import Loader from "../components/Loader";

type CartState = {
  token: string | null;
  user: IUserLoad;
  isFetching: boolean;
  error: HTTPRequestError | null;
};

class Cart extends Component<{}, CartState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      token: API_AUTH.getAccessToken(),
      user: null,
      isFetching: false,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      this.setState({ isFetching: true });
      const userId = await API_AUTH.getUserId();
      if (typeof userId === "string") {
        const user = (await API_USER.getUserById(userId)) as Object;
        if (Object.keys(user).includes("_id")) {
          const responseUser = { ...user } as IUser;
          // console.log("Retrieved user...", responseUser);
          this.setState({ user: responseUser });
        } else {
          throw new HTTPRequestError(
            404,
            "USER NOT FOUND",
            "Failed to retrieve the user.",
            {
              id: "Failed to retrieve the user.",
            } as IFormError
          );
        }
      } else {
        throw new HTTPRequestError(
          404,
          "USER ID NOT FOUND",
          "Failed to retrieve user's id.",
          {
            id: "Failed to retrieve the user's id.",
          } as IFormError
        );
      }
      this.setState({ isFetching: false });
    } catch (error) {
      const httpError = error as HTTPRequestError;
      // console.log(httpError);
      this.setState({ error: httpError });
    }
  }

  render() {
    if (this.state.error) return <Navigate state={"/"} to="/login" replace />;

    return (
      <Page>
        <PageContainer>
          {this.state.isFetching ? (
            <div className="flex justify-center items-center h-[60vh]">
              <Loader />
            </div>
          ) : this.state.user ? (
            <ShoppingCart user={this.state.user} />
          ) : null}
        </PageContainer>
      </Page>
    );
  }
}

export default Cart;
