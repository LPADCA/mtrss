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
const MAX_RADIUS = 50;
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
  transform-box: fill-box;
  stroke: transparent;
  touch-action: none;
  background-color: transparent;
  background-image: url(${earthBG});
  background-position: center right;
  background-repeat: no-repeat;
  background-size: 93%;
  min-width: ${MIN_WIDTH}px;
  fill: transparent;
  will-change: transform, stroke-width, width, height;
`;

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
  transform-box: fill-box;
  transform-origin: center;
  pointer-events: none;
  stroke: #fdf0f0;
  stroke-width: 2px;
  stroke-opacity: 0.5;
  fill-opacity: 0;
  animation-duration: 2s;
  animation-name: ${pulse};
  animation-iteration-count: infinite;
  will-change: stroke, transform;
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
  will-change: fill;
  transition: fill 0.3s ease-in 0s;

  path {
    will-change: stroke-width, stroke;
    transition: stroke 0.3s ease-in 0.5s;
  }

  ${({ isSelected }) => isSelected && HighlightedPath}
  ${({ isSelected }) => !isSelected && HighlightedCountry}
`;

const isSameFeatures = (feature1, feature2) => {
  if (!feature1.properties) return;
  if (!feature2.properties) return;
  return feature1.properties.continent === feature2.properties.continent;
};

const SvgContinent = ({ featureCollection, selectedFeature, onCountryClick, onContinentClick }) => {
  const isSelected = isSameFeatures(selectedFeature, featureCollection);

  const handleCountryClick = feature => {
    if (isSelected && onCountryClick) onCountryClick(feature);
  };
  const handleContinentClick = e => {
    e.stopPropagation();
    if (onContinentClick) onContinentClick(featureCollection);
  };

  return (
    <ContinentGroup isSelected={isSelected} onClick={handleContinentClick}>
      <SvgPathsFromFeature
        features={featureCollection.features}
        projection={projection}
        onClick={handleCountryClick}
      />
    </ContinentGroup>
  );
};

const SvgContinents = ({ groupedTopoJSON, selectedFeature, projection, onCountryClick, onContinentClick }) =>
  Object.keys(groupedTopoJSON).map(continent => {
    return (
      <SvgContinent
        key={continent}
        featureCollection={groupedTopoJSON[continent]}
        onCountryClick={onCountryClick}
        projection={projection}
        onContinentClick={onContinentClick}
        selectedFeature={selectedFeature}
      />
    );
  });

const SvgContinentsContainer = ({
  selectedFeature,
  topoJSON,
  projection,
  onCountryClick,
  onContinentClick,
}) => {
  const groupedTopoJSON = topoJSON.features.reduce((storage, feature) => {
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
  return (
    <SvgContinents
      groupedTopoJSON={groupedTopoJSON}
      selectedFeature={selectedFeature}
      projection={projection}
      onCountryClick={onCountryClick}
      onContinentClick={onContinentClick}
    />
  );
};

const SvgPathsFromFeature = ({ features, projection, onClick, onMouseOver }) => {
  return features.map((feature, i) => {
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
      <g key={path}>
        <path onClick={handleClick} d={path} />
        {stats && (
          <Circle
            cx={centroid[0]}
            cy={centroid[1]}
            r={getRadius(stats.value)}
            opacity={getOpacity(stats.value)}
          ></Circle>
        )}
        {stats && i % 3 == 0  && <PulseCircle cx={centroid[0]} cy={centroid[1]} r={getRadius(stats.value)}></PulseCircle>}
      </g>
    );
  });
};

const SvgMap = ({ screenWidth, screenHeight, onCountryClick }) => {
  const wrapperRef = useRef();

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

  const [styles, api] = useSpring(() => getTranslateWithOffset(50), {
    mass: 1000,
    tension: 1000,
    friction: 0,
  });

  const bind = useDrag(
    args => {
      const {
        delta,
        movement: [x],
        dragging,
      } = args;
      if (!dragging) return;
      const displayOffsetY = window.scrollY - delta[1];
      window.scroll(0, displayOffsetY);
      api.start(getTranslateWithOffset(-x));
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
    if (isFullMapShown) setCentroid(mapCentroid);
  }, [mapWidth, mapHeight]);

  projection.fitExtent(
    [
      [0, 0],
      [mapWidth, mapHeight],
    ],
    TOPO_COUNTRIES
  );
  const onFeatureClick = feature => {
    const isSame = isSameFeatures(selectedFeature, feature);
    if (isSame) feature = TOPO_COUNTRIES;
    setFeature(feature);

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
        {...bind()}
      >
        <SvgContinentsContainer
          projection={projection}
          selectedFeature={selectedFeature}
          onContinentClick={onFeatureClick}
          onCountryClick={handleMapClick}
          topoJSON={TOPO_COUNTRIES}
        />
      </AnimatedSvg>
    </SvgWrapper>
  );
};

export default SvgMap;
