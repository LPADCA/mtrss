import React from "react";
import SvgMap from "./love-map";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const FullLoveMap = ({ onMapLoaded, onCountryClick, className }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions({ width: 0, height: 0 });

  return (
    <SvgMap
      className={className}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      onCountryClick={onCountryClick}
      onMapLoaded={onMapLoaded}
    />
  );
};

export default FullLoveMap;
