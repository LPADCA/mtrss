import LISTENERS_STATS from "../../assets/stats.json";
import * as scale from "d3-scale";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world3.topo.json";
import * as topojson from "topojson-client";
import * as geo from "d3-geo";

export const BG_IMAGE_WIDTH = 2660;
export const BG_IMAGE_HEIGHT = 1484;
export const BG_IMAGE_RATIO = BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;
export const MIN_WIDTH = 1100;
export const TOPO_COUNTRIES = {
  ...topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.world),
  properties: { continent: "World" },
};
export const projection = geo.geoEqualEarth();
export const pathGenerator = geo.geoPath().projection(projection);

export const MIN_VALUE = Math.min(...LISTENERS_STATS.map(s => s.value));
export const MAX_VALUE = Math.max(...LISTENERS_STATS.map(s => s.value));
export const MIN_RADIUS = 5;
export const MAX_RADIUS = 40;
export const MIN_OPACITY = 0.6;
export const MAX_OPACITY = 0.4;

export const getRadius = scale.scaleSqrt().domain([MIN_VALUE, MAX_VALUE]).range([MIN_RADIUS, MAX_RADIUS]);
export const getOpacity = scale.scaleSqrt().domain([MIN_VALUE, MAX_VALUE]).range([MIN_OPACITY, MAX_OPACITY]);