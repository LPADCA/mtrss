import React, { useState } from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import Scroller from "../components/scroller";
import Layout from "../components/layout";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Carousel } from "../components/3rdparty/Carousel";
import Footer from "../components/footer";
import { GatsbyImage } from "gatsby-plugin-image";
import styled from "styled-components";
import shopBgRetina from "../assets/images/shop-bg.jpg";
import { useSpring, animated } from "@react-spring/web";

const ARBUM_DATA = [
  { link: "https://ffm.to/yvqm2de" },
  { link: "https://ffm.to/yeqvjb1" },
  { link: "https://ffm.to/qmyoqj7" },
  { link: "https://ffm.to/9webja4" },
  { link: "https://ffm.to/kdwjob8" },
  { link: "https://ffm.to/l19dpoe" },
  { link: "https://ffm.to/g7dyodo" },
  { link: "https://ffm.to/dearmbp" },
  { link: "https://dashgo.co/mvamlrm" },
  { link: "https://sym.ffm.to/mtrss-your-love" },
];

const ShopBackground = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${shopBgRetina});
  background-size: 100%;
  background-position: center;
`;

const ShopStorefromContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ShopTitle = styled.h3`
  text-align: center;
  margin: 0;
  padding-top: 44px;
  padding-bottom: 12px;
  font-weight: 500;
  font-size: 24px;

  ::after {
    position: relative;
    left: calc(50% - 30px);
    content: " ";
    display: block;
    background: linear-gradient(274deg, #bc0012, #1350e0);
    width: 60px;
    height: 4px;
    margin-top: 12px;
  }
`;

const ShopItemContainer = styled.div`
  min-width: 240px;
  max-width: 400px;
  flex: 1 1;
`;

const ShopButton = styled(animated.a)`
  border-style: solid;
  border-image-slice: 1;
  border-width: 5px;
  border-image-source: linear-gradient(256deg, #1350e0, #90000e);
  width: 170px;
  height: 45px;
  display: block;
  margin-top: 40px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 500;
  font-size: 18px;
`;

const MerchItem = ({ item }) => {
  return (
    <ShopItemContainer>
      <GatsbyImage image={item.featuredImage.gatsbyImageData} alt={item.featuredImage.altText} />
    </ShopItemContainer>
  );
};

const MerchStorefront = ({ edges }) => {
  return (
    <ShopStorefromContainer>
      {edges.map(({ node }) => (
        <MerchItem key={node.shopifyId} item={node} />
      ))}
    </ShopStorefromContainer>
  );
};

const ShopSection = ({ allShopifyProduct }) => {
  const [toggle, setToggle] = useState(false);
  const styles = useSpring({
    background: toggle
      ? "linear-gradient(256deg, #1350e0, #90000e)"
      : "linear-gradient(256deg, transparent, transparent)",
  });
  return (
    <ShopBackground>
      <ShopTitle>Shop #YourLove collection</ShopTitle>
      <MerchStorefront edges={allShopifyProduct.edges} />
      <ShopButton
        style={styles}
        onMouseOver={() => setToggle(true)}
        onMouseLeave={() => setToggle(false)}
        href="https://shop.mtrss.art/"
      >
        Shop now
      </ShopButton>
    </ShopBackground>
  );
};

const RichText = ({ jsonRichText }) => {
  return <>{documentToReactComponents(jsonRichText)}</>;
};

const AlbumArt = ({ link, index }) => {
  return (
    <div className={`AlbumSlide slide${index}`}>
      <div className="PlayButton">
        <a target="_blank" href={link} className="button"></a>
        <div className="overlay">
          <i className="fas fa-play fa-2x"></i>
          Listen Now
        </div>
      </div>
    </div>
  );
};

class RootIndex extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showDescription: false,
      isPlaying: false,
    };
  }

  triggerShowDescription = e => {
    e.preventDefault();
    this.setState(prevState => ({
      showDescription: !prevState.showDescription,
    }));
    // this.setState({showDescription:true});
  };

  playPause = e => {
    e.preventDefault();
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying,
    }));
    var audioTrack = document.getElementById("audioTrack");
    var method = this.state.isPlaying ? "pause" : "play";
    audioTrack[method]();
    // this.setState({showDescription:true});
  };

  render() {
    const audioTrack = this.props.data.contentfulHomepage.audioTrack;

    return (
      <Layout location={this.props.location} data={this.props.data}>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <Carousel
          slides={ARBUM_DATA.map((props, i) => (
            <AlbumArt key={props.link} index={i + 1} {...props} />
          )).reverse()}
          autoplay={false}
          interval={1000}
        />
        <ShopSection allShopifyProduct={this.props.data.allShopifyProduct} />
        <div id="mtrss-audio" className="audio">
          <img src="/images/audio.png" alt="MTRSS:Listen" />
          <br />
          {audioTrack && (
            <>
              <audio id="audioTrack" src={audioTrack.localFile.publicURL}>
                Your browser does not support the <code>audio</code> element.
              </audio>
              <a href="#" id="audioControl" onClick={this.playPause}>
                {!this.state.isPlaying ? (
                  <img src="/images/play.svg" width="32" height="32" alt="Play" />
                ) : (
                  <img src="/images/pause.svg" width="32" height="32" alt="Pause" />
                )}{" "}
              </a>
            </>
          )}
        </div>
        <Scroller />
        {/*
          <div id="mtrss-video" className="video">
            <div className="video-wrapper">
              <div className="iframe-wrapper">
                <iframe id="ytplayer" type="text/html" width="100%" height="100%" src={`https://www.youtube.com/embed/`+youtubeUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          </div> */}
        <div id="mtrss-text" className="context">
          <div className="content">
            <RichText jsonRichText={this.props.data.contentfulHomepage.aboutTextPreview.json} />
            <RichText jsonRichText={this.props.data.contentfulHomepage.aboutTextExtra.json} />
          </div>
        </div>

        <div className="press">
          <h2>Press about MTRSS</h2>
          <div className="row">
            <div>
              <a
                target="_blank"
                href="https://chloerobinson-32546.medium.com/mtrss-new-lyric-video-displays-scenic-tranquility-4ab5b6af12a3"
              >
                <img src="/images/logos/medium.svg" />
              </a>
            </div>
            <div>
              <a
                target="_blank"
                href="https://www.ladygunn.com/music/interviews-music/the-alchemists-behind-mtrss/"
              >
                <img src="/images/logos/ladygunn.svg" />
              </a>
            </div>
            <div>
              <a target="_blank" href="https://gigsoupmusic.com/pr/mtrss-release-new-single-cali-high/">
                <img src="/images/logos/gigsoup.svg" />
              </a>
            </div>
          </div>
          <div className="row">
            <div>
              <a target="_blank" href="https://www.xsnoize.com/premiere-mtrss-cali-high/">
                <img src="/images/logos/xs.svg" />
              </a>
            </div>
            <div>
              <a
                target="_blank"
                href="https://www.music-news.com/news/Underground/135389/MTRSS-video-premiere-of-Cali-High"
              >
                <img src="/images/logos/mn.svg" />
              </a>
            </div>
            <div>
              <a
                target="_blank"
                href="https://v13.net/2021/01/art-collective-mtrss-push-musical-boundaries-with-new-single-cali-high-premiere/"
              >
                <img src="/images/logos/vi3.svg" />
              </a>
            </div>
          </div>
          <div className="row">
            <div>
              <a target="_blank" href="https://newnoisemagazine.com/video-premiere-mtrss-cali-high/">
                <img src="/images/logos/newnoise.svg" />
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }
}

export default RootIndex;

export const pageQuery = graphql`
  query HomeQuery {
    allShopifyProduct(sort: { fields: [title] }, filter: { tags: { eq: "Shopfront" } }) {
      edges {
        node {
          title
          images {
            originalSrc
          }
          shopifyId
          description
          tags
          featuredImage {
            id
            altText
            gatsbyImageData(width: 910, height: 910)
          }
        }
      }
    }
    contentfulHomepage {
      buttonText
      buttonUrl
      audioTrack {
        localFile {
          publicURL
        }
      }
      merchShopUrl
      youtubeVideoUrl
      aboutTextExtra {
        json
      }
      aboutTextPreview {
        json
      }
      pageTitle
    }
  }
`;
