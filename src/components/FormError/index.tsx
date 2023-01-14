import React, { Component, ReactNode } from 'react';

type FormErrorProp = {
  error: ReactNode | ReactNode[];
}

class FormError extends Component<FormErrorProp, {}> {
  render() {
    return (
      <p className='font-Inter text-base text-red-500 mt-2'>{this.props.error}</p>
    )
  }
}

export default FormError;
