import React, { ChangeEvent, Component, FormEvent } from "react";
import CloseButton from "../CloseButton";
import FormInput from "../FormInput";
import Label from "../Label";
import SaveButton from "../SaveButton";
import API_USER from "../../api/user";
import { IUser, IUserLoad } from "../../models/user";
import { IFormError } from "../../util/mongooseValidator";
import FormError from "../FormError";
import {
  hasDigit,
  hasEightChars,
  hasLowercase,
  hasOneUpperCase,
  isEmptyString,
} from "../../util";

type PasswordModalProps = {
  close: () => void;
  user: IUserLoad;
  updateUser: (user: IUser) => void;
};

type PasswordModalState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submitDisabled: boolean;
  error: boolean;
  errors: IFormError;
};

class PasswordModal extends Component<PasswordModalProps, PasswordModalState> {
  constructor(props: PasswordModalProps) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      submitDisabled: true,
      error: false,
      errors: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
    this.onCurrentPasswordChange = this.onCurrentPasswordChange.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onCurrentPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const { currentPassword, ...errors } = this.state.errors;
    this.setState({
      currentPassword: e.currentTarget.value,
      error: Object.entries(errors).length > 0,
      errors,
    });
  }

  onNewPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const { newPassword, ...errors } = this.state.errors;
    this.setState({
      newPassword: e.currentTarget.value,
      error: Object.entries(errors).length > 0,
      errors,
    });
  }

  onConfirmPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const { confirmPassword, ...errors } = this.state.errors;
    this.setState({
      confirmPassword: e.currentTarget.value,
      error: Object.entries(errors).length > 0,
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
    this.setState({ error: errorExists, errors: newError });
  }

  handleErrors() {
    const { newPassword, confirmPassword } = this.state;
    if (!hasDigit(newPassword)) {
      this.createFormError("newPassword", "Requires at least one number.");
    }
    if (!hasDigit(confirmPassword)) {
      this.createFormError("confirmPassword", "Requires at least one number.");
    }
    if (!hasOneUpperCase(newPassword)) {
      this.createFormError(
        "newPassword",
        "Requires at least one uppercase character."
      );
    }
    if (!hasOneUpperCase(confirmPassword)) {
      this.createFormError(
        "confirmPassword",
        "Requires at least one uppercase character."
      );
    }
    if (!hasLowercase(newPassword)) {
      this.createFormError(
        "newPassword",
        "Requires at least one lowercase character."
      );
    }
    if (!hasLowercase(confirmPassword)) {
      this.createFormError(
        "confirmPassword",
        "Requires at least one lowercase character."
      );
    }
    if (!hasEightChars(newPassword)) {
      this.createFormError(
        "newPassword",
        "Requires a minimum of 8 characters."
      );
    }
    if (!hasEightChars(confirmPassword)) {
      this.createFormError(
        "confirmPassword",
        "Requires a minimum of 8 characters."
      );
    }
    if (newPassword !== confirmPassword) {
      this.createFormError("confirmPassword", "Passwords do not match.");
      this.createFormError("newPassword", "Passwords do not match.");
    }
    if (isEmptyString(newPassword)) {
      this.createFormError("newPassword", "Password is required.");
    }
    if (isEmptyString(confirmPassword)) {
      this.createFormError("confirmPassword", "Password is required.");
    }
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { user } = this.props;
    this.handleErrors();
    if (this.isValidSubmit() && user) {
      const { _id } = user;
      await API_USER.updateUserPartial(_id.toString(), {
        password: this.state.newPassword,
        currentPassword: this.state.currentPassword
      }).catch((e) => {
        const errors = e.response.data.errors;
        const responseErrors = { ...errors, ...this.state.errors };
        const errorExists = Object.entries(responseErrors).length > 0;
        this.setState({ error: errorExists, errors: responseErrors });
      });
      // console.log(this.state)
      const updatedUser = await API_USER.getUserById(_id.toString()) as IUser;
      this.props.updateUser(updatedUser);
      if (!this.state.error) {
        this.setState({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          error: false,
          errors: {},
        });
        this.props.close();
      }
    }
  }

  // Disables button if the fields are empty
  isValidSubmit() {
    const { currentPassword, newPassword, confirmPassword } = this.state;
    const stateCheckArr = [currentPassword, newPassword, confirmPassword];
    return stateCheckArr.every((val) => val !== "");
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
            <p className="font-Inter text-xl text-black font-semibold tracking-[-2%]">
              Edit Password
            </p>
            <CloseButton onClick={this.props.close} />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <FormInput
              type="password"
              id="currentPassword"
              className={formErrorStyles("currentPassword")}
              onChange={(e) => this.onCurrentPasswordChange(e)}
            />
            {this.state.error && this.state.errors["currentPassword"] && (
              <FormError error={this.state.errors["currentPassword"]} />
            )}
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="newPassword">New Password *</Label>
            <FormInput
              type="password"
              id="newPassword"
              className={
                formErrorStyles("newPassword") || formErrorStyles("password")
              }
              onChange={(e) => this.onNewPasswordChange(e)}
            />
            {this.state.error &&
              (this.state.errors["newPassword"] ||
                this.state.errors["password"]) && (
                <FormError
                  error={
                    this.state.errors["newPassword"] ||
                    this.state.errors["password"]
                  }
                />
              )}
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
            <FormInput
              type="password"
              id="confirmPassword"
              className={formErrorStyles("confirmPassword")}
              onChange={(e) => this.onConfirmPasswordChange(e)}
            />
            {this.state.error && this.state.errors["confirmPassword"] && (
              <FormError error={this.state.errors["confirmPassword"]} />
            )}
          </div>
          <div className="flex flex-col justify-start font-Inter text-sm tracking-tight text-[#7E7E7E]">
            <p>Password Requirements:</p>
            <p>Minumum 8 characters</p>
            <p>Uppercase, lowercase letters, and one number</p>
          </div>
          <div className="flex flex-row justify-center mt-8">
            <SaveButton disabled={!this.isValidSubmit()} />
          </div>
        </form>
      </div>
    );
  }
}

export default PasswordModal;
