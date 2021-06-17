import React from "react";
import Navigation from "./navigation";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const Layout = ({ children }) => {
  const { site } = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <>
      <Navigation />
      <Helmet title={site.siteMetadata.title}>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      {children}
    </>
  );
};

export default Layout;
