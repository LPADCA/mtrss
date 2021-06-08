import React, { useEffect, useState, useRef, forwardRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate } from "gatsby";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";
import { ReactComponent as LocationPointer } from "../../assets/images/pointer.svg";
import { ReactComponent as ShareIcon } from "../../assets/images/share.svg";
// import { ReactComponent as FacebookIcon } from "../../assets/icons/facebook.svg";
import svgUrl from "../../assets/images/heart-svg.svg";
import instagramUrl from "../../assets/icons/instagram.png";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from "react-share";

const POSTCARD_DEFAULT_SIZE = 636;
const HEART_WIDTH_RATIO = 300 / POSTCARD_DEFAULT_SIZE;
const HEART_WIDTH_HEIGHT_RATIO = 902 / 1156;
const YOUR_LOVE_RATIO = 64 / POSTCARD_DEFAULT_SIZE;
const POSTMARK_SIZE_RATIO = 110 / POSTCARD_DEFAULT_SIZE;
const POSTMARK_POINT_RATIO = 35 / POSTCARD_DEFAULT_SIZE;
const POSTMARK_FONT_RATIO = 14 / POSTCARD_DEFAULT_SIZE;
const POSTCARD_NAME_RATIO = 40 / POSTCARD_DEFAULT_SIZE;
const POSTCARD_NOTE_RATIO = 18 / POSTCARD_DEFAULT_SIZE;
const POSTCARD_NOTE_WIDTH_RATIO = 520 / POSTCARD_DEFAULT_SIZE;
const BORDER_RADTIO = 1 / POSTCARD_DEFAULT_SIZE;
const LINE_WIDTH_RATIO = 72 / POSTCARD_DEFAULT_SIZE;
const LINE_HEIGHT_RATIO = 2 / POSTCARD_DEFAULT_SIZE;
const LINE_MARGIN_TOP_RATIO = 20 / POSTCARD_DEFAULT_SIZE;
const LINE_MARGIN_BOTTOM_RATIO = 8 / POSTCARD_DEFAULT_SIZE;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PostcardContainer = styled.div`
  border: ${({ size }) => size * BORDER_RADTIO}px solid #830000;
  background-color: black;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  max-width: 100%;
`;

const PostmarkCotainer = styled.div`
  border: ${({ size }) => size * BORDER_RADTIO}px solid #830000;
  display: inline-flex;
  width: ${({ size }) => size * POSTMARK_SIZE_RATIO}px;
  height: ${({ size }) => size * POSTMARK_SIZE_RATIO}px;
  position: absolute;
  top: 14px;
  right: 16px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: ${({ size }) => size * POSTMARK_FONT_RATIO}px;
  text-align: center;
`;

const StyledLocationPointer = styled(LocationPointer)`
  width: ${({ size }) => size * POSTMARK_POINT_RATIO}px;
  height: auto;
  margin-bottom: 1em;
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-display: block;
`;

const ImageTitle = styled.span`
  font-family: "Playfair Display", sans-serif;
  font-size: ${({ size }) => size * YOUR_LOVE_RATIO}px;
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

const PostcardName = styled.p`
  font-family: "Playfair Display", sans-serif;
  font-size: ${({ size }) => size * POSTCARD_NAME_RATIO}px;
  margin: 0;

  &:first-child {
    margin-bottom: 0.5em;
  }

  &:last-child {
    margin-bottom: 0.5em;
  }
`;

const PostcardNote = styled.p`
  font-family: "Playfair Display", sans-serif;
  font-size: ${({ size }) => size * POSTCARD_NOTE_RATIO}px;
  color: #ff3636;
  margin: 0;
  width: ${({ size }) => size * POSTCARD_NOTE_WIDTH_RATIO}px;
`;

const Line = styled.hr`
  height: ${({ size }) => size * LINE_HEIGHT_RATIO}px;
  width: ${({ size }) => size * LINE_WIDTH_RATIO}px;
  background-color: white;
  margin-top: ${({ size }) => size * LINE_MARGIN_TOP_RATIO}px;
  margin-bottom: ${({ size }) => size * LINE_MARGIN_BOTTOM_RATIO}px;
  border: none;
`;

const CardButton = styled(Button)`
  max-width: 400px;
  width: 100%;
  margin-top: 50px;
`;

const ExpandedCardContainer = styled.div`
  position: fixed;
  top: 90px;
  left: 0;
  opacity: 0;
`;

const SharingContainer = styled.div``;

const ShareTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;

  svg {
    margin-right: 10px;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;

  & > * {
    margin-right: 25px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const InstagramIcon = styled.img`
  width: 38px;
  height: 38px;
`;

const InstaButton = styled.button`
  width: 38px;
  height: 38px;
  background: transparent;
  border: none;
  padding: 0;
`;

const ShareMessageContainer = styled.div`
  margin-top: 20px;
  padding: 20px 15px;
  background: #141115 0% 0% no-repeat padding-box;
  border: 1px solid white;
  border-radius: 20px;
  opacity: 1;
  backdrop-filter: blur(50px);
  
  p {
    margin: none;
  }
`;

const saveImage = (domNode, onClose) => {
  domtoimage
    .toPng(domNode, {
      style: {
        fontFamily: "'Playfair Display', sans-serif",
      },
    })
    .then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "postcard.png";
      link.href = dataUrl;
      link.click();
      onClose();
    });
};

const ExpandedPostCard = ({ onClose, message }) => {
  const postcardRef = useRef();
  useEffect(() => {
    saveImage(postcardRef.current, onClose);
  }, []);
  return (
    <ExpandedCardContainer>
      <Postcard ref={postcardRef} message={message} postcardWidth={1080} />
    </ExpandedCardContainer>
  );
};

const Postcard = forwardRef(({ postcardWidth, message }, ref) => {
  const HEART_WIDTH = HEART_WIDTH_RATIO * postcardWidth;
  const HEART_HEIGHT = HEART_WIDTH / HEART_WIDTH_HEIGHT_RATIO;
  return (
    <PostcardContainer ref={ref} size={postcardWidth}>
      <PostmarkCotainer size={postcardWidth}>
        <StyledLocationPointer size={postcardWidth} />
        {message.country}
      </PostmarkCotainer>
      <ImageContainer>
        <img width={HEART_WIDTH} height={HEART_HEIGHT} src={svgUrl}></img>
        <ImageTitle size={postcardWidth}>Your love</ImageTitle>
      </ImageContainer>
      <PostcardContent>
        <PostcardName size={postcardWidth}>To {message.name},</PostcardName>
        <PostcardNote size={postcardWidth}>{message.note}</PostcardNote>
        <Line size={postcardWidth}></Line>
        <PostcardNote size={postcardWidth}>Sincerely yours,</PostcardNote>
        <PostcardName size={postcardWidth}>{message.from}</PostcardName>
      </PostcardContent>
    </PostcardContainer>
  );
});

Postcard.displayName = "Postcard";

const MessagePage = ({ url }) => {
  const [message, setMessage] = useState();
  const [instaText, showInstaText] = useState(false);
  const [isPostcardShow, showPostcard] = useState(false);
  const postcardRef = useRef();
  const { width } = useWindowDimensions();
  const postcardWidth = Math.min(width, 636);

  useEffect(() => {
    getPostcardRequest(url)
      .then(setMessage)
      .catch(() => navigate("/your-love-map/"));
  }, []);

  if (!message) return <div>loading</div>;

  return (
    <PageContainer ref={postcardRef}>
      <Postcard message={message} postcardWidth={postcardWidth} />
      <CardButton onClick={() => showPostcard(true)}>Save image</CardButton>
      <SharingContainer>
        <ShareTitle>
          <ShareIcon height="18" fill="white" /> Share on your socials
        </ShareTitle>
        <SocialContainer>
          <FacebookShareButton url={window.location.toString()}>
            <FacebookIcon size={38} />
          </FacebookShareButton>
          <TwitterShareButton url={window.location.toString()}>
            <TwitterIcon size={38} />
          </TwitterShareButton>
          <WhatsappShareButton url={window.location.toString()}>
            <WhatsappIcon size={38} />
          </WhatsappShareButton>
          <InstaButton onClick={() => showInstaText(!instaText)}>
            <InstagramIcon src={instagramUrl} />
          </InstaButton>
        </SocialContainer>
        {instaText && (
          <ShareMessageContainer>
            <p>Sending love to @ [tag your love]</p>
            <p>________</p>
            <p>#YourLoveMap @mtrss.art @arielfitz.patrick</p>
          </ShareMessageContainer>
        )}
      </SharingContainer>
      {isPostcardShow && (
        <ExpandedPostCard message={message} onClose={() => showPostcard(false)}></ExpandedPostCard>
      )}
    </PageContainer>
  );
};

export default MessagePage;
