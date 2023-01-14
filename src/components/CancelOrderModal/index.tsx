import React, { ChangeEvent, Component, FormEvent } from "react";
import CloseButton from "../CloseButton";

type CancelOrderModalProps = {
  close: () => void;
  cancelOrder: () => void;
  updateCancelReason: (cancelReason: string) => void;
};

type CancelOrderModalState = {
  isChecked: boolean;
  radioValue: string;
  cancel: { [key: string]: boolean };
  showTextBox: boolean;
  text: string;
};

class CancelOrderModal extends Component<
  CancelOrderModalProps,
  CancelOrderModalState
> {
  constructor(props: CancelOrderModalProps) {
    super(props);
    this.state = {
      isChecked: false,
      radioValue: "",
      cancel: {
        "Technical Issues": false,
        "Too expensive": false,
        "Found another product": false,
        Other: false,
      },
      showTextBox: false,
      text: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.state.radioValue === "Other") {
      this.props.updateCancelReason(this.state.text);
    } else {
      this.props.updateCancelReason(this.state.radioValue);
    }
    this.props.cancelOrder();
    this.props.close();
  }

  handleCheckbox(e: ChangeEvent<HTMLInputElement>) {
    const { cancel } = this.state;
    cancel[e.target.value] = e.target.checked;
    if (e.target.value === "Other") {
      this.setState({ showTextBox: true });
    } else {
      this.setState({ showTextBox: false });
    }
    this.setState({ radioValue: e.target.value, cancel });
  }

  handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    this.setState({ text: value });
  }

  isValidSubmit() {
    return Object.entries(this.state.cancel).some((x) => x[1] === true);
  }

  render() {
    return (
      <div className="flex flex-row justify-center items-center gap-2">
        <form
          className="fixed flex flex-col bg-white p-8 rounded-[20px] translate-y-[50vh] z-50 2xsm:w-[90vw] sm:w-[60vw] base:w-[40vw]"
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
        >
          <div className="flex flex-row justify-between items-center">
            <p className="font-Inter text-black font-semibold tracking-[-2%] 2xsm:text-lg base:text-xl text-wrap">
              Order Cancellation
            </p>
            <CloseButton onClick={this.props.close} />
          </div>
          <p className="font-Inter text-base font-base tracking-tight mb-4">
            Are you sure you want to cancel your order?
          </p>
          <p className="font-Inter text-base font-medium tracking-tight mb-4">
            Cancellation Reason
          </p>
          <div className="flex flex-col mx-2 gap-2">
            <div className="flex flex-inline gap-2">
              <input
                type="radio"
                className="accent-black bg-black focus:ring-black border-black outline-none"
                name="cancel"
                required
                checked={this.state.cancel.technical}
                onChange={(e) => this.handleCheckbox(e)}
                value="Technical Issues"
              />
              <p className="font-Inter text-base font-base tracking-tight">
                Technical Issues
              </p>
            </div>
            <div className="flex flex-inline gap-2">
              <input
                type="radio"
                className="accent-black bg-black focus:ring-black border-black outline-none"
                name="cancel"
                required
                checked={this.state.cancel.expensive}
                onChange={(e) => this.handleCheckbox(e)}
                value="Too expensive"
              />
              <p className="font-Inter text-base font-base tracking-tight">
                Too expensive
              </p>
            </div>
            <div className="flex flex-inline gap-2">
              <input
                type="radio"
                className="accent-black bg-black focus:ring-black border-black outline-none"
                name="cancel"
                required
                checked={this.state.cancel.anotherProduct}
                onChange={(e) => this.handleCheckbox(e)}
                value="Found another product"
              />
              <p className="font-Inter text-base font-base tracking-tight">
                Found another product
              </p>
            </div>
            <div className="flex flex-inline gap-2">
              <input
                type="radio"
                className="accent-black bg-black focus:ring-black border-black outline-none"
                name="cancel"
                required
                checked={this.state.cancel.other}
                onChange={(e) => this.handleCheckbox(e)}
                value="Other"
              />
              <p className="font-Inter text-base font-base tracking-tight">
                Other
              </p>
            </div>
          </div>
          {this.state.showTextBox && (
            <textarea
              name="cancel"
              id="other"
              cols={1}
              rows={2}
              className="mt-4 border-2 border-[#000000cc] rounded-lg p-4 focus:border-black focus:outline-none selection:bg-[#e3e3e3]"
              autoFocus
              placeholder="Please submit a reason"
              value={this.state.text}
              onChange={(e) => this.handleChange(e)}
            ></textarea>
          )}
          <div className="mt-6 flex flex-col gap-4 justify-center md:flex-row md:justify-end md:gap-2">
            <button
              type="submit"
              disabled={!this.isValidSubmit()}
              className="w-full bg-black px-6 py-2 rounded-[50px] text-white hover:bg-[#252525] disabled:bg-[#646464] disabled:cursor-default md:w-fit"
            >
              Cancel Order
            </button>
            <button
              onClick={this.props.close}
              className="w-full bg-black hover:bg-[#252525] px-6 py-2 rounded-[50px] text-white md:w-fit"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CancelOrderModal;
