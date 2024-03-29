import React, { useState } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import AnchorLink from "react-anchor-link-smooth-scroll";
import styled from "styled-components";

const StyledLink = styled.a`
  color: white;
`;

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
                <StyledLink as={Link} to="/antarctica">
                  Antarctica
                </StyledLink>
              </li>
              <li>
                <StyledLink as={Link} to="/your-love-map">
                  #YourLoveMap
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://shop.mtrss.art">Shop</StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-audio">
                  Music
                </StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-video">
                  Videos
                </StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-text">
                  About us
                </StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-contacts">
                  Get in touch
                </StyledLink>
              </li>
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
                <StyledLink as={Link} to="/antarctica">
                  Antarctica
                </StyledLink>
              </li>
              <li>
                <StyledLink as={Link} to="/your-love-map">
                  #YourLoveMap
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://shop.mtrss.art">Shop</StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-audio" onClick={triggerMenu}>
                  Music
                </StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-video" onClick={triggerMenu}>
                  Videos
                </StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-text" onClick={triggerMenu}>
                  About us
                </StyledLink>
              </li>
              <li>
                <StyledLink as={AnchorLink} href="#mtrss-contacts" onClick={triggerMenu}>
                  Get in touch
                </StyledLink>
              </li>
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
