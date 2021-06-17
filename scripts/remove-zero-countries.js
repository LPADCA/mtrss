const topojson = require("topojson-client");
const geo = require("d3-geo");
const WORLD_TOPO_JSON = require("../src/assets/geoJsons/world.topo.json");

const TOPO_COUNTRIES = topojson.feature(WORLD_TOPO_JSON, WORLD_TOPO_JSON.objects.world);

const projection = geo.geoEqualEarth();
const pathGenerator = geo.geoPath().projection(projection);

const newFeatures = TOPO_COUNTRIES.features.filter(feature => {
  return pathGenerator.area(feature) !== 0;
});

console.log(
  JSON.stringify(
    {
      type: "FeatureCollection",
      features: newFeatures,
    },
    null,
    4
  )
);
