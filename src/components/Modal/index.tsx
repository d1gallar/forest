import React, { Component, ReactNode } from "react";

type ModalProps = {
  isModalInView: boolean;
  children: ReactNode[] | ReactNode;
};

class Modal extends Component<ModalProps, {}> {
  render() {
    return (
      <div
        className={
          this.props.isModalInView
            ? "filter brightness-[30%] backdrop-blur-sm z-100"
            : ""
        }
      >
        {this.props.children}
      </div>
    );
  }
}

export default Modal;
