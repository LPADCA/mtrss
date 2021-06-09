import React, { useState, useRef } from "react";
import SvgMap from "../components/your-love-map";
import PostCardForm from "../components/love-message/postcard-form";
import { navigate } from "gatsby";
import { createPostcardRequest } from "../api/love-message-api";
import LoveLayout from "../components/love-layout";
import styled, { css } from "styled-components";
import Button from "../components/button";

const MapArea = styled.div`
  min-height: 100vh;
  margin: 0 -20px;
  position: relative;
`;

const fullscreenCss = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const AbsoluteSvgMap = styled(SvgMap)`
  ${fullscreenCss}
`;

const LoadingScreen = styled.div`
  ${fullscreenCss}
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed red;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.9);
`;

const openPostcard = async args => {
  const { url } = await createPostcardRequest(args);
  navigate("/love-message/" + url);
};

const LOADING_STATE = "loading";
const MAP_STATE = "map";

const YourLoveMapPage = () => {
  const ref = useRef();
  const [country, setCountry] = useState("");
  const [state, setState] = useState(LOADING_STATE);
  const [isMapLoaded, setMapLoaded] = useState(false);

  const onCountryClick = country => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setCountry(country);
  };

  const isLoadingState = state === LOADING_STATE;

  return (
    <LoveLayout>
      <MapArea>
        <AbsoluteSvgMap
          country={country}
          onMapLoaded={() => setMapLoaded(true)}
          onCountryClick={onCountryClick}
        />
        {isLoadingState && (
          <LoadingScreen>
            {!isMapLoaded && <span>Loading</span>}
            <Button disabled={!isMapLoaded} onClick={() => setState(MAP_STATE)}>
              Start map
            </Button>
          </LoadingScreen>
        )}
      </MapArea>
      <PostCardForm ref={ref} country={country} setCountry={setCountry} onSubmit={openPostcard} />
    </LoveLayout>
  );
};

export default YourLoveMapPage;
