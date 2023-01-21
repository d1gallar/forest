import React, { ChangeEvent, Component, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import validator from "validator";
import { hasDigit, hasEightChars, hasOneUpperCase } from "../../util";
import { IFormError } from "../../util/mongooseValidator";
import FormError from "../FormError";
import API_AUTH from "../../api/auth";

type RegisterFormState = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isSuccess: boolean;
  isError: boolean;
  errors: IFormError;
};

class RegisterForm extends Component<{}, RegisterFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      isSuccess: false,
      isError: false,
      errors: {},
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const { email, ...errors } = this.state.errors;
    this.setState({
      email: e.currentTarget.value,
      isError: Object.entries(errors).length > 0,
      errors,
    });
  }

  onFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    const { firstName, ...errors } = this.state.errors;
    this.setState({
      firstName: e.currentTarget.value,
      isError: Object.entries(errors).length > 0,
      errors,
    });
  }

  onLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    const { lastName, ...errors } = this.state.errors;
    this.setState({
      lastName: e.currentTarget.value,
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

  createFormError(field: string, errorMsg: string) {
    const newError = this.state.errors;
    newError[field] = errorMsg;
    const errorExists = Object.entries(newError).length > 0;
    this.setState({ isError: errorExists, errors: newError });
  }

  async handleFormErrors() {
    const { email, password } = this.state;
    if (!validator.isEmail(email)) {
      this.createFormError("email", "Invalid email.");
    }
    if (!hasOneUpperCase(password)) {
      this.createFormError("password", "Requires an uppercase letter.");
    }
    if (!hasEightChars(password)) {
      this.createFormError("password", "Requires a minimum of 8 characters.");
    }
    if (!hasDigit(password)) {
      this.createFormError("password", "Requires at least one number.");
    }
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await this.handleFormErrors();
    if (!this.state.isError) {
      const { isError, errors, isSuccess, ...fields } = this.state;
      // console.log("submission", fields);
      const token = await API_AUTH.register(fields).catch((e) => {
        const errors = e.response.data.errors;
        // console.log('error',e.response.data)
        const responseErrors = { ...errors, ...this.state.errors };
        const errorExists = Object.entries(responseErrors).length > 0;
        this.setState({ isError: errorExists, errors: responseErrors });
      });
      if (token) this.setState({ isSuccess: true });
    }
  }

  isSubmitDisabled() {
    const { email, firstName, lastName, password } = this.state;
    const stateCheckArr = [email, firstName, lastName, password];
    return stateCheckArr.every((field) => field !== "");
  }

  render() {
    const formErrorStyles = (field: string) =>
      this.state.isError && this.state.errors[field]
        ? "border-red-500 focus:outline-red-500 focus:border-red-500 bg-red-100 animate-shake"
        : "border-[#979797] focus:outline-[#424242] focus:border-[#424242]";
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
              formErrorStyles("email")
            }
          />
          {this.state.isError && this.state.errors["email"] && (
            <FormError error={this.state.errors["email"]} />
          )}
        </div>
        <div className="flex flex-col my-6">
          <label
            htmlFor="firstName"
            className="font-Inter text-sm text-black font-medium mb-1"
          >
            First Name *
          </label>
          <input
            type="text"
            placeholder="First Name"
            id="firstName"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.onFirstNameChange(e)
            }
            className={
              "w-full px-4 py-2 font-PlexSans text-sm border-2 rounded-[7.5px] autofill:text-sm hover:outline hover:outline-solid hover:outline-[#f1f1f1] hover:outline-[3px] focus:border-1 focus:outline focus:outline-1 selection:bg-[#e3e3e3] " +
              formErrorStyles("firstName")
            }
          />
          {this.state.isError && this.state.errors["firstName"] && (
            <FormError error={this.state.errors["firstName"]} />
          )}
        </div>
        <div className="flex flex-col my-6">
          <label
            htmlFor="lastName"
            className="font-Inter text-sm text-black font-medium mb-1"
          >
            Last Name *
          </label>
          <input
            type="text"
            placeholder="Last Name"
            id="lastName"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.onLastNameChange(e)
            }
            className={
              "w-full px-4 py-2 font-PlexSans text-sm border-2 rounded-[7.5px] autofill:text-sm hover:outline hover:outline-solid hover:outline-[#f1f1f1] hover:outline-[3px] focus:border-1 focus:outline focus:outline-1 selection:bg-[#e3e3e3] " +
              formErrorStyles("lastName")
            }
          />
          {this.state.isError && this.state.errors["lastName"] && (
            <FormError error={this.state.errors["lastName"]} />
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
              formErrorStyles("password")
            }
          />
          {this.state.isError && this.state.errors["password"] && (
            <FormError error={this.state.errors["password"]} />
          )}
        </div>
        <button
          type="submit"
          className="font-Inter w-full h-fit px-2 py-3 bg-black rounded-[50px] text-sm text-white font-semibold my-6 tracking-wide disabled:bg-[#646464] disabled:cursor-default"
          disabled={!this.isSubmitDisabled()}
        >
          Sign Up
        </button>
      </form>
    );
  }
}

export default RegisterForm;
