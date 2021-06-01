import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import styled, { css } from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/flowers-red.png";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world2.topo.json";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";

const BG_IMAGE_WIDTH = 2660;
const BG_IMAGE_HEIGHT = 1484;
const BG_IMAGE_RATIO = BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;
const MIN_WIDTH = 1100;
const TOPO_COUNTRIES = topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.world);
const projection = geo.geoEqualEarth();
const pathGenerator = geo.geoPath().projection(projection);

const SvgWrapper = styled.div`
  background-image: url(${oceanBG});
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
  position: relative;
  min-width: 100%;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const AnimatedSvg = styled(animated.svg)`
  stroke: transparent;
  touch-action: none;
  background-color: transparent;
  background-image: url(${earthBG});
  background-size: contain;
  background-position: center right;
  background-repeat: no-repeat;
  background-size: 93%;

  fill: transparent;
  will-change: transform, stroke-width;
`;

const getTranslate = args => {
  console.log("translate", JSON.stringify(args, null, 4));
  const { width, height, x, y, offsetX, offsetY, scale } = args;
  return `${(width / 2) * scale - x * scale - offsetX}px, ${(height / 2) * scale - y * scale - offsetY}px`;
};

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
  return feature1.properties.CONTINENT === feature2.properties.CONTINENT;
};

const isNorth = feature => {
  if (!feature.properties) return;
  return ["Asia", "Europe", "North America"].indexOf(feature.properties.CONTINENT) + 1;
};

const SvgPath = ({ d, onClick, ...props }) => {
  const pathRef = useRef();

  useEffect(() => {
    d3.select(pathRef.current).on("click", onClick).transition().duration(100).attr("d", d);
  }, [d]);

  return <path vectorEffect="non-scaling-stroke" ref={pathRef} {...props} />;
};

const SvgContinents = ({ selectedFeature, topoJSON, projection, onCountryClick, onContinentClick }) => {
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
    const isSelected = isSameFeatures(selectedFeature, featureCollection);
    const handleClick = e => {
      e.stopPropagation();
      if (onContinentClick) onContinentClick(featureCollection);
    };
    return (
      <ContinentGroup key={CONTINENT} isSelected={isSelected} onClick={handleClick}>
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
    if (pathGenerator.measure(feature) === 0) return;
    const path = pathGenerator(feature);
    const handleClick = () => {
      if (onClick) onClick(feature);
    };

    if (!path) return null;
    return <SvgPath key={path} onClick={handleClick} onMouseOver={() => handleMouseOver(feature)} d={path} />;
  });
};

const SvgMap = ({ screenWidth, screenHeight }) => {
  const svgRef = useRef();
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
    config: config.slow,
  }));
  const noSelected = selectedFeature === TOPO_COUNTRIES;
  const centroid = noSelected ? mapCentroid : pathGenerator.centroid(selectedFeature);

  const bind = useDrag(
    ({ delta, offset: [x] }) => {
      window.scroll(0, window.scrollY - delta[1]);

      api.start({
        translate: getTranslate({
          width: mapWidth,
          height: mapHeight,
          x: centroid[0],
          y: centroid[1],
          offsetX: mapOffset[0] - x,
          offsetY: mapOffset[1],
          scale: scale,
        }),
        scale,
      });
    },

    { target: svgRef, delay: 1000 }
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
        scale,
      });
      setScale(scale);
      setFeature(feature);
    }
  };

  if (mapWidth === 0 && mapHeight === 0) return null;

  return (
    <SvgWrapper ref={wrapperRef} height={mapHeight}>
      <AnimatedSvg
        ref={svgRef}
        style={styles}
        width={mapWidth}
        height={mapHeight}
        scale={scale}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...bind}
      >
        <SvgContinents
          projection={projection}
          selectedFeature={selectedFeature}
          onContinentClick={onFeatureClick}
          topoJSON={TOPO_COUNTRIES}
        />
      </AnimatedSvg>
    </SvgWrapper>
  );
};

export default SvgMap;
