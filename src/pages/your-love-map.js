import React, { useEffect, useState, useRef, createRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";
import * as geoProjection from "d3-geo-projection";
import { createGlobalStyle } from "styled-components";
import useWindowDimensions from "../hooks/useWindowDimensions";
import styled from "styled-components";
import oceanBG from "../assets/images/ocean.jpg";
import earthBG from "../assets/images/earth.jpg";
import WORLD_TOPO_JSON from "../assets/geoJsons/world.topo.json";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    overflow: hidden;
  }
`;

const SvgWrapper = styled.div`
  background-image: url(${oceanBG});
  background-size: cover;
`;

const AnimatedSvg = styled.svg`
  stroke: white;
  background-color: transparent;
  fill: url(#img1);

  will-change: transform, stroke-width;
  transition: transform 0.5s ease-in;
  transform: 
    translate(${({ width, height, scale }) => `${(width * scale) / 2}px, ${(height * scale) / 2}px`})
    translate(${({ x, y, scale }) => `-${x * scale}px, -${y * scale}px`})
    scale(${({ scale }) => scale});

  path:hover {
    stroke-width: 2px;
  }
`;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const SvgPath = ({ d, onClick, ...props }) => {
  const pathRef = useRef();

  useEffect(() => {
    d3.select(pathRef.current).on("click", onClick).transition().duration(100).attr("d", d);
  }, [d]);

  return <path ref={pathRef} />;
};

const SvgPathsFromFeature = ({ topoJSON, projection, onPathClick }) => {
  const { height, width } = useWindowDimensions({ width: 1920, height: 1080 });
  const pathGenerator = geo.geoPath().projection(projection);

  return topoJSON.features.map((feature) => {
    return (
      <SvgPath
        key={feature.properties.NE_ID}
        onClick={() => onPathClick(feature)}
        d={pathGenerator(feature)}
      />
    );
  });
};

const topoJSON = topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.world);
const projection = geo.geoEqualEarth();
const pathGenerator = geo.geoPath().projection(projection);

const originalBounds = pathGenerator.bounds(topoJSON);

const SvgMap = (props) => {
  const svgRef = useRef();
  const svg = d3.select(svgRef.current);
  const { height, width } = useWindowDimensions({ width: 0, height: 0 });
  const [centroid, setCentroid] = useState([width / 2, height / 2]);
  const [scale, setScale] = useState(1);

  const [selectedFeature, setSelectedFeature] = useState();
  console.log("selectedFeature render", selectedFeature);

  useEffect(() => {
    if (!selectedFeature) setCentroid([width / 2, height / 2]);
  }, [selectedFeature, width, height]);

  projection.fitSize([width, height], topoJSON);

  // console.log("centroid", centroid);

  const onFeatureClick = (feature) => {
    console.log('feature', feature)
    console.log('selectedFeature', selectedFeature)
    console.log('feature === selectedFeature', feature === selectedFeature)
    if (feature === selectedFeature) {
      feature = topoJSON
    }
    const centroid = pathGenerator.centroid(feature);
    // console.log('centroid', centroid)
    const bounds = pathGenerator.bounds(feature);
    // console.log('bounds', bounds)
    const fullX = originalBounds[0][0] - originalBounds[1][0];
    const featX = bounds[0][0] - bounds[1][0];
    const scaleX = fullX / featX;
    // console.log('scaleX', scaleX)
    // console.log('originalBounds', originalBounds)
    setScale(scaleX / 2 > 1 ? scaleX / 2 : 2);
    setCentroid(centroid);
  };

  return (
    <SvgWrapper>
      <AnimatedSvg
        ref={svgRef}
        width={width}
        height={height}
        x={centroid[0]}
        y={centroid[1]}
        scale={scale}
        {...props}
      >
        <pattern id="img1" patternUnits="userSpaceOnUse" width={width} height={width}>
          <image href={earthBG} x="0" y="0" width={width} height={width} />
        </pattern>
        <SvgPathsFromFeature
          projection={projection}
          onPathClick={onFeatureClick}
          topoJSON={topoJSON}
        />
      </AnimatedSvg>
    </SvgWrapper>
  );
};

const YourLoveMapPage = () => {
  const ref = useRef(null);
  const [paths, setPaths] = useState([]);
  const { height, width } = useWindowDimensions();

  const projection = geo.geoConicConformal();

  useEffect(() => {
    // selection.append("path")
    //   .datum(topojson.feature(COUNTRIES, COUNTRIES.objects.countries))
    //   .attr("d", geo.geoPath().projection(projection))
    //   .attr("fill", "transparent")
    //   .attr("stroke", "white")
  }, [height, width]);

  // const onClick = () => {
  //   const selection = d3.select(ref.current);

  //   const child = selection.selectChild("path")
  //   child.remove()
  //   console.log('child', child)
  //   const projection = geo.geoAlbers()
  //     .center([0, 55.4])
  //     .rotate([4.4, 0])
  //     .parallels([50, 60])
  //     .scale(6000)
  //     .translate([width / 2, height / 2]);
  //   selection.append("path")
  //     .datum(topojson.feature(UK, UK.objects.subunits))
  //     .attr("d", geo.geoPath().projection(projection))
  //     .attr("fill", "transparent")
  //     .attr("stroke", "white")
  // }

  const onPathClick = (feature, path) => {
    console.log(feature);
    console.log("path", path);
    const pathFn = geo.geoPath().projection(
      projection.fitExtent(
        [
          [100, 100],
          [width, height],
        ],
        feature
      )
    );

    setPaths(
      paths.map(({ feature: f, path }) => {
        return { path: pathFn(f), feature: f, stroke: feature.id === f.id ? "white" : undefined };
      })
    );
  };

  return (
    <div>
      <GlobalStyle />
      <SvgMap />
    </div>
  );
};

export default YourLoveMapPage;
