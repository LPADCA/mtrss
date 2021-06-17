import React from "react";
import { Router, Redirect } from "@reach/router";
import MessagePage from "../../components/love-message/message-page";
import LoveLayout from "../../components/love-layout";

const Heading = () => (
  <>
    What a beauty! Share your love with your loved one on socials. Don’t forget to mention{" "}
    <a>@mtrss.art @arielfitz.patrick</a>
    <a> #YourLoveNote.</a>
  </>
);

const App = () => {
  return (
    <LoveLayout headline={<Heading />}>
      <Router basepath="/love-message">
        <MessagePage path="/:url" />
        <Redirect noThrow from="/" to="/your-love-map\//" />
      </Router>
    </LoveLayout>
  );
};
export default App;
