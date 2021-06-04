const generateStats = require("./scripts/parse-stats");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  // actions.printTypeDefinitions({})
  // actions.printTypeDefinitions({});
  const typeDefs = `
  type ContentfulHomepage implements Node {
    merchShopUrl: String
    audioTrack: ContentfulAsset @link(by: "id", from: "audioTrack___NODE")
  }

  type ContentfulAsset implements Node @derivedTypes @dontInfer {
    localFile: File @link(by: "id", from: "localFile___NODE")
  }

  type File implements Node {
    relativePath: String
  }

  `;
  createTypes(typeDefs);
};

exports.onPreBootstrap = () => {
  generateStats();
}
  