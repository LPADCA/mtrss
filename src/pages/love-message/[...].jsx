import React from "react";
import { Router, Redirect } from "@reach/router";
import Layout from "../../components/layout";
import MessagePage from "../../components/your-love-map/message-page";

const App = () => {
  return (
    <Layout>
      <Router basepath="/love-message">
        <MessagePage path="/:url" />
        <Redirect noThrow from="/" to="/your-love-map\//" />
      </Router>
    </Layout>
  );
};
export default App;
