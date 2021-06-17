import React, { useEffect, useState } from "react";
import { navigate, Link } from "gatsby";
import styled from "styled-components";
import Button from "../button";
import { ReactComponent as ShareIcon } from "../../assets/images/share.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";
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
import { toDataURL } from "../../api/love-message-api";
import { Helmet } from "react-helmet";

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
  @media ${mediaQueries.md} {
    margin-left: 60px;
    margin-right: 20px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CardButtonContainer = styled(Button)`
  max-width: 400px;
  width: 100%;

  @media ${mediaQueries.xs} {
    margin-top: 20px;
  }
`;

const Postcard = styled.img`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

const NewButtonContainer = styled.div`
  @media ${mediaQueries.sm} {
    margin-top: 30px;
  }

  max-width: 400px;
  width: 100%;
`;

const ShareTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;

  @media ${mediaQueries.sm} {
    margin: 34px 0;
  }

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

const InstaButtonWithCopy = WithCopy(InstaButton);

const INSTA_MESSAGE = `Sending love to @ [tag your love]\r\n________\r\n#YourLoveMap @mtrss.art @arielfitz.patrick`;

const SHARE_TITLE = `Here's your special love note! Can you feel the love? Share it on socials and tag with #YourLoveNote`;
const SHARE_HASHTAG = `#YourLoveNote`;

const MessageContent = ({ imageUrl, location: { origin, href } }) => {
  const [instaText, showInstaText] = useState(false);
  const { width, height } = useWindowDimensions();
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [image, setImage] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "arrow",
        options: {
          element: arrowElement,
        },
      },
      { name: "flip", enabled: false },
    ],
    placement: "bottom-end",
  });

  useEffect(() => {
    toDataURL(imageUrl)
      .then(setImage)
      .catch(() => navigate("/your-love-map"));
  }, []);
  const postcardWidth = width < MD_SCREEN_SIZE_PX ? Math.min(width - 40, height * 0.5) : height * 0.8;

  if (!image) return <Loader />;

  return (
    <PostcardLayout>
      <Postcard width={1080} height={1080} size={postcardWidth} src={imageUrl} />
      <ActionsContainer>
        <CardButtonContainer>
          <Button as="a" href={image} download="postcard.png">
            <DownloadIcon /> Download now
          </Button>
        </CardButtonContainer>
        <div>
          <ShareTitle>
            <ShareIcon height="18" fill="white" /> Share on your socials
          </ShareTitle>
          <SocialContainer>
            <FacebookShareButton hashtag={SHARE_HASHTAG} quote={SHARE_TITLE} url={imageUrl}>
              <FacebookIcon size={38} />
            </FacebookShareButton>
            <TwitterShareButton title={SHARE_TITLE} url={imageUrl}>
              <TwitterIcon size={38} />
            </TwitterShareButton>
            <WhatsappShareButton title={SHARE_TITLE} url={imageUrl}>
              <WhatsappIcon size={38} />
            </WhatsappShareButton>
            <InstaButtonWithCopy
              copyValue={INSTA_MESSAGE}
              ref={setReferenceElement}
              onClick={() => showInstaText(!instaText)}
            >
              <InstagramIcon src={instagramUrl} />
            </InstaButtonWithCopy>
            <TelegramShareButton title={SHARE_TITLE} url={imageUrl}>
              <TelegramIcon size={38} />
            </TelegramShareButton>
            <ViberShareButton title={SHARE_TITLE} url={imageUrl}>
              <ViberIcon size={38} />
            </ViberShareButton>
            <VKShareButton title={SHARE_TITLE} url={imageUrl}>
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
  const { url, location } = props;
  const IMAGE_URL = `${location.origin}/api/static/${url}.jpg`;
  return (
    <PageContainer>
      <MessageContent {...props} imageUrl={IMAGE_URL} />
    </PageContainer>
  );
};

export default MessagePage;
