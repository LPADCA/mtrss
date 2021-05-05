import React, { useEffect, useState, useRef } from 'react'
import * as d3 from "d3"
import COUNTRIES from "./countries-110m.json"
import UK from "./uk.json"
import * as topojson from "topojson-client"
import * as geo from "d3-geo"
import * as geoProjection from "d3-geo-projection"
import earthUrl from "./Earth.png";
import { createGlobalStyle } from "styled-components"
import useWindowDimensions from "../hooks/useWindowDimensions"

const MapPath = () => {
  return <path stroke="black" fill="none" d="${draw(d3.path())}" />
}

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
`

const YourLoveMapPage = () => {
  console.log('d3', d3, geoProjection)
  const ref = useRef(null);
  const [paths, setPaths] = useState([]);
  const { height, width } = useWindowDimensions();

  const projection = geo.geoNaturalEarth1()

  useEffect(() => {
    setPaths(topojson
      .feature(COUNTRIES, COUNTRIES.objects.countries)
      .features.map((feature) => {
        const path = geo.geoPath().projection(projection);
        return { feature, path: path(feature) }
      }));
  }, [])

  useEffect(() => {
    projection.fitExtent([[0, 0], [width, height]], topojson
      .feature(COUNTRIES, COUNTRIES.objects.countries))

    const selection = d3.select(ref.current);

    // selection.append("path")
    //   .datum(topojson.feature(COUNTRIES, COUNTRIES.objects.countries))
    //   .attr("d", geo.geoPath().projection(projection))
    //   .attr("fill", "transparent")
    //   .attr("stroke", "white")
  }, [height, width])

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
    console.log(feature )
    console.log('path', path)
    const pathFn = geo.geoPath().projection(
      projection.fitExtent([[100, 100], [width, height]], feature)
    );

    setPaths(paths.map(({ feature: f, path }) => {
      
      return { path: pathFn(f), feature: f, stroke: feature.id === f.id  ? "white" : undefined }
    }))
  }

  return (
    <div>
      <GlobalStyle />
      <svg  className="map" ref={ref} width={width} height={height}>
        {paths.map(({ feature, path, stroke }) => {

          return <path d={path} key={path} stroke={stroke} onClick={() => onPathClick(feature, path)} />
        })}
      </svg>
    </div>
  );
}

export default YourLoveMapPage