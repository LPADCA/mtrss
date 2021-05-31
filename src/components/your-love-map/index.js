import React from "react";
import SvgMap from "./love-map";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const FullLoveMap = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions({ width: 0, height: 0 });

  return <SvgMap screenWidth={screenWidth} screenHeight={screenHeight} />;
};

export default FullLoveMap;
