import React, { useEffect, useState, useRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate } from "gatsby";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";

const PostcardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Postcard = styled.div`
  border: 5px solid red;
  width: 560px;
  height: 960px;
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

const MessagePage = ({ url }) => {
  const [message, setMessage] = useState();
  const postcardRef = useRef();

  useEffect(() => {
    getPostcardRequest(url)
      .then(setMessage)
      .catch(() => navigate("/your-love-map/"));
  }, []);

  const saveImage = () => {
    console.log("postcardRef.current", postcardRef.current);
    domtoimage.toJpeg(postcardRef.current, { quality: 0.95 }).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "my-image-name.jpeg";
      link.href = dataUrl;
      link.click();
    });
  };

  if (!message) return <div>loading</div>;

  return (
    <PostcardContainer>
      <Postcard ref={postcardRef}>
        <p>to: {message.name}</p>
        <p>from: {message.country}</p>
        <p>message: {message.note}</p>
        <p>with love: {message.from}</p>
      </Postcard>
      <CardButton onClick={saveImage}>save image</CardButton>
    </PostcardContainer>
  );
};

export default MessagePage;
