/* eslint-disable node/no-path-concat */

require("dotenv").config({
  path: `.env.production`,
});

const contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  downloadLocal: true,
};

// if you want to use the preview API please define
// CONTENTFUL_HOST in your environment config
// the `host` property should map to `preview.contentful.com`
// https://www.contentful.com/developers/docs/references/content-preview-api/#/reference/spaces/space/get-a-space/console/js
if (process.env.CONTENTFUL_HOST) {
  contentfulConfig.host = process.env.CONTENTFUL_HOST;
}

const { spaceId, accessToken } = contentfulConfig;

if (!spaceId || !accessToken) {
  throw new Error("Contentful spaceId and the access token need to be provided.");
}

module.exports = {
  siteMetadata: {
    title: "MTRSS",
  },
  pathPrefix: "/gatsby-contentful-starter",
  proxy: {
    prefix: "/api",
    url: "http://localhost:8080",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `MTRSS`,
        short_name: `MTRSS`,
        start_url: `/`,
        background_color: `#0d0c0c`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `favicon.png`, // This path is relative to the root of the site.
      },
    },
    "gatsby-transformer-remark",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
          },
        },
      },
    },
    {
      resolve: "gatsby-plugin-svgr",
      options: {
        svgo: true,
        svgoConfig: {
          removeViewBox: false, // remove viewBox when possible (default)
        },
      },
    },
    {
      resolve: "gatsby-source-contentful",
      options: contentfulConfig,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
  ],
};
