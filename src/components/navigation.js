import React from 'react'
import { Link } from 'gatsby'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { useStaticQuery, graphql } from "gatsby"

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      menuOpen: false
    };

    this.merchShopUrl = this.props.data.contentfulHomepage.merchShopUrl;
  }

  toggleMenu = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  }

  triggerMenu = (e) => {
    this.setState({
      menuOpen: false
    })
  }

  render() {
    return (
  <nav role="navigation">
  <div className="menu-holder">
      <div className="item1">
        <a href="/"><img src="/images/mtrss-logo.svg" alt="MTRSS logo" width="170"/></a>
      </div>
      <div className="item2">
        <div className="menu desktop">
          <ul id="menulist" className={this.state.menuOpen ? `open` : ``}>
            <li><AnchorLink href="#mtrss-audio">Music</AnchorLink></li>
            <li><AnchorLink href="#mtrss-video">Videos</AnchorLink></li>
            <li><AnchorLink href="#mtrss-text">About us</AnchorLink></li>
            <li><AnchorLink href="#mtrss-contacts">Get in touch</AnchorLink></li>
            {this.merchShopUrl && <li><a href={this.merchShopUrl} target="_blank">Merch</a></li>}
          </ul>
          <div id="sandwich" onClick={this.toggleMenu} className={this.state.menuOpen ? `open` : ``}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="menu-m mobile">
          <ul id="menulist-m"  className={this.state.menuOpen ? `open` : ``}>
            <li><img src="/images/mtrss-logo.svg" alt="MTRSS logo" width="170"/></li>
            <li><AnchorLink href="#mtrss-audio" onClick={this.triggerMenu}>Music</AnchorLink></li>
            <li><AnchorLink href="#mtrss-video" onClick={this.triggerMenu}>Videos</AnchorLink></li>
            <li><AnchorLink href="#mtrss-text" onClick={this.triggerMenu}>About us</AnchorLink></li>
            <li><AnchorLink href="#mtrss-contacts" onClick={this.triggerMenu}>Get in touch</AnchorLink></li>
            {this.merchShopUrl && <li><a href={this.merchShopUrl} target="_blank">Merch</a></li>}
          </ul>
          <div id="sandwich-m" onClick={this.toggleMenu} className={this.state.menuOpen ? `open` : ``}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>     
    </div>
  </nav>
)}
}


export default Navigation

