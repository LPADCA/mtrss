import React, { useEffect, useState, useRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate } from "gatsby";
import styled, { createGlobalStyle, StyleSheetManager } from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";
import ReactDOM from "react-dom";

const PostcardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SmallPostcardContainer = styled.div`
  width: 570px;
  height: 980px;
`;

const StoryPostcardContainer = styled.div`
  width: 1080px;
  height: 1920px;
`;

const Postcard = styled.div`
  border: 5px solid red;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-origin: 50% 0;
  font-size: 24px;
  background-color: black;
`;

const CardButton = styled(Button)`
  max-width: 400px;
  width: 100%;
  margin-top: 50px;
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

const NewWindowPostcardStyles = createGlobalStyle`
  body {
    background-color: black;
    color: white;
    margin: 0;
  }
`;

const NewWindowPortal = ({ children, onClose }) => {
  const windowRef = useRef();
  const containerRef = useRef(document.createElement("div"));
  useEffect(() => {
    windowRef.current = window.open("", "", "width=1080,height=1920");
    windowRef.current.document.body.appendChild(containerRef.current);
    return () => {
      setTimeout(() => {
        windowRef.current.close();
        if (onClose) onClose();
      }, 1000)
    };
  }, []);

  return (
    <StyleSheetManager target={containerRef.current}>
      <>{ReactDOM.createPortal(children, containerRef.current)}</>
    </StyleSheetManager>
  );
};

const NewWindowPostCard = ({ message, onClose }) => {
  const postcardRef = useRef();
  useEffect(() => {
    saveImage(postcardRef.current, onClose);
  }, []);
  return (
    <div onClose={onClose}>
      {/* <NewWindowPostcardStyles /> */}
      <StoryPostcardContainer>
        <Postcard ref={postcardRef}>
          <p>to: {message.name}</p>
          <p>from: {message.country}</p>
          <p>message: {message.note}</p>
          <p>with love: {message.from}</p>
        </Postcard>
      </StoryPostcardContainer>
    </div>
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
    <PostcardContainer>
      <SmallPostcardContainer>
        <Postcard ref={postcardRef}>
          <p>to: {message.name}</p>
          <p>from: {message.country}</p>
          <p>message: {message.note}</p>
          <p>with love: {message.from}</p>
        </Postcard>
      </SmallPostcardContainer>
      <CardButton onClick={() => showPostcard(true)}>save image</CardButton>
      {isPostcardShow && <NewWindowPostCard message={message} onClose={() => showPostcard(false)} />}
    </PostcardContainer>
  );
};

export default MessagePage;
