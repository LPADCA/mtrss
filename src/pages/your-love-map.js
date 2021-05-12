import React from "react";
import { createGlobalStyle } from "styled-components";
import SvgMap from "../components/map";
import Layout from "../components/layout";

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
    <Layout>
      <GlobalStyle />
      <SvgMap />
    </Layout>
  );
};

export default YourLoveMapPage;
