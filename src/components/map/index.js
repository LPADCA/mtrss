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
  overflow: hidden;
  min-height: 100vh;
  position: relative;
  min-width: 100%;
`;

const AnimatedSvg = styled.svg`
  stroke: transparent;
  background-color: transparent;
  background-image: url(${earthBG});
  background-size: contain;
  background-position: top 45% left 75%;
  background-repeat: no-repeat;
  /* background-size: ${({ width }) => width}px ${({ width }) => width / BG_IMAGE_RATIO}px; */
  background-size: 90%;

  fill: transparent;
  will-change: transform, stroke-width;
  transition: transform 1s ease-in;
  /* transform: translate(${({ width, height, scale }) =>
    `${(width / 2) * scale}px, ${(height / 2) * scale}px`})
    translate(${({ x, y, scale }) => `-${x * scale}px, -${y * scale}px`}) scale(${({ scale }) => scale}); */
  transform: translate(
      ${({ x, y, width, height, offsetX, offsetY, scale }) =>
        `${(width / 2) * scale - x * scale - offsetX / scale}px, ${
          (height / 2) * scale - y * scale - offsetY / scale
        }px`}
    )
    scale(${({ scale }) => scale});
`;

const HighlightedPath = css`
  path {
    vector-effect: non-scaling-stroke;
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
  will-change: fill;
  transition: fill 0.3s ease-in 0s;

  path {
    will-change: stroke-width, stroke;
    transition: stroke 0.3s ease-in 1s;
  }

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

  return <path vectorEffect="non-scaling-stroke" ref={pathRef} {...props} />;
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
  const wrapperRef = useRef();
  const featureRef = useRef();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions({ width: 0, height: 0 });
  const mapWidth = Math.max(screenWidth, MIN_WIDTH);
  const mapHeight = mapWidth / BG_IMAGE_RATIO;
  const screenCentroid = [screenWidth / 2, screenHeight / 2];
  const mapCentroid = [mapWidth / 2, mapHeight / 2];
  console.log("mapCentroid", mapCentroid);
  console.log("screenCentroid", screenCentroid);
  const mapOffset = [mapCentroid[0] - screenCentroid[0], mapCentroid[1] - screenCentroid[1]];
  console.log("mapOffset", mapOffset);
  const originalCentroid = [mapCentroid[0] + mapOffset[0], mapCentroid[1] + mapOffset[1]];
  console.log("offsetCentroid", originalCentroid);

  const [centroid, setCentroid] = useState(mapCentroid);
  const offsetY = (screenHeight - mapHeight) / 2;

  const [scale, setScale] = useState(1);
  console.log("scale", scale);
  useEffect(() => {
    if (!featureRef.current) setCentroid(mapCentroid);
  }, [mapWidth, mapHeight]);

  projection.fitExtent(
    [
      [0, 0],
      [mapWidth, mapHeight],
    ],
    TOPO_COUNTRIES
  );
  const onFeatureClick = feature => {
    const isSame = isSameFeatures(featureRef, feature);
    const continent = feature.properties.CONTINENT;
    if (isSame) feature = TOPO_COUNTRIES;
    const featureCentroid = pathGenerator.centroid(feature);
    const bounds = pathGenerator.bounds(feature);
    console.log("bounds", bounds);
    console.log("centroid", featureCentroid);
    // const fullX = originalBounds[1][0] - originalBounds[0][0];
    const fullX = mapWidth;
    console.log("fullX", fullX);
    const mapHeight = originalBounds[1][1] - originalBounds[0][1];
    console.log("mapHeight", mapHeight);
    const offsetY = mapHeight - mapHeight;
    console.log("offsetY", offsetY);
    const featX = bounds[1][0] - bounds[0][0];
    const scaleX = fullX / featX;
    const fullY = mapHeight;
    const featY = bounds[1][1] - bounds[0][1];
    const scaleY = fullY / featY;
    const ratioX = featX / mapWidth;
    const ratioY = featY / mapHeight;

    const offsetFeatureCentroid = [featureCentroid[0] + mapOffset[0], featureCentroid[1] + mapOffset[1]];
    console.log("offsetFeatureCentroid", offsetFeatureCentroid);
    featureRef.current = feature;

    if (isSame) {
      setScale(1);
      setCentroid(mapCentroid);
    } else if (["Asia", "Europe", "North America"].includes(continent)) {
      setScale(ratioY > 1 ? ratioY : 1.5);
      setCentroid(featureCentroid);
    } else {
      setScale(ratioY > 1 ? ratioY : 1.5);
      setCentroid(featureCentroid);
    }
  };

  if (mapWidth === 0 && mapHeight === 0) return null;

  return (
    <SvgWrapper ref={wrapperRef}>
      <AnimatedSvg
        ref={svgRef}
        width={mapWidth}
        height={mapHeight}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        x={centroid[0]}
        y={centroid[1]}
        offsetX={mapOffset[0]}
        offsetY={mapOffset[1]}
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
      {/* {overFeature && <ContryTooltip feature={overFeature} />} */}
    </SvgWrapper>
  );
};

export default SvgMap;
