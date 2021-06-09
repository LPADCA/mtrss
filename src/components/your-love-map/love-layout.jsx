import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import Layout from "../../components/layout";
import { ReactComponent as LoveFrameSvg } from "../../assets/images/love-frames.svg";
import heartUrl from "../../assets/images/heart.png";
import heart2xUrl from "../../assets/images/heart@2x.png";
import Footer from "../../components/footer";
import { mediaQueries } from "../../screenSizes";
import playfairRegularUrl from "../../assets/fonts/PlayfairDisplay-Regular.ttf";
import playfairBoldUrl from "../../assets/fonts/PlayfairDisplay-Bold.ttf";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Playfair Display';
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url(${playfairRegularUrl});
  }
  @font-face {
    font-family: 'Playfair Display';
    font-style: normal;
    font-weight: 700;
    font-display: block;
    src: url(${playfairBoldUrl});
  }

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
    padding: 0 30px;
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

const PageContent = styled.main`
  padding: 0 20px;
`

const HeartImg = styled.img``;

const BottomLogo = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoveLayout = ({ children }) => {
  return (
    <Layout>
      <GlobalStyle />
      <Hero>
        <LoveFrameSvg />
        <Heading>#YourLove</Heading>
        <p>
          What a beauty! Share your love with your loved one on social. Don’t forget to mention @mtrss.art
          @arielfitz.patrick
          <RedLink> #YourLoveNote.</RedLink>
        </p>
      </Hero>
      <PageContent>
        {children}
      </PageContent>
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

export default LoveLayout;
