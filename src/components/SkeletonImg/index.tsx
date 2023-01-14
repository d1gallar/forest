import React, { Component } from 'react';

class SkeletonImg extends Component {
  render(): React.ReactNode {
      return <div className='w-full h-fit aspect-square skeleton skeleton-thumbnail'>
      </div>
  }
}

export default SkeletonImg;