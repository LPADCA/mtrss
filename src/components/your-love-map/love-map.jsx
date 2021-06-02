import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import styled, { css } from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/flowers-red.png";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world3.topo.json";
import { useDrag } from "react-use-gesture";
import { useSpring, animated, config } from "@react-spring/web";

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

const LISTENERS_STATS = [
  {
    country: "Germany",
    value: "6k",
  },
  {
    country: "United States",
    value: "1.9k",
  },
  {
    country: "Mexico",
    value: "1.7k",
  },
  {
    country: "Netherlands",
    value: "935",
  },
  {
    country: "Poland",
    value: "845",
  },
];

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
  touch-action: none;
  background-color: transparent;
  background-image: url(${earthBG});
  background-position: center right;
  background-repeat: no-repeat;
  background-size: 93%;
  /* width: ${({ scale }) => 100 * scale}%;
  height: ${({ scale }) => 100 * scale}%; */
  fill: transparent;
  will-change: transform, stroke-width, width, height;
`;

const getTranslate = args => {
  const { width, height, x, y, offsetX, offsetY, scale } = args;
  return `${(width / 2) * scale - x * scale - offsetX}px, ${(height / 2) * scale - y * scale - offsetY}px`;
};

const Circle = styled.circle`
  fill: #49f849;
  pointer-events: none;
`;

const Text = styled.text`

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
    if (!isSelected && onContinentClick) onContinentClick(featureCollection);
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
  return features.map(feature => {
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
        <path onClick={handleClick} d={path} />;
        {stats && <Circle cx={centroid[0]} cy={centroid[1]} r="10"></Circle>}
        {stats && (
          <text x={centroid[0]} fill="black" y={centroid[1]}>
            {stats.value}
          </text>
        )}
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
  const mapOffset = [mapCentroid[0] - screenCentroid[0], mapCentroid[1] - screenCentroid[1]];
  const [selectedFeature, setFeature] = useState(TOPO_COUNTRIES);
  const [styles, api] = useSpring(() => ({
    translate: getTranslate({
      width: mapWidth,
      height: mapHeight,
      x: mapCentroid[0],
      y: mapCentroid[1],
      offsetX: mapOffset[0],
      offsetY: mapOffset[1],
      scale: 1,
    }),
    pos: [0, 0],
    config: config.slow,
  }));
  const noSelected = isSameFeatures(selectedFeature, TOPO_COUNTRIES);
  const centroid = noSelected ? mapCentroid : pathGenerator.centroid(selectedFeature);
  const bind = useDrag(
    args => {
      const {
        delta,
        movement: [x],
        dragging,
      } = args;
      if (!dragging) return;
      const offsetX = mapOffset[0] - x;
      const displayOffsetY = window.scrollY - delta[1];
      const pos = [x, 0];
      window.scroll(0, displayOffsetY);
      api.start({
        translate: getTranslate({
          width: mapWidth,
          height: mapHeight * scale,
          x: centroid[0],
          y: centroid[1],
          offsetX: offsetX,
          offsetY: mapOffset[1],
          scale: scale,
        }),
        pos: pos,
        scale,
      });
    },
    {
      delay: 1000,
      initial: () => styles.pos.get(),
    }
  );

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (noSelected) {
      api.start({
        translate: getTranslate({
          width: mapWidth,
          height: mapHeight,
          x: mapCentroid[0],
          y: mapCentroid[1],
          offsetX: mapOffset[0],
          offsetY: mapOffset[1],
          scale: scale,
        }),
        pos: [0, 0],
        scale,
      });
    }
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
    const featureCentroid = pathGenerator.centroid(feature);
    const bounds = pathGenerator.bounds(feature);
    const fullX = mapWidth;
    const featX = bounds[1][0] - bounds[0][0];
    const scaleX = fullX / featX;
    const scale = scaleX / 3.5 > 1 ? scaleX / 3.5 : 1.5;
    if (isSame) {
      api.start({
        translate: getTranslate({
          width: mapWidth,
          height: mapHeight,
          x: centroid[0],
          y: mapCentroid[1],
          offsetX: mapOffset[0],
          offsetY: mapOffset[1],
          scale: 1,
        }),
        scale: 1,
      });
      setScale(1);
      setFeature(TOPO_COUNTRIES);
    } else {
      api.start({
        translate: getTranslate({
          width: mapWidth,
          height: mapHeight,
          x: featureCentroid[0],
          y: featureCentroid[1],
          offsetX: mapOffset[0],
          offsetY: mapOffset[1],
          scale: scale,
        }),
        pos: [0, 0],

        scale,
      });
      setScale(scale);
      setFeature(feature);
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
        scale={scale}
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
