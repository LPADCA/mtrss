import React, { useState, useRef } from "react";
import SvgMap from "../components/your-love-map";
import PostCardForm from "../components/love-message/postcard-form";
import { navigate } from "gatsby";
import { createPostcardRequest } from "../api/love-message-api";
import LoveLayout from "../components/love-layout";
import styled from "styled-components";
import LoadingScreen from "../components/your-love-map/screens/loading-screen";

const MapArea = styled.div`
  min-height: 100vh;
  margin: 0 -20px;
  position: relative;
`;

const AbsoluteSvgMap = styled(SvgMap)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
        {isLoadingState && <LoadingScreen disabled={!isMapLoaded} onClick={() => setState(MAP_STATE)} />}
      </MapArea>
      <PostCardForm ref={ref} country={country} setCountry={setCountry} onSubmit={openPostcard} />
    </LoveLayout>
  );
};

export default YourLoveMapPage;
