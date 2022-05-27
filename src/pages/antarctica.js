import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/layout";
import styled from "styled-components";
import video from "../assets/videos/suite-for-antarctica.mp4"
import cover from "../assets/images/antarctica-cover.png"
import mountain from "../assets/images/mountain.png"
import Footer from "../components/footer";

const VideoSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  background: #000;
  box-sizing: border-box;
`;
const VideoContainer = styled.div`
  box-sizing: border-box;
  position: relative;
  max-width: 2200px;
  max-height: 100vh;
  width: 100%;
  background: #000;
  &:hover {
    cursor: pointer;
  }
`;
const PlayButton = styled.div`
box-sizing: border-box;
  width: 51px;
  height: 51px;
  border-radius: 50%;
  background: transparent linear-gradient(180deg, #4D4B49 0%, #7F7D7C 100%) 0% 0% no-repeat padding-box;
  position: absolute;
  z-index: 99;
  bottom: 42px;
  right: 91px;
  &:hover {
    cursor: pointer;
  }
`
const PlayButtonTriangle = styled.div`
box-sizing: border-box;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 17.3px;
  border-color: transparent transparent transparent #1c1e21;
  left: 50%;
  top: 50%; 
  position: absolute;
  transform: translate(-33%, -50%);
  pointer-events: none;
`
const videoStyles = {
  width: '100%'
}
const ClickListenSection = styled.div`
box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #000;
  padding: 40px 0;
`
const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: #000;
  padding: 0 148px 148px;
  box-sizing: border-box;
  
  @media(max-width: 1100px) {
    padding-bottom: 0;
  }
`
const Section = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1750px;
  margin: 0 auto;
  background: #000;

  @media(max-width: 1100px) {
    flex-direction: column;
    text-align: center;
  }
`;
const StyledCover = styled.img`
  flex: 1;
  box-sizing: border-box;
`
const StyledCopy = styled.div`
  margin-left: 80px;
  box-sizing: border-box;
  flex: 1;

  @media(max-width: 1100px) {
    margin: 40px 0;
  }
`
const InfoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  background: #000;
  box-sizing: border-box;
  text-align: center;
  line-height: 48px;
  position: relative;
  box-sizing: border-box;

  @media(max-width: 900px) {
    background: #1c1e21;
    padding: 60px 1.5rem;
    }

  p {
    max-width: 650px;
    z-index: 2;
    position: absolute;
    
    @media(max-width: 1250px) {
      line-height: 28px;
    }
    @media(max-width: 900px) {
      position: static;
      }
  }
`;
const MountainImage = styled.img`
  width: 100%;
  max-width: 2200px;
  max-height: 100vh;
  width: 100%;
  background: #000;

  @media(max-width: 900px) {
    display: none;
  }
`



const AntarcticaPage = () => {
  const videoRef = useRef()
  const [videoPlaying, setVideoPlaying] = useState(true) 
  
  const handlePlayPause = () => {
    setVideoPlaying(!videoPlaying)
    videoPlaying ? videoRef.current.play() : videoRef.current.pause()
  }

  return (
    <Layout>
      <VideoSection>
        <VideoContainer onClick={handlePlayPause}>
          <video ref={videoRef} id="video-hero" style={videoStyles} loop >
            <source src={video} type="video/mp4" />
            Sorry, your browser does not support the HTML video tag.
          </video>
          <PlayButton>
            <PlayButtonTriangle />
          </PlayButton>
        </VideoContainer>
      </VideoSection>

      <ClickListenSection>
        <a className="gray-btn" target='_blank' href="https://dashgo.co/njmykmp">Click here to listen</a> 
      </ClickListenSection>

      <Container>
        <Section>
          <StyledCover src={cover} />
          <StyledCopy>
            <h2>SUITE FOR ANTARCTICA</h2>
            <p>A large supportive act in the form of a beautiful instrumental LP designed to highlight the problem of designating Marine Protected Areas around Antarctica. Also, to protect Antarctica and secure the largest act of ocean protection in history by supporting #CallOnCCAMLR and encouraging listeners to sign the petition.</p>
            <a className="gray-btn" target="_blank" href="https://pacificsv-antarctica.netlify.app/#form">Sign this petition</a>
          </StyledCopy>
        </Section>
      </Container>

      <InfoSection>
        <MountainImage src={mountain} />
        <p>
          MTRSS – is a global conglomeration of artists, a collaborative enterprise that spans the globe, exploring what happens when artists have a fair amount of time on their hands and access to video and audio processing software. The project was created by Ilya Lagutenko, the legendary front-man of the multiplatinum-selling Russian rock band Mumiy Troll. Ilya is also well known for conservation activities on various environmental matters, like wildlife, ocean life, protecting Amur tigers and leopards, Antarctica and waters of The Southern Ocean.
        </p>
      </InfoSection>




      <Footer />
    </Layout>
  );
};

export default AntarcticaPage; 
