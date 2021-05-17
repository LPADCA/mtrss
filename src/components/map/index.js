import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import styled from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/Flowers_Red.png";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world.topo.json";

const BG_IMAGE_WIDTH = 1920;
const BG_IMAGE_HEIGHT = 919;
const BG_IMAGE_RATIO = BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;
const MIN_WIDTH = 1100;

const SvgWrapper = styled.div`
  background-image: url(${oceanBG});
  background-size: cover;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 100vh;
  position: relative;
`;

const AnimatedSvg = styled.svg`
  stroke: transparent;
  background-color: transparent;
  background-image: url(${earthBG});
  background-size: contain;
  background-position: top 30% left 38%;
  background-repeat: no-repeat;
  /* background-size: ${({ width }) => width}px ${({ width }) => width / BG_IMAGE_RATIO}px; */
  background-size: 95%;

  fill: transparent;
  will-change: transform, stroke-width;
  transition: transform 0.5s ease-in;
  transform: translate(
      ${({ width, height, scale, offsetY }) =>
        `${(width * scale) / 2}px, ${(height * scale) / 2 + offsetY}px`}
    )
    translate(${({ x, y, scale }) => `-${x * scale}px, -${y * scale}px`}) scale(${({ scale }) => scale});

  path:hover {
    will-change: stroke-width;
    transition: all 0.2s ease-in;
    fill: white;
  }
`;

const CountryTooltipContainer = styled.div`
  background-color: white;
  border: 1px solid black;
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  color: black;
`;

const SvgPath = ({ d, onClick, ...props }) => {
  const pathRef = useRef();

  useEffect(() => {
    d3.select(pathRef.current).on("click", onClick).transition().duration(100).attr("d", d);
  }, [d]);

  return <path ref={pathRef} {...props} />;
};

const SvgPathsFromFeature = ({ topoJSON, projection, onPathClick, onMouseOver }) => {
  const pathGenerator = geo.geoPath().projection(projection);
  const handleMouseOver = feature => {
    if (onMouseOver) onMouseOver(feature);
  };
  return topoJSON.features.map(feature => {
    const path = pathGenerator(feature);

    if (!path) return null;
    return (
      <SvgPath
        key={path}
        onClick={() => onPathClick(feature)}
        onMouseOver={() => handleMouseOver(feature)}
        d={path}
      />
    );
  });
};

const SvgTopoCities = ({ topoJSON, projection, onPathClick }) => {
  const pathGenerator = geo.geoPath().projection(projection);

  return topoJSON.features.map((feature, i) => {
    const [x, y] = pathGenerator.centroid(feature);

    return <circle key={i} onClick={() => onPathClick(feature)} r={1} cx={x} cy={y} fill="black" />;
  });
};

const TOPO_COUNTRIES = topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.countries);
const TOPO_PLACES = topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.places);
const projection = geo.geoEqualEarth();
const pathGenerator = geo.geoPath().projection(projection);
const originalBounds = pathGenerator.bounds(TOPO_COUNTRIES);

const ContryTooltip = ({ feature }) => {
  const centroid = pathGenerator.centroid(feature);
  return (
    <CountryTooltipContainer top={centroid[1]} left={centroid[0]}>
      {feature.properties.ADMIN}
    </CountryTooltipContainer>
  );
};

const SvgMap = props => {
  const svgRef = useRef();
  const featureRef = useRef();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions({ width: 0, height: 0 });
  const width = Math.max(screenWidth - 50, MIN_WIDTH);
  const height = width / BG_IMAGE_RATIO;
  const [centroid, setCentroid] = useState([width / 2, height / 2]);
  const [overFeature, setOverFeature] = useState(null);
  const offsetY = (screenHeight - height) / 2;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!featureRef.current) setCentroid([width / 2, height / 2]);
  }, [width, height]);

  projection.fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    TOPO_COUNTRIES
  );

  const onFeatureClick = feature => {
    const isSame = feature === featureRef.current;
    if (isSame) feature = TOPO_COUNTRIES;
    const centroid = pathGenerator.centroid(feature);
    const bounds = pathGenerator.bounds(feature);
    const fullX = originalBounds[0][0] - originalBounds[1][0];
    const featX = bounds[0][0] - bounds[1][0];
    const scaleX = fullX / featX / 2;

    featureRef.current = feature;

    if (isSame) {
      setScale(1);
      setCentroid([width / 2, height / 2]);
    } else {
      setScale(scaleX / 2 > 1 ? scaleX / 2 : 2);
      setCentroid([centroid[0], centroid[1]]);
    }
  };

  if (width === 0 && height === 0) return null;

  return (
    <SvgWrapper>
      <AnimatedSvg
        ref={svgRef}
        width={width}
        height={height}
        offsetY={offsetY}
        x={centroid[0]}
        y={centroid[1]}
        scale={scale}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
      >
        <SvgPathsFromFeature
          projection={projection}
          onPathClick={onFeatureClick}
          onMouseOver={setOverFeature}
          topoJSON={TOPO_COUNTRIES}
        />
      </AnimatedSvg>
      {overFeature && <ContryTooltip feature={overFeature} />}
    </SvgWrapper>
  );
};

export default SvgMap;
