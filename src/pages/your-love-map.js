import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import SvgMap from "../components/your-love-map";
import Layout from "../components/layout";
import { ReactComponent as LoveFrameSvg } from "../assets/images/love-frames.svg";
import heartUrl from "../assets/images/heart.png";
import heart2xUrl from "../assets/images/heart@2x.png";
import Footer from "../components/footer";
import { mediaQueries } from "../screenSizes";
import PostCardForm from "../components/your-love-map/postcard-form";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    background-color: black;
    overflow-x: hidden;
  }

`;

const Hero = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;

  p {
    max-width: 560px;
    text-align: center;
    font-size: 16px;
  }
`;

const Heading = styled.h1`
  font-size: 34px;
  font-weight: 300;
  color: #ff3636;
`;

const RedLink = styled.a`
  color: #ff3636;
`;

const AlbumArtContainer = styled.div`
  display: flex;
  padding: 200px 0;
  justify-content: center;
  overflow: hidden;
`;

const heartbeat = keyframes`
  0% {
    box-shadow: 0px 0px 99px #ff0000;
  }
  30% {
    box-shadow: 0px 0px 99px #ff0000;
  }
  40% {
    box-shadow: 0px 0px 77px #ff0000;
  }
  50% {
    box-shadow: 0px 0px 122px #ff0000;
  }
  60% {
    box-shadow: 0px 0px 66px #ff0000;
  }
  70% {
    box-shadow: 0px 0px 99px #ff0000;
  }
  100% {
    box-shadow: 0px 0px 99px #ff0000;
  }
`;

const AlbumCircle = styled.div`
  border-radius: 100%;
  box-shadow: 0px 0px 99px #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  transition: all 0.5s;
  flex: 0 0 auto;

  @media ${mediaQueries.sm} {
    width: 584px;
    height: 584px;
  }

  &:hover {
    background-color: black;
    box-shadow: 0px 0px 99px #ff0000;
    animation: ${heartbeat} 1s infinite;
  }
`;

const HeartImg = styled.img``;

const BottomLogo = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const postcardRequest = async args => {
  console.log("args", args);
  const response = await fetch(`/api/love-message`, {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const res = await response.json();
    console.log("res", res);
    return res;
  }
  throw new Error(response.status);
};

const YourLoveMapPage = () => {
  return (
    <Layout>
      <GlobalStyle />
      <Hero>
        <LoveFrameSvg />
        <Heading>#YourLoveMap</Heading>
        <p>
          All we need is love. Listen to the song and tag the person you love the most and give them{" "}
          <RedLink>#YourLoveNote.</RedLink>
        </p>
      </Hero>
      <SvgMap />
      <PostCardForm onSubmit={postcardRequest} />
      <AlbumArtContainer>
        <AlbumCircle>
          <HeartImg src={heartUrl} width="506" height="506" srcSet={heart2xUrl} />
        </AlbumCircle>
      </AlbumArtContainer>
      <Footer>
        <BottomLogo>
          <a href="/">
            <img src="/images/mtrss-logo.svg" alt="MTRSS logo" width="170" />
          </a>
        </BottomLogo>
      </Footer>
    </Layout>
  );
};

export default YourLoveMapPage;
