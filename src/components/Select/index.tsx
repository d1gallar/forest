import React, { Component, ReactNode } from "react";

type SelectProps = {
  name: string;
  id: string;
  value: string;
  children: ReactNode[] | ReactNode;
  styles: string;
  onChange: (val: string) => void;
};

type SelectState = {
  value: string;
};

export default class Select extends Component<SelectProps, SelectState> {
  constructor(props: SelectProps) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
  }

  renderChildren() {
    if (!(this.props.children instanceof Array)) return this.props.children;
    return this.props.children;
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const {onChange} = this.props;
    const value: string = e.target.value;
    this.setState({
      value
    });
    onChange(value);
  }

  render() {
    const { name, id, styles} = this.props;
    return (
      <select
        name={name}
        id={id}
        value={this.state.value}
        onChange={(e) => this.handleChange(e)}
        className={styles}
      >
        {this.renderChildren()}
      </select>
    );
  }
}
