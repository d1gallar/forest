import React, { ChangeEvent, Component } from "react";

type FormInputProps = {
  id?: string | undefined;
  value?: string | undefined;
  type: string;
  placeholder?: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

class FormInput extends Component<FormInputProps, {}> {
  render() {
    return (
      <React.Fragment>
        <input
          type={this.props.type}
          placeholder={this.props.placeholder}
          id={this.props.id}
          onChange={this.props.onChange}
          className={`w-full px-4 py-2 border-2 border-[#c8c8c8] rounded-[7.5px] focus:outline-none focus:border-[#979797] appearance-none ${this.props.className}`}
          value={this.props.value}
        />
      </React.Fragment>
    );
  }
}

export default FormInput;
