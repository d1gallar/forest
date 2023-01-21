import React, { Component, FormEvent } from "react";
import validator from "validator";
import { IFormError } from "../../util/mongooseValidator";
import { CheckoutFormData } from "../CheckoutForm";
import Heading from "../Heading";

type PersonalDetailsFormProps = {
  data: CheckoutFormData;
  updateField: (fields: Partial<CheckoutFormData>) => void;
  prev: () => void;
  next: () => void;
};

type PersonalDetailsFormState = {
  submitDisabled: boolean;
  hasError: boolean;
  errors: IFormError;
};

export default class PersonalDetailsForm extends Component<
  PersonalDetailsFormProps,
  PersonalDetailsFormState
> {
  constructor(props: PersonalDetailsFormProps) {
    super(props);
    this.state = { submitDisabled: false, hasError: false, errors: {} };
    this.isSubmitDisabled = this.isSubmitDisabled.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isSubmitDisabled() {
    const { email, firstName, lastName } = this.props.data;
    const stateCheckArr = [email, firstName, lastName];
    return stateCheckArr.every((field) => field !== "");
  }

  async handleErrors() {
    const { email } = this.props.data;
    const errors: IFormError = {};
    if (!validator.isEmail(email)) {
      errors["email"] = "The email is invalid.";
    }
    const hasError = Object.entries(errors).length > 0;
    await this.setState({ errors, hasError });
  }


  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await this.handleErrors();
    // console.log(this.state.errors);
    if (!this.state.hasError) {
      this.props.next();
    }
  }

  render() {
    const { firstName, lastName, email, phoneNumber } = this.props.data;
    return (
      <React.Fragment>
        <Heading level="2" title="Personal Info" />
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="font-medium text-[#30313D]">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              required
              onChange={(e) =>
                this.props.updateField({ firstName: e.target.value })
              }
              className="px-4 py-2 border-2 border-[#C1D1D2] rounded-lg outline-none focus:border-black focus:border-1 focus:outline-[3px] focus:outline-[#00000021] focus:outline-offset-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="font-medium text-[#30313D]">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              required
              onChange={(e) =>
                this.props.updateField({ lastName: e.target.value })
              }
              className="px-4 py-2 border-2 border-[#C1D1D2] rounded-lg outline-none focus:border-black focus:border-1 focus:outline-[3px] focus:outline-[#00000021] focus:outline-offset-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-[#30313D]">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={email}
              required
              onChange={(e) =>
                this.props.updateField({ email: e.target.value })
              }
              className={`px-4 py-2 border-2 border-[#C1D1D2] rounded-lg outline-none`+(this.state.errors["email"] ? " border-[#ef4444] focus:border-[#ef4444] focus:outline-[#ef444444] focus:outline-[3px] focus:outline-offset-0":" focus:border-black focus:border-1 focus:outline-[3px] focus:outline-[#00000021] focus:outline-offset-0")}
            />
            {
              this.state.hasError && this.state.errors["email"] && <p className="font-Inter text-[#ef4444] text-sm">{this.state.errors["email"]}</p>
            }
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNum" className="font-medium text-[#30313D]">
              Phone number (optional)
            </label>
            <input
              type="text"
              name="phoneNum"
              value={phoneNumber}
              onChange={(e) =>
                this.props.updateField({ phoneNumber: e.target.value })
              }
              className="px-4 py-2 border-2 border-[#C1D1D2] rounded-lg outline-none focus:border-black focus:border-1 focus:outline-[3px] focus:outline-[#00000021] focus:outline-offset-0"
            />
          </div>
          <button
            type="submit"
            disabled={!this.isSubmitDisabled()}
            className="bg-black text-white rounded-full px-4 py-2 mt-6 w-full disabled:bg-[#000000ae] disabled:pointer-default"
          >
            Next
          </button>
        </form>
      </React.Fragment>
    );
  }
}
