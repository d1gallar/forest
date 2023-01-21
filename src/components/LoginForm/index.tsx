import React, { ChangeEvent, Component, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import validator from "validator";
import API_AUTH from "../../api/auth";
import { IUser } from "../../models/user";
import HTTPRequestError from "../../util/httpError";
import { IFormError } from "../../util/mongooseValidator";
import FormError from "../FormError";

type LoginFormState = {
  email: string;
  password: string;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
  errors: IFormError;
};

class LoginForm extends Component<{}, LoginFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isSuccess: false,
      isError: false,
      isFetching: false,
      errors: {},
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const { email, ...errors } = this.state.errors;
    this.setState({
      email: e.currentTarget.value,
      isError: Object.entries(errors).length > 0,
      errors,
    });
  }

  onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const { password, ...errors } = this.state.errors;
    this.setState({
      password: e.currentTarget.value,
      isError: Object.entries(errors).length > 0,
      errors,
    });
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.handleSubmit(e);
    }
  };

  createFormError(field: string, errorMsg: string) {
    const newError = this.state.errors;
    newError[field] = errorMsg;
    const errorExists = Object.entries(newError).length > 0;
    this.setState({ isError: errorExists, errors: newError });
  }

  async handleFormErrors() {
    const { email } = this.state;
    if (!validator.isEmail(email)) {
      this.createFormError("email", "Invalid email.");
    }
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.setState({isError: false, errors: {}})
    await this.handleFormErrors();
    if (!this.state.isError) {
      const { email, password } = this.state;
      const fields = { email, password };
      this.setState({ isFetching: true });
      // console.log("Logging in..", fields);
      const response = (await API_AUTH.login(fields)) as
        | { accessToken: string, user: IUser }
        | HTTPRequestError;
      this.setState({ isFetching: false});
      if (
        Object.keys(response).includes("success")
      ) {
        const typedError = response as HTTPRequestError;
        // console.log("Error!", typedError);
        const errors = typedError.errors;
        const responseErrors = { ...errors, ...this.state.errors };
        const errorExists = Object.entries(responseErrors).length > 0;
        this.setState({ isError: errorExists, errors: responseErrors });
      } else if(Object.keys(response).includes("accessToken")){
        const tokenResponse = response as {accessToken: string};
        const accessToken = tokenResponse.accessToken;
        // console.log({accessToken})
        this.setState({ isSuccess: true, isError: false});
      }
    }
  }

  isSubmitDisabled() {
    const { email, password } = this.state;
    const stateCheckArr = [email, password];
    return stateCheckArr.every((field) => field !== "");
  }

  render() {
    const formErrorStyles = (field: string) => {
      let style =
        "border-[#979797] focus:outline-[#424242] focus:border-[#424242]";
      if (
        this.state.isError &&
        this.state.errors[field] &&
        (field === "email" || field === "both")
      ) {
        style =
          "border-red-500 focus:outline-red-500 focus:border-red-500 bg-red-100 animate-shake";
      } else if (
        this.state.isError &&
        !this.state.errors[field] &&
        field === "email"
      ) {
        style = "";
      }
      return style;
    };
    if (this.state.isSuccess) return <Navigate to="/" replace={true} />;
    return (
      <form
        className="w-full h-fit justify-center"
        onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
      >
        <div className="flex flex-col my-6">
          <label
            htmlFor="email"
            className="font-Inter text-sm text-black font-medium mb-1"
          >
            Email *
          </label>

          <input
            type="text"
            placeholder="Email"
            id="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.onEmailChange(e)
            }
            className={
              "w-full px-4 py-2 font-PlexSans text-sm border-2 rounded-[7.5px] autofill:text-sm hover:outline hover:outline-solid hover:outline-[#f1f1f1] hover:outline-[3px] focus:border-1 focus:outline focus:outline-1 selection:bg-[#e3e3e3] " +
              formErrorStyles("email") +
              formErrorStyles("both")
            }
          />
          {this.state.isError && this.state.errors["email"] && (
            <FormError error={this.state.errors["email"]} />
          )}
        </div>
        <div className="flex flex-col my-6">
          <label
            htmlFor="password"
            className="font-Inter text-sm text-black font-medium mb-1"
          >
            Password *
          </label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.onPasswordChange(e)
            }
            className={
              "w-full px-4 py-2 font-PlexSans text-sm border-2 rounded-[7.5px] autofill:text-sm hover:outline hover:outline-solid hover:outline-[#f1f1f1] hover:outline-[3px] focus:border-1 focus:outline focus:outline-1 selection:bg-[#e3e3e3] " +
              formErrorStyles("both")
            }
          />
          {this.state.isError && this.state.errors["both"] && (
            <FormError error={this.state.errors["both"]} />
          )}
        </div>
        <button
          type="submit"
          className="font-Inter w-full h-fit px-2 py-3 bg-black rounded-[50px] text-sm text-white font-semibold my-6 tracking-wide disabled:bg-[#646464] disabled:cursor-default"
          disabled={!this.isSubmitDisabled()}
        >
          Login
        </button>
      </form>
    );
  }
}

export default LoginForm;
