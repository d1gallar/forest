import React, { Component } from 'react';

type OptionProps = {
  value: string;
}

class Option extends Component<OptionProps> {
  render() {
    const {value} = this.props;
    return (
      <option value={value.toLowerCase()}>
        {value}
      </option>
    )
  }
}

export default Option;
