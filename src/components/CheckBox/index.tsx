import React, { Component } from "react";

type CheckboxProps = {
  id?: string | undefined;
  checked: boolean;
  onChange: () => void;
  className?: string | undefined;
};

export default class Checkbox extends Component<CheckboxProps, {}> {
  render() {
    return (
      <input
        type="checkbox"
        className={`accent-black bg-black focus:ring-black border-black outline-none ${this.props.className}`}
        id={this.props.id}
        checked={this.props.checked}
        onChange={this.props.onChange}
      />
    );
  }
}
