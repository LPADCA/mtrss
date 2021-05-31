import React, { useEffect, useState, useRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate } from "gatsby";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";
import { StaticImage } from "gatsby-plugin-image";

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

const Postcard = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-origin: 50% 0;
  font-size: 24px;
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

const saveImage = (domNode, onClose) => {
  domtoimage.toJpeg(domNode, { quality: 0.95 }).then(function (dataUrl) {
    var link = document.createElement("a");
    link.download = "my-image-name.jpeg";
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
      <StoryPostcardContainer>
        <Postcard ref={postcardRef}>
          <p>to: {message.name}</p>
          <p>from: {message.country}</p>
          <p>message: {message.note}</p>
          <p>with love: {message.from}</p>
        </Postcard>
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
    <PageContainer>
      <SmallPostcardContainer>
        <PostmarkCotainer>
          <StaticImage src="../../assets/images/heart.png" width={110} height={110} />
        </PostmarkCotainer>
        <Postcard ref={postcardRef}>
          <p>to: {message.name}</p>
          <p>from: {message.country}</p>
          <p>message: {message.note}</p>
          <p>with love: {message.from}</p>
        </Postcard>
      </SmallPostcardContainer>
      <CardButton onClick={() => showPostcard(true)}>save image</CardButton>
      {isPostcardShow && <ExpandedPostCard message={message} onClose={() => showPostcard(false)} />}
    </PageContainer>
  );
};

export default MessagePage;
