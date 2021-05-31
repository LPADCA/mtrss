import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import styled, { css } from "styled-components";
import oceanBG from "../../assets/images/Flowers_White.jpg";
import earthBG from "../../assets/images/flowers-red.png";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world2.topo.json";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";

const BG_IMAGE_WIDTH = 1920;
const BG_IMAGE_HEIGHT = 919;
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

const getTranslate = (width, height, x, y, offsetX, offsetY, scale) => {
  // console.log(
  //   "width",
  //   width,
  //   "height",
  //   height,
  //   "x",
  //   x,
  //   "y",
  //   y,
  //   "offsetX",
  //   offsetX,
  //   "offsetY",
  //   offsetY,
  //   "scale",
  //   scale
  // );
  return `${(width / 2) * scale - x * scale - offsetX}px, ${(height / 2) * scale - y * scale}px`;
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

const SvgContinent = ({ selectedFeature, topoJSON, projection, onCountryClick, onContinentClick }) => {
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

const SvgMap = props => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const featureRef = useRef();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions({ width: 0, height: 0 });
  const mapWidth = Math.max(screenWidth, MIN_WIDTH);
  const mapHeight = screenHeight;
  const screenCentroid = [screenWidth / 2, screenHeight / 2];
  const mapCentroid = [mapWidth / 2, mapHeight / 2];
  const mapOffset = [mapCentroid[0] - screenCentroid[0], mapCentroid[1] - screenCentroid[1]];
  const [selectedFeature, setFeature] = useState(TOPO_COUNTRIES);
  const [styles, api] = useSpring(() => ({
    translate: getTranslate(
      mapWidth,
      mapHeight,
      mapCentroid[0],
      mapCentroid[1],
      mapOffset[0],
      mapOffset[1],
      1
    ),
    config: config.slow,
  }));
  const centroid = selectedFeature === TOPO_COUNTRIES ? pathGenerator.centroid(selectedFeature) : mapCentroid;

  const bind = useGesture(
    {
      onDrag: ({ delta, offset: [x], first, last }) => {
        window.scroll(0, window.scrollY - delta[1] / 2);
        console.log("mapOffset[0], x", mapOffset[0], x);
        console.log("mapOffset[0] - x", mapOffset[0] - x);
        console.log("selectedFeature", selectedFeature);
        console.log("centroid", centroid);

        api.start({
          translate: getTranslate(
            mapWidth,
            mapHeight,
            centroid[0],
            centroid[1],
            mapOffset[0] - x,
            mapOffset[1],
            scale
          ),
          scale,
        });
      },
    },
    { target: svgRef, drag: { delay: 1000 } }
  );

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!featureRef.current) {
      api.start({
        translate: getTranslate(
          mapWidth,
          mapHeight,
          mapCentroid[0],
          mapCentroid[1],
          mapOffset[0],
          mapOffset[1],
          scale
        ),
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
        translate: getTranslate(
          mapWidth,
          mapHeight,
          centroid[0],
          mapCentroid[1],
          mapOffset[0],
          mapOffset[1],
          1
        ),
        scale: 1,
      });
      setScale(1);
      setFeature(TOPO_COUNTRIES);
    } else {
      // Hack :(
      const yOffset = isNorth(feature) ? 50 : 0;

      api.start({
        translate: getTranslate(
          mapWidth,
          mapHeight,
          featureCentroid[0],
          featureCentroid[1] + yOffset,
          mapOffset[0],
          mapOffset[1],
          scale
        ),
        scale,
      });
      setScale(scale);
      setFeature(feature);
    }
  };

  if (mapWidth === 0 && mapHeight === 0) return null;

  return (
    <SvgWrapper ref={wrapperRef}>
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
        {...props}
      >
        <SvgContinent
          projection={projection}
          selectedFeature={selectedFeature}
          onContinentClick={onFeatureClick}
          topoJSON={TOPO_COUNTRIES}
        />
      </AnimatedSvg>
      {/* {overFeature && <ContryTooltip feature={overFeature} />} */}
    </SvgWrapper>
  );
};

export default SvgMap;
