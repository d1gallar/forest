import React, { Component, ReactNode } from "react";

const BASE_URL = process.env.PUBLIC_URL;

type SuccessBannerProps = {
  children: ReactNode | ReactNode[];
  timer?: boolean;
  className?: string;
};

type SuccessBannerState = {
  show: boolean;
  isFadingOut: boolean;
};

export default class SuccessBanner extends Component<
  SuccessBannerProps,
  SuccessBannerState
> {
  constructor(props: SuccessBannerProps) {
    super(props);
    this.state = {
      show: true,
      isFadingOut: false,
    };
    this.hide = this.hide.bind(this);
  }

  hide() {
    this.setState({ isFadingOut: true });
    setTimeout(() => this.setState({ show: false }), 400);
  }

  componentDidMount(): void {
    if (this.props.timer) setTimeout(this.hide, 5000);
  }

  render() {
    if (!this.state.show) return null;
    return (
      <div
        className={
          `flex flex-row justify-between bg-[#BCD49C] px-4 py-2 rounded-md animate-fadeTop ` +
          (this.state.isFadingOut && "animate-fadeBottom ") +
          this.props.className
        }
      >
        <div className="flex flex-row items-center gap-2">
          <img
            src={`${BASE_URL}/assets/success-icon.svg`}
            alt="Success Icon"
          />
          <div className="font-Inter text-sm tracking-tight font-base">
            {this.props.children}
          </div>
        </div>
        <button onClick={this.hide}>
          <img
            src={`${BASE_URL}/assets/cancel-bold-icon.svg`}
            alt="Cancel Icon"
          />
        </button>
      </div>
    );
  }
}
