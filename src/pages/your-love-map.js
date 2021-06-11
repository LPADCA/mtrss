import React, { useState, useRef } from "react";
import SvgMap from "../components/your-love-map";
import PostCardForm from "../components/love-message/postcard-form";
import { navigate } from "gatsby";
import { createPostcardRequest } from "../api/love-message-api";
import LoveLayout from "../components/love-layout";
import styled from "styled-components";
import LoadingScreen from "../components/your-love-map/screens/loading-screen";
import { useSpring, animated } from "@react-spring/web";

const MapArea = styled.div`
  height: 100vh;
  min-height: 700px;
  margin: 0 -20px;
  position: relative;
`;

const ModalContainer = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Modal = ({ show, children }) => {
  const style = useSpring({
    opacity: show ? 1 : 0,
    backdropFilter: show ? "blur(24px)" : "blur(0px)",
  });

  return (
    <ModalContainer
      style={{
        opacity: style.opacity,
        visibility: style.opacity.to(e => (e > 0 ? "visible" : "hidden")),
        backdropFilter: style.backdropFilter,
      }}
    >
      {children}
    </ModalContainer>
  );
};

const AbsoluteSvgMap = styled(SvgMap)``;

const openPostcard = async args => {
  const { url } = await createPostcardRequest(args);
  navigate("/love-message/" + url);
};

const LOADING_STATE = "loading";
const MAP_STATE = "map";
const FORM_STATE = "form";

const FirstHeading = () => (
  <>
    All we need is love. Enjoy <a>#YourLove</a> with thousands of listeners around the world, find where your
    loved one is on the map and share <a>#YourLoveNote</a> with them.
  </>
);

const LastHeading = () => (
  <>
    What a beauty! Share your love with your loved one on social. Don’t forget to mention @mtrss.art
    @arielfitz.patrick
    <a> #YourLoveNote.</a>
  </>
);

const Headline = ({ state }) => {
  switch (state) {
    case FORM_STATE:
      return <LastHeading />;
    case LOADING_STATE:
    case MAP_STATE:
    default:
      return <FirstHeading />;
  }
};

const YourLoveMapPage = () => {
  const ref = useRef();
  const [country, setCountry] = useState("");
  const [state, setState] = useState(LOADING_STATE);
  const [isMapLoaded, setMapLoaded] = useState(false);

  const handleCountryClick = country => {
    setCountry(country);
    setState(FORM_STATE);
  };

  const handleStartClick = () => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setState(MAP_STATE);
  };

  const isLoadingState = state === LOADING_STATE;
  const isFormState = state === FORM_STATE;

  return (
    <LoveLayout headline={<Headline state={state} />}>
      <MapArea ref={ref}>
        <AbsoluteSvgMap
          country={country}
          onMapLoaded={() => setMapLoaded(true)}
          onCountryClick={handleCountryClick}
        />
        <Modal show={isLoadingState}>
          <LoadingScreen show={isLoadingState} disabled={!isMapLoaded} onStart={handleStartClick} />
        </Modal>

        <Modal show={isFormState}>
          <PostCardForm
            ref={ref}
            country={country}
            onBackClick={handleStartClick}
            setCountry={setCountry}
            onSubmit={openPostcard}
          />
        </Modal>
      </MapArea>
    </LoveLayout>
  );
};

export default YourLoveMapPage;
