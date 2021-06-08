import React, { useEffect, useState, useRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate } from "gatsby";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";
import { StaticImage } from "gatsby-plugin-image";
import { ReactComponent as LocationPointer } from "../../assets/images/pointer.svg";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PostcardContainer = styled.div`
  border: 1px solid #830000;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const SmallPostcardContainer = styled(PostcardContainer)`
  width: 636px;
  height: 636px;
`;

const StoryPostcardContainer = styled(PostcardContainer)`
  width: 1080px;
  height: 1920px;
`;

const PostmarkCotainer = styled.div`
  border: 1px solid #830000;
  display: inline-flex;
  width: 110px;
  height: 110px;
  position: absolute;
  top: 14px;
  right: 16px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageTitle = styled.span`
  font-family: "Playfair Display", sans-serif;
  font-size: 64px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-transform: uppercase;
  width: 100%;
  text-align: center;
`;

const PostcardContent = styled.div`
  font-family: "Playfair Display", sans-serif;
  color: white;
  font-weight: bold;
  text-align: center;
`;

const To = styled.p`
  font-size: 40px;
  margin: 0;
`;

const Note = styled.p`
  font-size: 18px;
  color: #ff3636;
  margin: 0;
  width: 380px;
`;

const Line = styled.hr`
  height: 2px;
  width: 72px;
  background-color: white;
  border: none;
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

const SharingContainer = styled.div``;

const SocialContainer = styled.div``;

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
          <LocationPointer />
          {message.country}
        </PostmarkCotainer>
        <ImageContainer>
          <StaticImage height={400} src="../../assets/images/heart-shadow@2x.png"></StaticImage>
          <ImageTitle>Your love</ImageTitle>
        </ImageContainer>
        <PostcardContent>
          <To>To {message.name},</To>
          <Note>{message.note}</Note>
          <Line></Line>
          <Note>Sincerely yours,</Note>
          <To>{message.from}</To>
        </PostcardContent>
      </SmallPostcardContainer>
      <CardButton onClick={() => showPostcard(true)}>Save image</CardButton>
      <SharingContainer>
        <h3>Share on your socials</h3>
        <SocialContainer>
          <button
            className="button"
            data-sharer="facebook"
            data-hashtag="hashtag"
            data-url="https://ellisonleao.github.io/sharer.js/"
          >
            facebook
          </button>
        </SocialContainer>
      </SharingContainer>
      {isPostcardShow && <ExpandedPostCard message={message} onClose={() => showPostcard(false)} />}
    </PageContainer>
  );
};

export default MessagePage;
