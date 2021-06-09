import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { pathGenerator, getRadius, getOpacity } from "./geo";
import LISTENERS_STATS from "../../assets/stats.json";

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

export default SvgPathFromFeature;
