import React, { useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/flowers-red.png";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "@react-spring/web";
import { TOPO_COUNTRIES, MIN_WIDTH, BG_IMAGE_RATIO, pathGenerator, projection } from "./geo";
import SvgPathFromFeature from "./svg-path-from-feature";

const SvgWrapper = styled.div`
  background-image: url(${oceanBG});
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  min-width: 100%;
  height: ${({ height }) => height}px;
  min-height: 100%;
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

const HighlightedPath = css`
  path {
    stroke: white;
    stroke-width: 1px;
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

class Loader {
  constructor(callback) {
    this.callback = callback;
    this.isAnimationEnded = false;
    this.isPictureLoaded = false;
  }

  executeCallback() {
    if (!this.isAnimationEnded) return;
    if (!this.isPictureLoaded) return;
    this.callback();
  }

  animationEnded() {
    this.isAnimationEnded = true;
    this.executeCallback();
  }

  pictureLoaded() {
    this.isPictureLoaded = true;
    this.executeCallback();
  }
}

const SvgMap = ({ className, onMapLoaded, screenWidth, screenHeight, onCountryClick }) => {
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

  const loader = new Loader(onMapLoaded);

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
    onRest: e => loader.animationEnded(),
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
    if (isFullMapShown) setCentroid(mapCentroid);
  }, [mapWidth, mapHeight]);

  useEffect(() => {
    const imageLoader = new Image();
    imageLoader.src = earthBG;

    imageLoader.onload = () => loader.pictureLoaded();
  }, []);

  projection.fitExtent(
    [
      [0, 0],
      [mapWidth, mapHeight],
    ],
    TOPO_COUNTRIES
  );

  const featureClickHandler = feature => {
    const isSame = isSameContinents(selectedFeature, feature);
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

  const handleFeatureClick = featureClickHandler;

  const handleMapClick = country => {
    onCountryClick(country);
  };

  if (mapWidth === 0 && mapHeight === 0) return null;

  return (
    <SvgWrapper className={className} ref={wrapperRef} height={screenHeight}>
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
