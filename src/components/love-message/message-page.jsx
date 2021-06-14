import React, { useEffect, useState, useRef, forwardRef } from "react";
import { getPostcardRequest } from "../../api/love-message-api";
import { navigate, Link } from "gatsby";
import styled from "styled-components";
import domtoimage from "dom-to-image";
import Button from "../button";
import { ReactComponent as LocationPointer } from "../../assets/images/pointer.svg";
import { ReactComponent as ShareIcon } from "../../assets/images/share.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";
import svgUrl from "../../assets/images/heart-svg.svg";
import instagramUrl from "../../assets/icons/instagram.png";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { mediaQueries, MD_SCREEN_SIZE_PX } from "../../screenSizes";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WhatsappIcon,
} from "react-share";
import { usePopper } from "react-popper";
import WithCopy from "../WithCopy";
import InstaTooltip from "./insta-tooltip";
import { ReactComponent as Loader } from "../../assets/icons/loader.svg";

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
  height: 100vh;
  min-height: 700px;
`;

const PostcardLayout = styled.div`
  display: flex;
  flex-direction: column;

  @media ${mediaQueries.md} {
    flex-direction: row;
  }
`;

const ActionsContainer = styled.div`
  @media ${mediaQueries.sm} {
    margin-left: 60px;
    margin-right: 20px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  flex: 0 0 auto;
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

const NewButtonContainer = styled.div`
  margin-top: 30px;
  max-width: 400px;
  width: 100%;
`;

const ShareTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
  margin: 34px 0;

  svg {
    margin-right: 10px;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 -10px;

  @media ${mediaQueries.xs} {
    max-width: 250px;
  }

  & > * {
    margin: 0 10px;
    margin-bottom: 20px;
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

const InstaButtonWithCopy = WithCopy(InstaButton);

const INSTA_MESSAGE = `Sending love to @ [tag your love]\r\n________\r\n#YourLoveMap @mtrss.art @arielfitz.patrick`;

const SHARE_TITLE = `Here's your special love note! Can you feel the love? Share it on social and tag with #YourLoveNote`;
const SHARE_HASHTAG = `#YourLoveNote`;

const MessageContent = ({ url, postcardRef, location: { href } }) => {
  const [message, setMessage] = useState();
  const [instaText, showInstaText] = useState(false);
  const [isPostcardShow, showPostcard] = useState(false);
  const { width, height } = useWindowDimensions();
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "arrow",
        options: {
          element: arrowElement,
        },
      },
    ],
    placement: "bottom-end",
  });
  const postcardWidth = width < MD_SCREEN_SIZE_PX ? Math.min(width - 40, height * 0.5) : height * 0.8;

  const FULL_URL = href;

  useEffect(() => {
    setLoading(true);
    getPostcardRequest(url)
      .then(setMessage)
      .then(() => setLoading(false))
      .catch(() => navigate("/your-love-map/"));
  }, []);

  if (!message) return <Loader />;

  return (
    <PostcardLayout>
      <Postcard message={message} postcardWidth={postcardWidth} />
      {isPostcardShow && (
        <ExpandedPostCard message={message} onClose={() => showPostcard(false)}></ExpandedPostCard>
      )}
      <ActionsContainer>
        <CardButton loading={loading} onClick={() => showPostcard(true)}>
          <DownloadIcon /> Download now
        </CardButton>
        <div>
          <ShareTitle>
            <ShareIcon height="18" fill="white" /> Share on your socials
          </ShareTitle>
          <SocialContainer>
            <FacebookShareButton hashtag={SHARE_HASHTAG} quote={SHARE_TITLE} url={FULL_URL}>
              <FacebookIcon size={38} />
            </FacebookShareButton>
            <TwitterShareButton title={SHARE_TITLE} url={FULL_URL}>
              <TwitterIcon size={38} />
            </TwitterShareButton>
            <WhatsappShareButton title={SHARE_TITLE} url={FULL_URL}>
              <WhatsappIcon size={38} />
            </WhatsappShareButton>
            <InstaButtonWithCopy
              copyValue={INSTA_MESSAGE}
              ref={setReferenceElement}
              onClick={() => showInstaText(!instaText)}
            >
              <InstagramIcon src={instagramUrl} />
            </InstaButtonWithCopy>
            <TelegramShareButton title={SHARE_TITLE} url={FULL_URL}>
              <TelegramIcon size={38} />
            </TelegramShareButton>
            <ViberShareButton title={SHARE_TITLE} url={FULL_URL}>
              <ViberIcon size={38} />
            </ViberShareButton>
            <VKShareButton title={SHARE_TITLE} url={FULL_URL}>
              <VKIcon size={38} />
            </VKShareButton>
          </SocialContainer>
          <InstaTooltip
            isShown={instaText}
            styles={styles}
            setShown={showInstaText}
            attributes={attributes}
            setPopperElement={setPopperElement}
            setArrowElement={setArrowElement}
          />
        </div>
        <NewButtonContainer>
          <Button theme="outline" as={Link} to="/your-love-map">
            Create new postcard
          </Button>
        </NewButtonContainer>
      </ActionsContainer>
    </PostcardLayout>
  );
};

const MessagePage = props => {
  return (
    <PageContainer>
      <MessageContent {...props} />
    </PageContainer>
  );
};

export default MessagePage;
