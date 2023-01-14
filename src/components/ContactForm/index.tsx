import React, { ChangeEvent, Component, createRef, FormEvent } from "react";
import validator from "validator";
import emailjs from "@emailjs/browser";
import ErrorBanner from "../ErrorBanner";
import SuccessBanner from "../SuccessBanner";
import { IFormError } from "../../util/mongooseValidator";

const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPATE_ID || "";
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
  hasError: boolean;
  errors: IFormError;
  success: boolean;
};

export default class ContactForm extends Component<{}, ContactFormState> {
  private formRef: React.RefObject<HTMLFormElement>;
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      hasError: false,
      errors: {},
      success: false,
    };
    this.formRef = createRef<HTMLFormElement>();
    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
  }

  handleName(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
    this.clearErrors();
  }

  handleEmail(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ email: e.target.value });
    this.clearErrors();
  }

  handleMessage(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ message: e.target.value });
    this.clearErrors();
  }

  clearErrors() {
    this.setState({ errors: {}, hasError: false });
  }

  async handleErrors() {
    if (!validator.isEmail(this.state.email)) {
      this.createFormError("email", "Invalid email!");
    }
    if (validator.isEmpty(this.state.email)) {
      this.createFormError("email", "The email is required.");
    }
    if (validator.isEmpty(this.state.name)) {
      this.createFormError("name", "The name is required.");
    }
    if (validator.isEmpty(this.state.message)) {
      this.createFormError("message", "The message cannot be empty.");
    }
  }

  createFormError(field: string, errorMsg: string) {
    const newError = this.state.errors;
    newError[field] = errorMsg;
    const errorExists = Object.entries(newError).length > 0;
    this.setState({ hasError: errorExists, errors: newError });
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await this.handleErrors();
    if (!this.state.hasError) {
      try {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          this.formRef.current as HTMLFormElement,
          EMAILJS_PUBLIC_KEY
        );
        this.setState({
          message: "",
          email: "",
          name: "",
          errors: {},
          hasError: false,
          success: true,
        });
        setTimeout(() => this.setState({ success: false }), 5000);
      } catch (error) {
        this.setState({
          message: "",
          email: "",
          name: "",
          errors: { submit: "Uh oh! Failed to send email." },
          hasError: true,
          success: false,
        });
      }
    }
  }

  render() {
    const formErrorStyles = (field: string) =>
      this.state.hasError && this.state.errors[field]
        ? "border-red-500 focus:border-red-500 bg-red-100 animate-shake"
        : "";
    const errorLenIsOne = Object.entries(this.state.errors).length === 1;
    return (
      <div className="w-full h-fit flex flex-col gap-10 xsm:px-10">
        {this.state.success && (
          <SuccessBanner timer={true} className="mt-5">
            <p className="font-base my-3">Email was successfully sent!</p>
          </SuccessBanner>
        )}
        {this.state.hasError && (
          <ErrorBanner clear={this.clearErrors} timer={true} className="mt-5">
            {this.state.errors["submit"] ? (
              <p className="font-Inter font-base">
                Uh oh! The email failed to send!
              </p>
            ) : (
              <React.Fragment>
                <p className="font-Inter font-base">
                  {errorLenIsOne ? "Invalid field!" : "Invalid fields!"}
                </p>
                <ul className="list-disc ml-4">
                  {Object.values(this.state.errors).map((msg, i) => {
                    return <li key={i}>{msg}</li>;
                  })}
                </ul>
              </React.Fragment>
            )}
          </ErrorBanner>
        )}
        <div className="flex flex-col w-full">
          <h1 className="font-Inter font-bold text-3xl text-white mb-2">
            Need help? Get in touch!
          </h1>
          <h1 className="font-Inter font-bold text-3xl text-white">
            Contact us!
          </h1>
        </div>
        <form
          ref={this.formRef}
          className="w-full h-auto flex flex-col gap-10"
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="h-fit gap-4 flex flex-col md:flex-row flex-wrap">
              <div className="w-full flex-1 flex flex-col gap-2 min-w-[200px]">
                <label
                  htmlFor="name"
                  className="font-Inter tracking-[2%] text-base text-white"
                >
                  Your name
                </label>
                <input
                  type="text"
                  autoFocus={true}
                  name="name"
                  value={this.state.name}
                  className={
                    `bg-white text-black border-[#E1E1E1] border-2 rounded-md px-4 py-2 w-full outline-none selection:bg-[#e3e3e3] ` +
                    formErrorStyles("name")
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    this.handleName(e)
                  }
                />
              </div>
              <div className="w-full flex-1 flex flex-col gap-2 min-w-[200px]">
                <label
                  htmlFor="email"
                  className="font-Inter tracking-[2%] text-base text-white"
                >
                  Your email
                </label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  className={
                    `bg-white text-black border-[#E1E1E1] border-2 rounded-md px-4 py-2 w-full outline-none selection:bg-[#e3e3e3] ` +
                    formErrorStyles("email")
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    this.handleEmail(e)
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-Inter tracking-[2%] text-base text-white"
              >
                Message
              </label>
              <textarea
                autoComplete="off"
                rows={5}
                name="message"
                value={this.state.message}
                className={
                  `bg-white text-black border-[#E1E1E1]
              border-2 rounded-md px-4 py-2 w-full
              outline-none selection:bg-[#e3e3e3] ` + formErrorStyles("message")
                }
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  this.handleMessage(e)
                }
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 w-full bg-white font-Inter font-semibold text-black rounded-full"
          >
            Send
          </button>
        </form>
      </div>
    );
  }
}
