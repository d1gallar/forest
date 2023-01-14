import React, { Component } from "react";

type SaveButtonProps = {
  disabled?: boolean | undefined;
};

class SaveButton extends Component<SaveButtonProps, {}> {
  render() {
    return (
      <button
      className="text-center bg-black text-white text-base font-Inter w-3/4 px-4 py-2 rounded-[50px] disabled:bg-[#646464] disabled:cursor-default"
        disabled={this.props.disabled}
        type="submit"
      >
        Save
      </button>
    );
  }
}

export default SaveButton;
