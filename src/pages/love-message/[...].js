import React from "react";
import { Router, Redirect } from "@reach/router";
import MessagePage from "../../components/love-message/message-page";
import LoveLayout from "../../components/love-layout";

const App = () => {
  return (
    <LoveLayout>
      <Router basepath="/love-message">
        <MessagePage path="/:url" />
        <Redirect noThrow from="/" to="/your-love-map\//" />
      </Router>
    </LoveLayout>
  );
};
export default App;
