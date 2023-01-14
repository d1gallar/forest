import React, { Component, FormEvent } from "react";
import { IUserLoad } from "../../models/user";
import Checkbox from "../CheckBox";
import CloseButton from "../CloseButton";
import API_USER from "../../api/user";
import API_AUTH from "../../api/auth";
import { Navigate } from "react-router-dom";

type DeleteAccountModalProps = {
  close: () => void;
  user: IUserLoad;
  token: string | null;
  updateToken: (val: string | null) => void;
};

type DeleteAccountModalState = {
  isChecked: boolean;
  isSuccess: boolean;
};

class DeleteAccountModal extends Component<
  DeleteAccountModalProps,
  DeleteAccountModalState
> {
  constructor(props: DeleteAccountModalProps) {
    super(props);
    this.state = {
      isChecked: false,
      isSuccess: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const {user} = this.props;
    if(this.isValidSubmit() && user){
      const {_id} = user;
      const deletedUser = await API_USER.deleteUser(_id.toString());
      console.log("deleted", deletedUser);
      await API_AUTH.logout();
      this.props.updateToken(null);
      this.setState({isSuccess: true});
    }
  }

  onCheckboxChange() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  isValidSubmit() {
    return this.state.isChecked;
  }

  render() {
    if(this.state.isSuccess) return <Navigate to="/" replace />
    return (
      <div className="flex flex-row justify-center items-center gap-2">
        <form
          className="fixed flex flex-col bg-white p-8 rounded-[20px] translate-y-[50vh] z-50 2xsm:w-[90vw] sm:w-[60vw] base:w-[40vw]"
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
        >
          <div className="flex flex-row justify-between items-center">
            <p className="font-Inter text-black font-semibold tracking-[-2%] 2xsm:text-lg base:text-xl text-wrap">
              Are you sure you want to delete your account?
            </p>
            <CloseButton onClick={this.props.close} />
          </div>
          <div className="w-full mt-4 mb-6 font-Inter">
            <p className="font-semibold text-lg">By Deleting Your Profile:</p>
            <ul className="font-base tracking-tight text-base list-disc mx-6">
              <li>You will no longer have access to this account. </li>
              <li>
                Information related to orders will be available by contacting
                consumer services.
              </li>
              <li>
                Your mobile app data will be accessible until you log out or
                uninstall the app.
              </li>
            </ul>
          </div>
          <div className="flex flex-row mx-2 gap-2">
            <Checkbox
              checked={this.state.isChecked}
              onChange={this.onCheckboxChange}
              className="transform: scale-125"
            />
            <p className="font-Inter text-base font-base tracking-tight">
              Yes, I want to delete this account. I cannot undo this action.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="submit"
              disabled={!this.isValidSubmit()}
              className="w-fit bg-black px-6 py-2 rounded-[50px] text-white hover:bg-[#252525] disabled:bg-[#646464] disabled:cursor-default"
            >
              Delete
            </button>
            <button
              onClick={this.props.close}
              className="bg-black hover:bg-[#252525] px-6 py-2 rounded-[50px] text-white w-fit"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default DeleteAccountModal;
