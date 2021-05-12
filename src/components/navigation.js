import React, { useState } from "react";
import {  useStaticQuery, graphql } from "gatsby";
import AnchorLink from "react-anchor-link-smooth-scroll";

const Navigation = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = e => {
    e.preventDefault();
    setMenuOpen(!isMenuOpen);
  };

  const triggerMenu = e => {
    setMenuOpen(false);
  };

  const query = useStaticQuery(graphql`
    query StaticQuery {
      contentfulHomepage {
        merchShopUrl
      }
    }
  `);

  return (
    <nav role="navigation">
      <div className="menu-holder">
        <div className="item1">
          <a href="/">
            <img src="/images/mtrss-logo.svg" alt="MTRSS logo" width="170" />
          </a>
        </div>
        <div className="item2">
          <div className="menu desktop">
            <ul id="menulist" className={isMenuOpen ? `open` : ``}>
              <li>
                <AnchorLink href="#mtrss-audio">Music</AnchorLink>
              </li>
              <li>
                <AnchorLink href="#mtrss-video">Videos</AnchorLink>
              </li>
              <li>
                <AnchorLink href="#mtrss-text">About us</AnchorLink>
              </li>
              <li>
                <AnchorLink href="#mtrss-contacts">Get in touch</AnchorLink>
              </li>
              {query.contentfulHomepage.merchShopUrl && (
                <li>
                  <a href={query.contentfulHomepage.merchShopUrl} target="_blank">
                    Merch
                  </a>
                </li>
              )}
            </ul>
            <div id="sandwich" onClick={toggleMenu} className={isMenuOpen ? `open` : ``}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="menu-m mobile">
            <ul id="menulist-m" className={isMenuOpen ? `open` : ``}>
              <li>
                <img src="/images/mtrss-logo.svg" alt="MTRSS logo" width="170" />
              </li>
              <li>
                <AnchorLink href="#mtrss-audio" onClick={triggerMenu}>
                  Music
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="#mtrss-video" onClick={triggerMenu}>
                  Videos
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="#mtrss-text" onClick={triggerMenu}>
                  About us
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="#mtrss-contacts" onClick={triggerMenu}>
                  Get in touch
                </AnchorLink>
              </li>
              {query.contentfulHomepage.merchShopUrl && (
                <li>
                  <a href={query.contentfulHomepage.merchShopUrl} target="_blank">
                    Merch
                  </a>
                </li>
              )}
            </ul>
            <div id="sandwich-m" onClick={toggleMenu} className={isMenuOpen ? `open` : ``}>
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
  );
};

export default Navigation;
