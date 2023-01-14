import React, { ChangeEvent, Component, FormEvent } from "react";
import { IUser, IUserLoad } from "../../models/user";
import CloseButton from "../CloseButton";
import FormInput from "../FormInput";
import Label from "../Label";
import SaveButton from "../SaveButton";
import API_USER from "../../api/user";
import { digitsOnly, formatPhoneNumber } from "../../util";
import { IFormError } from "../../util/mongooseValidator";
import FormError from "../FormError";
import validator from "validator";

type PersonalInfoModalProps = {
  close: () => void;
  user: IUserLoad;
  token: string | null;
  updateUser: (user: IUser) => void;
};

type PersonalInfoModalState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  submitDisabled: boolean;
  error: boolean;
  errors: IFormError;
};

class PersonalInfoModal extends Component<
  PersonalInfoModalProps,
  PersonalInfoModalState
> {
  constructor(props: PersonalInfoModalProps) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      submitDisabled: true,
      error: false,
      errors: {},
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneNumChange = this.handlePhoneNumChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ 
      firstName: e.target.value, 
      error: Object.entries(this.state.errors).length > 0
    });
  }

  handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ 
      lastName: e.target.value, 
      error: Object.entries(this.state.errors).length > 0
    });
  }

  handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ 
      email: e.target.value, 
      error: Object.entries(this.state.errors).length > 0
    });
  }

  handlePhoneNumChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ 
      phoneNumber: formatPhoneNumber(e.target.value), 
      error: Object.entries(this.state.errors).length > 0
    });
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.handleSubmit(e);
    }
  }

  createFormError(field: string, errorMsg: string) {
    const newError = this.state.errors;
    newError[field] = errorMsg;
    const errorExists = Object.entries(newError).length > 0;
    this.setState({ error: errorExists, errors: newError });
  }

  handleErrors() {
    const {phoneNumber} = this.state;
    this.setState({errors: {}, error: false});
    if (validator.isEmpty(digitsOnly(phoneNumber)) && validator.isAlpha(phoneNumber)) {
      this.createFormError("phoneNumber", "Phone number can not have letters.");
    }
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.handleErrors();
    if (this.isValidSubmit() && this.props.user && this.props.token) {
      const { _id } = this.props.user;
      const { submitDisabled, errors, error, ...fields } = this.state;
      fields.phoneNumber = digitsOnly(fields.phoneNumber);
      const fieldArr = Object.entries(fields);
      const filteredFieldArr = fieldArr.filter(([key, val]) => val !== "");
      const filterField = Object.fromEntries(filteredFieldArr);
      await API_USER.updateUserPartial(_id.toString(), filterField).catch(
        (e) => {
          const errors = e.response.data.errors;
          const hasErrors = Object.entries(errors).length > 0;
          this.setState({ error: hasErrors, errors });
        }
      );
      const updatedUser = await API_USER.getUserById(_id.toString()) as IUser;
      this.props.updateUser(updatedUser);
      if (!this.state.error) {
        this.setState({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          error: false,
          errors: {}
        });
        this.props.close();
      }
    }
  }

  isValidSubmit() {
    const { firstName, lastName, email, phoneNumber } = this.state;
    const stateCheckArr = [firstName, lastName, email, phoneNumber];
    return !stateCheckArr.every((field) => field === "");
  }

  render() {
    const formErrorStyles = (field: string) =>
      this.state.error && this.state.errors[field]
        ? "border-red-500 focus:border-red-500 bg-red-100 animate-shake"
        : "";
    return (
      <div className="flex flex-row justify-center items-center">
        <form
          className="fixed flex flex-col bg-white p-8 rounded-[20px] translate-y-[50vh] z-50 2xsm:w-[90vw] sm:w-[60vw] base:w-[40vw]"
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
          onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) =>
            this.onKeyDown(e)
          }
        >
          <div className="flex flex-row justify-between items-center">
            <p className="font-Inter text-black font-semibold tracking-[-2%] 2xsm:text-lg base:text-xl">
              Edit Personal Info
            </p>
            <CloseButton onClick={this.props.close} />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="firstName">First Name *</Label>
            <FormInput
              type="text"
              placeholder={this.props.user?.firstName}
              value={this.state.firstName}
              id="firstName"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleFirstNameChange(e)
              }
              className={formErrorStyles("firstName")}
            />
            {this.state.error && this.state.errors["firstName"] && (
              <FormError error={this.state.errors["firstName"]} />
            )}
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="lastName">Last Name *</Label>
            <FormInput
              type="text"
              placeholder={this.props.user?.lastName}
              value={this.state.lastName}
              id="lastName"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleLastNameChange(e)
              }
              className={formErrorStyles("lastName")}
            />
            {this.state.error && this.state.errors["lastName"] && (
              <FormError error={this.state.errors["lastName"]} />
            )}
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="email">Email *</Label>
            <FormInput
              type="text"
              placeholder={this.props.user?.email}
              value={this.state.email}
              id="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleEmailChange(e)
              }
              className={formErrorStyles("email")}
            />
            {this.state.error && this.state.errors["email"] && (
              <FormError error={this.state.errors["email"]} />
            )}
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <FormInput
              type="tel"
              placeholder={formatPhoneNumber(
                this.props.user?.phoneNumber || ""
              )}
              value={this.state.phoneNumber}
              id="phoneNumber"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handlePhoneNumChange(e)
              }
              className={formErrorStyles("phoneNumber")}
            />
            {this.state.error && this.state.errors["phoneNumber"] && (
              <FormError error={this.state.errors["phoneNumber"]} />
            )}
          </div>
          <div className="flex flex-row justify-center mt-8">
            <SaveButton disabled={!this.isValidSubmit()} />
          </div>
        </form>
      </div>
    );
  }
}

export default PersonalInfoModal;

