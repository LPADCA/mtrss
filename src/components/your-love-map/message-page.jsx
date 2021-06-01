import React, { useEffect, useState, useRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate } from "gatsby";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";
import { StaticImage } from "gatsby-plugin-image";
import SvgMap from "./love-map";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PostcardContainer = styled.div`
  background-color: #ffffff;
  border: 5px solid red;
`;

const SmallPostcardContainer = styled(PostcardContainer)`
  width: 570px;
  height: 980px;
  padding: 20px;
`;

const StoryPostcardContainer = styled(PostcardContainer)`
  width: 1080px;
  height: 1920px;
`;

const PostmarkCotainer = styled.div`
  border: 1px solid black;
  display: inline-block;
  margin-left: calc(100% - 110px);
`;

const MapContainer = styled.div`
  margin: 20px 0;
`;

const PostcardContent = styled.div`
  color: black;
`;

const CardButton = styled(Button)`
  max-width: 400px;
  width: 100%;
  margin-top: 50px;
`;

const ExpandedCardContainer = styled.div`
  position: absolute;
  top: -999px;
`;

const Underline = styled.span`
  border-bottom: 1px solid black;
  display: inline-block;
  width: 50%;
`;

const saveImage = (domNode, onClose) => {
  domtoimage.toJpeg(domNode, { quality: 0.95 }).then(function (dataUrl) {
    var link = document.createElement("a");
    link.download = "postcard.jpeg";
    link.href = dataUrl;
    link.click();
    onClose();
  });
};

const ExpandedPostCard = ({ message, onClose }) => {
  const postcardRef = useRef();
  useEffect(() => {
    saveImage(postcardRef.current, onClose);
  }, []);
  return (
    <ExpandedCardContainer>
      <StoryPostcardContainer ref={postcardRef}>

        <MapContainer>
          <SvgMap screenWidth={400} screenHeight={220} />
        </MapContainer>
        <PostcardContent>
          <p>
            To, <br /> <Underline>{message.name}</Underline>
          </p>
          <p>from: {message.country}</p>
          <p>message: {message.note}</p>
          <p>with love: {message.from}</p>
        </PostcardContent>
      </StoryPostcardContainer>
    </ExpandedCardContainer>
  );
};

const MessagePage = ({ url }) => {
  const [message, setMessage] = useState();
  const [isPostcardShow, showPostcard] = useState();
  const postcardRef = useRef();

  useEffect(() => {
    getPostcardRequest(url)
      .then(setMessage)
      .catch(() => navigate("/your-love-map/"));
  }, []);

  if (!message) return <div>loading</div>;

  return (
    <PageContainer ref={postcardRef}>
      <SmallPostcardContainer>
        <PostmarkCotainer>
          <StaticImage src="../../assets/images/heart.png" width={110} height={110} />
        </PostmarkCotainer>
        <MapContainer>
          <SvgMap screenWidth={400} screenHeight={220} />
        </MapContainer>
        <PostcardContent>
          <p>
            To, <br /> <Underline>{message.name}</Underline>
          </p>
          <p>from: {message.country}</p>
          <p>message: {message.note}</p>
          <p>with love: {message.from}</p>
        </PostcardContent>
      </SmallPostcardContainer>
      <CardButton onClick={() => showPostcard(true)}>Save image</CardButton>
      {isPostcardShow && <ExpandedPostCard message={message} onClose={() => showPostcard(false)} />}
    </PageContainer>
  );
};

export default MessagePage;
