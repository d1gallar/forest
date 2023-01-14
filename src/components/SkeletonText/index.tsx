import React, { Component } from 'react';

class SkeletonText extends Component {
  render(): React.ReactNode {
      return (
        <div className='mb-1 skeleton skeleton-text'></div>
      );
  }
}

export default SkeletonText;