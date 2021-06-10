import React, { forwardRef } from "react";
import SvgMap from "./love-map";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const FullLoveMap = forwardRef(({ onMapLoaded, onCountryClick, className }) => {
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
});

export default FullLoveMap;
