import React, { Component, ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode[] | ReactNode;
}

class PageContainer extends Component<PageContainerProps, {}> {
  render() {
    return (
      <div className="min-h-[50rem] bg-[#FAFAFA] w-full h-fit py-12 px-5 xsm:px-8 sm:px-10 md:p-10">
        {this.props.children}
      </div>
    )
  }
}

export default PageContainer;
