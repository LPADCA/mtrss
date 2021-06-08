import React, { useEffect, useState, useRef } from "react";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import styled, { css, keyframes } from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/flowers-red.png";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world3.topo.json";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "@react-spring/web";
import LISTENERS_STATS from "../../assets/stats.json";
import * as scale from "d3-scale";

const BG_IMAGE_WIDTH = 2660;
const BG_IMAGE_HEIGHT = 1484;
const BG_IMAGE_RATIO = BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;
const MIN_WIDTH = 1100;
const TOPO_COUNTRIES = {
  ...topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.world),
  properties: { continent: "World" },
};
const projection = geo.geoEqualEarth();
const pathGenerator = geo.geoPath().projection(projection);

const MIN_VALUE = Math.min(...LISTENERS_STATS.map(s => s.value));
const MAX_VALUE = Math.max(...LISTENERS_STATS.map(s => s.value));
const MIN_RADIUS = 5;
const MAX_RADIUS = 40;
const MIN_OPACITY = 0.6;
const MAX_OPACITY = 0.4;

const getRadius = scale.scaleSqrt().domain([MIN_VALUE, MAX_VALUE]).range([MIN_RADIUS, MAX_RADIUS]);
const getOpacity = scale.scaleSqrt().domain([MIN_VALUE, MAX_VALUE]).range([MIN_OPACITY, MAX_OPACITY]);

const SvgWrapper = styled.div`
  background-image: url(${oceanBG});
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  position: relative;
  min-width: 100%;
  height: ${({ height }) => height}px;
`;

const AnimatedSvg = styled(animated.svg)`
  stroke: transparent;
  background-image: url(${earthBG});
  background-position: center right;
  background-repeat: no-repeat;
  background-size: 93%;
  min-width: ${MIN_WIDTH}px;
  height: auto;
  fill: transparent;
  will-change: transform, stroke-width, width, height;
  touch-action: pan-y;
  -moz-user-select: none;
  -webkit-user-drag: none;
  user-select: none;
`;

const GROUPED_TOPO_COUNTRIES = TOPO_COUNTRIES.features.reduce((storage, feature) => {
  const continent = feature.properties.continent;
  if (!storage[continent]) {
    storage[continent] = {
      type: "FeatureCollection",
      properties: {
        continent: continent,
      },
      features: [],
    };
  }
  storage[continent].features.push(feature);
  return storage;
}, {});

const getTranslate = args => {
  const { screenCentroid, x, y, offsetX = 0, offsetY = 0, scale } = args;
  return `${screenCentroid[0] - x * scale - offsetX}px, ${screenCentroid[1] - y * scale - offsetY}px`;
};

const pulse = keyframes`
  from {
    stroke-width: 3px;
    stroke-opacity: 1;
    transform: scale(0.9);
  }
  to {
    stroke-width: 0;
    stroke-opacity: 0;
    transform: scale(1.3);
  }
`;

const Circle = styled.circle`
  fill: #fdf0f0;
  pointer-events: none;
  opacity: ${({ opacity }) => opacity};
`;

const PulseCircle = styled.circle`
  pointer-events: none;
  transform-box: fill-box;
  transform-origin: center;
  stroke: #fdf0f0;
  stroke-width: 0;
  stroke-opacity: 0;
  fill-opacity: 0;
  will-change: stroke, transform;
  animation-duration: 2s;
  animation-name: ${pulse};
  animation-iteration-count: infinite;
`;

const Group = styled.g``;

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
    stroke: white;
  }
`;

const ContinentGroup = styled.g`
  path {
    will-change: stroke-width, stroke;
    transition: stroke 0.3s ease-in;
  }

  ${({ isSelected }) => isSelected && HighlightedPath}
  ${({ isSelected }) => !isSelected && HighlightedCountry}
`;

const isSameContinents = (feature1, feature2) => {
  if (!feature1.properties) return;
  if (!feature2.properties) return;
  return feature1.properties.continent === feature2.properties.continent;
};

const isSameFeatures = (feature1, feature2) => {
  if (!feature1.properties) return;
  if (!feature2.properties) return;
  return feature1.properties.name === feature2.properties.name;
};

// const compareFeatureProps = (prevProps, nextProps) => {
//   const isSameFeature = isSameFeatures(prevProps.feature, nextProps.feature);
//   const isSameWidth = prevProps.mapWidth === nextProps.mapWidth;
//   const isSameHeight = prevProps.mapHeight === nextProps.mapHeight;
//   const isSelected = isSameFeatures(nextProps.feature, nextProps.selectedFeature);
//   return isSameFeature && isSameWidth && isSameHeight && !isSelected;
// };

const SvgPathFromFeature = ({ feature, onClick, index, total }) => {
  const [isShown, setShown] = useState(false);
  if (pathGenerator.measure(feature) === 0) return;
  const path = pathGenerator(feature);
  const centroid = pathGenerator.centroid(feature);
  const country = feature.properties.name;

  const stats = LISTENERS_STATS.find(stat => stat.country === country);

  const handleClick = () => {
    if (onClick) onClick(feature.properties.name);
  };
  if (!path) return null;

  return (
    <Group
      key={path}
      name={feature.properties.name}
      onMouseOver={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      {stats && (
        <Circle
          cx={centroid[0]}
          cy={centroid[1]}
          r={getRadius(stats.value)}
          opacity={getOpacity(stats.value)}
        ></Circle>
      )}
      {stats && isShown && (
        <PulseCircle
          cx={centroid[0]}
          cy={centroid[1]}
          total={total}
          index={index}
          r={getRadius(stats.value)}
        ></PulseCircle>
      )}
      <path onClick={handleClick} d={path} />
    </Group>
  );
};

SvgPathFromFeature.displayName = "SvgPathFromFeature";

const SvgPathsFromFeature = ({ mapWidth, selectedFeature, mapHeight, features, onClick }) => {
  return features.map((feature, index) => (
    <SvgPathFromFeature
      key={feature.properties.su_a3}
      mapWidth={mapWidth}
      mapHeight={mapHeight}
      feature={feature}
      onClick={onClick}
      index={index}
      selectedFeature={selectedFeature}
    />
  ));
};

const SvgContinent = ({
  mapWidth,
  mapHeight,
  featureCollection,
  selectedFeature,
  onCountryClick,
  onContinentClick,
}) => {
  const isSelected = isSameContinents(selectedFeature, featureCollection);

  const handleCountryClick = feature => {
    if (isSelected && onCountryClick) onCountryClick(feature);
  };

  const handleContinentClick = e => {
    e.stopPropagation();
    if (!isSelected && onContinentClick) onContinentClick(featureCollection);
  };

  return (
    <ContinentGroup isSelected={isSelected} onClick={handleContinentClick}>
      <SvgPathsFromFeature
        mapWidth={mapWidth}
        mapHeight={mapHeight}
        features={featureCollection.features}
        onClick={handleCountryClick}
        selectedFeature={selectedFeature}
      />
    </ContinentGroup>
  );
};

const SvgContinents = ({ mapWidth, mapHeight, selectedFeature, onCountryClick, onContinentClick }) =>
  Object.keys(GROUPED_TOPO_COUNTRIES).map(continent => {
    return (
      <SvgContinent
        key={continent}
        featureCollection={GROUPED_TOPO_COUNTRIES[continent]}
        onCountryClick={onCountryClick}
        onContinentClick={onContinentClick}
        selectedFeature={selectedFeature}
        mapWidth={mapWidth}
        mapHeight={mapHeight}
      />
    );
  });

const SvgContinentsContainer = ({
  mapWidth,
  mapHeight,
  selectedFeature,
  onCountryClick,
  onContinentClick,
}) => {
  return (
    <SvgContinents
      groupedTopoJSON={GROUPED_TOPO_COUNTRIES}
      selectedFeature={selectedFeature}
      onCountryClick={onCountryClick}
      onContinentClick={onContinentClick}
      mapWidth={mapWidth}
      mapHeight={mapHeight}
    />
  );
};

const SvgMap = ({ screenWidth, screenHeight, onCountryClick }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const mapWidth = Math.max(screenWidth, MIN_WIDTH);
  const mapHeight = Math.max(screenHeight, MIN_WIDTH / BG_IMAGE_RATIO);
  const screenCentroid = [screenWidth / 2, screenHeight / 2];
  const mapCentroid = [mapWidth / 2, mapHeight / 2];
  const mapBounds = pathGenerator.bounds(TOPO_COUNTRIES);
  const [selectedFeature, setFeature] = useState(TOPO_COUNTRIES);
  const [scale, setScale] = useState(1);
  const [centroid, setCentroid] = useState(mapCentroid);
  const isFullMapShown = selectedFeature === TOPO_COUNTRIES;

  const getTranslateWithOffset = offsetX => {
    const translate = getTranslate({
      screenCentroid: screenCentroid,
      x: centroid[0],
      y: centroid[1],
      offsetX: offsetX,
      offsetY: isFullMapShown ? 0 : mapBounds[0][1],
      scale: scale,
    });

    return {
      width: `${mapWidth * scale}px`,
      offsetX: -offsetX,
      translate,
    };
  };

  const [styles, api] = useSpring(() => ({
    ...getTranslateWithOffset(50),
    config: {
      duration: 500,
    },
  }));

  const bind = useDrag(
    ({ movement: [x], dragging }) => {
      if (dragging) api.start(getTranslateWithOffset(-x));
    },
    {
      delay: 1000,
      initial: () => [styles.offsetX.get(), 0],
    }
  );

  useEffect(() => {
    api.start(getTranslateWithOffset(0));
  }, [scale, centroid, selectedFeature]);

  useEffect(() => {
    console.log('update selected feature', selectedFeature)
  }, [selectedFeature]);

  useEffect(() => {
    if (isFullMapShown) setCentroid(mapCentroid);
  }, [mapWidth, mapHeight]);

  projection.fitExtent(
    [
      [0, 0],
      [mapWidth, mapHeight],
    ],
    TOPO_COUNTRIES
  );

  const featureClickHandler = feature => {
    const isSame = isSameContinents(selectedFeature, feature);
    console.log('featureClickHandler',  selectedFeature, feature, isSame)
    if (isSame) feature = TOPO_COUNTRIES;
    setFeature(feature);
    console.log('selectedFeature after set', selectedFeature);
    const newCentroid = pathGenerator.centroid(feature);
    const newBounds = pathGenerator.bounds(feature);
    const newX = newBounds[1][0] - newBounds[0][0];
    const newY = newBounds[1][1] - newBounds[0][1];
    const mapWidth = mapBounds[1][0] - mapBounds[0][0];
    const mapHeight = mapBounds[1][1] - mapBounds[0][1];
    const scaleX = mapWidth / newX;
    const scaleY = mapHeight / newY;
    const scale = Math.min(scaleX, scaleY);
    setScale(scale);
    if (isSame) {
      setCentroid(mapCentroid);
    } else {
      setCentroid(newCentroid);
    }
  };

  const handleFeatureClick = featureClickHandler;

  const handleMapClick = country => {
    onCountryClick(country);
  };

  if (mapWidth === 0 && mapHeight === 0) return null;

  return (
    <SvgWrapper ref={wrapperRef} height={screenHeight}>
      <AnimatedSvg
        style={styles}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        ref={svgRef}
        width={mapWidth}
        height={mapHeight}
        {...bind()}
      >
        <SvgContinentsContainer
          selectedFeature={selectedFeature}
          onContinentClick={handleFeatureClick}
          onCountryClick={handleMapClick}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
        />
      </AnimatedSvg>
    </SvgWrapper>
  );
};

export default SvgMap;
