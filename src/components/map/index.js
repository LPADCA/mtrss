import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import styled, { css } from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/Flowers_Red.png";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world.topo.json";

const BG_IMAGE_WIDTH = 1920;
const BG_IMAGE_HEIGHT = 919;
const BG_IMAGE_RATIO = BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;
const MIN_WIDTH = 1100;
const TOPO_COUNTRIES = topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.world);
const projection = geo.geoEqualEarth();
const pathGenerator = geo.geoPath().projection(projection);
const originalBounds = pathGenerator.bounds(TOPO_COUNTRIES);

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
  background-position: top 30% left 75%;
  background-repeat: no-repeat;
  /* background-size: ${({ width }) => width}px ${({ width }) => width / BG_IMAGE_RATIO}px; */
  background-size: 90%;

  fill: transparent;
  will-change: transform, stroke-width;
  transition: transform 0.5s ease-in;
  transform: translate(
      ${({ width, height, scale, offsetY }) =>
        `${(width * scale) / 2}px, ${(height * scale) / 2 + offsetY}px`}
    )
    translate(${({ x, y, scale, offsetY }) => `-${x * scale}px, -${y * scale}px`})
    scale(${({ scale }) => scale});
`;

const HighlightedPath = css`
  path {
    stroke: white;
    stroke-width: 1px;
  }

  path:hover {
    fill: white;
  }
`;

const HighlightedCountry = css`
  &:hover {
    fill: white;
  }
`;

const ContinentGroup = styled.g`
  will-change: stroke-width;
  transition: all 0.2s ease-in;
  ${({ isSelected }) => isSelected && HighlightedPath}
  ${({ isSelected }) => !isSelected && HighlightedCountry}
`;

const CountryTooltipContainer = styled.div`
  background-color: white;
  border: 1px solid black;
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  color: black;
`;

const isSameFeatures = (featureRef, feature) => {
  if (!featureRef.current) return;
  if (!featureRef.current.properties) return;
  return feature.properties.CONTINENT === featureRef.current.properties.CONTINENT;
};

const SvgPath = ({ d, onClick, ...props }) => {
  const pathRef = useRef();

  useEffect(() => {
    d3.select(pathRef.current).on("click", onClick).transition().duration(100).attr("d", d);
  }, [d]);

  return <path ref={pathRef} {...props} />;
};

const SvgContinent = ({ featureRef, topoJSON, projection, onCountryClick, onContinentClick }) => {
  const groupedTopoJSON = topoJSON.features.reduce((storage, feature) => {
    const CONTINENT = feature.properties.CONTINENT;
    if (!storage[CONTINENT]) {
      storage[CONTINENT] = {
        type: "FeatureCollection",
        properties: {
          CONTINENT: CONTINENT,
        },
        features: [],
      };
    }
    storage[CONTINENT].features.push(feature);
    return storage;
  }, {});

  return Object.keys(groupedTopoJSON).map(CONTINENT => {
    const featureCollection = groupedTopoJSON[CONTINENT];
    const isSelected = isSameFeatures(featureRef, featureCollection);
    return (
      <ContinentGroup
        key={CONTINENT}
        isSelected={isSelected}
        onClick={() => onContinentClick(featureCollection)}
      >
        <SvgPathsFromFeature
          features={featureCollection.features}
          projection={projection}
          onClick={onCountryClick}
        />
      </ContinentGroup>
    );
  });
};

const SvgPathsFromFeature = ({ features, projection, onClick, onMouseOver }) => {
  const pathGenerator = geo.geoPath().projection(projection);
  const handleMouseOver = feature => {
    if (onMouseOver) onMouseOver(feature);
  };

  return features.map(feature => {
    const path = pathGenerator(feature);

    const handleClick = () => {
      if (onClick) onClick(feature);
    };

    if (!path) return null;
    return <SvgPath key={path} onClick={handleClick} onMouseOver={() => handleMouseOver(feature)} d={path} />;
  });
};

const SvgTopoCities = ({ topoJSON, projection, onPathClick }) => {
  const pathGenerator = geo.geoPath().projection(projection);

  return topoJSON.features.map((feature, i) => {
    const [x, y] = pathGenerator.centroid(feature);

    return <circle key={i} onClick={() => onPathClick(feature)} r={1} cx={x} cy={y} fill="black" />;
  });
};

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
    const isSame = isSameFeatures(featureRef, feature);
    const continent = feature.properties.CONTINENT;
    if (isSame) feature = TOPO_COUNTRIES;
    const centroid = pathGenerator.centroid(feature);
    const bounds = pathGenerator.bounds(feature);
    const fullX = originalBounds[1][0] - originalBounds[0][0];
    const featX = bounds[1][0] - bounds[0][0];
    const scaleX = fullX / featX;
    const fullY = originalBounds[1][1] - originalBounds[0][1];
    const featY = bounds[1][1] - bounds[0][1];
    const scaleY = fullY / featY;
    const ratioX = featX / width;
    const ratioY = featY / height;

    featureRef.current = feature;

    if (isSame) {
      setScale(1);
      setCentroid([width / 2, height / 2]);
    } else if (["Asia", "Europe", "North America"].includes(continent)) {
      setScale(scaleX / 1.5 > 1 ? scaleX / 1.5 : 1.5);
      setCentroid([centroid[0], centroid[1]]);
    } else {
      setScale(ratioY > 1 ? ratioY : 1.5);
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
        <SvgContinent
          featureRef={featureRef}
          projection={projection}
          isSelected={featureRef.current}
          onContinentClick={onFeatureClick}
          onCountryClick={console.log}
          topoJSON={TOPO_COUNTRIES}
        />
      </AnimatedSvg>
      {overFeature && <ContryTooltip feature={overFeature} />}
    </SvgWrapper>
  );
};

export default SvgMap;
