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

{
  /*
module.exports.onPreInit = () => {
  const carouselSrcFile =
    'node_modules/3d-react-carousal/dist/index.js';

  if (!fs.existsSync(carouselSrcFile)) return;

  fs.writeFileSync(
    carouselSrcFile,
    fs
      .readFileSync(carouselSrcFile, 'utf8')
      .replace('(window,', `(typeof window==='undefined'?{}:window,`)
  );
}; */
}

{
  /*

    audioTrack: AudioTrack 
  }
  type AudioTrack {
    localFile: LocalFile
  }
  type LocalFile {
    publicURL: String
  }

    {
      localFile {
        publicURL

    audioTrack: AudioTrackMTRSS! 
  }
  type AudioTrackMTRSS {
    localFile: LocalFileMTRSS!
  }
  type LocalFileMTRSS {
    publicURL: String
  }


  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allContentfulBlogPost.edges
        posts.forEach(post => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPost,
            context: {
              slug: post.node.slug,
            },
          })
        })
      })
    )
  }) */
}
