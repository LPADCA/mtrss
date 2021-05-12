import React from "react";
import Navigation from "./navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
