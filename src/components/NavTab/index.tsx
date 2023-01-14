import React, { Component } from "react";
import {Link} from 'react-router-dom';

type NavTabProps = {
  path: string,
  name: string,
}

type NavTabState = {
  active: boolean
}

class NavTab extends Component<NavTabProps, NavTabState> {

  constructor(props: NavTabProps){
    super(props);
    this.state = { active: this.isTabActive()}
  }

  isTabActive(): boolean{
    const currPath = window.location.pathname;
    const {name} = this.props;
    if(currPath === '/' && name === 'Home') return true;
    else if(currPath === '/shop' && name === 'Shop') return true;
    else if(currPath === '/contact' && name === 'Contact') return true;
    return false;
  }

  renderActiveClass(){
    return this.state.active ? 'text-black' : 'hover:text-black/80 text-black/50';
  }

  render(): React.ReactNode {
    const {path, name} = this.props;
      return (
        <span>
          <Link to={path} className={`p-4 ${this.renderActiveClass()}`}>
            {name}
          </Link>
        </span>
      );
  }
}

export default NavTab;