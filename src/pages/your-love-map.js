import React from "react";
import { createGlobalStyle } from "styled-components";
import SvgMap from "../components/map";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

`;

const YourLoveMapPage = () => {
  return (
    <div>
      <GlobalStyle />
      <SvgMap />
    </div>
  );
};

export default YourLoveMapPage;
