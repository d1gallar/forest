import React, { Component } from "react";

const BASE_URL = process.env.PUBLIC_URL;

type CloseButtonProps = {
  onClick: () => void;
}

class CloseButton extends Component<CloseButtonProps, {}> {
  render() {
    return (
      <button onClick={this.props.onClick}>
        <img
          src={`${BASE_URL}/assets/cancel-button-icon.svg`}
          className="scale-[60%]"
          alt="Cancel Button"
        />
      </button>
    );
  }
}

export default CloseButton;
