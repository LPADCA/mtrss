import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import Scroller from '../components/scroller'
//import Hero from '../components/hero'
import Layout from '../components/layout'
import Collapse from "@kunukn/react-collapse"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import {Carousel} from '../components/3rdparty/Carousel';

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
]

const RichText = ({jsonRichText}) => {
    return (
      <>
        {documentToReactComponents(jsonRichText,)}
      </>
    )
}

const AlbumArt = ({ link, index }) => {
  return (
    <div className={`AlbumSlide slide${index}`}>
      <div className="PlayButton">
          <a target="_blank" href={link} className="button">
      </a>
      <div className="overlay">
        <i class="fas fa-play fa-2x"></i>
          Listen Now
      </div>
      </div>
    </div>
  )
}


class RootIndex extends React.Component {
  constructor(props) {
    super();
    this.state = { 
      showDescription: false,
      isPlaying: false
    };
  }

  triggerShowDescription = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showDescription: !prevState.showDescription
    }));
    //this.setState({showDescription:true});
  }

  playPause = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying
    }));
    var audioTrack = document.getElementById('audioTrack');
    var method = this.state.isPlaying ? 'pause' : 'play';
    audioTrack[method]();
    //this.setState({showDescription:true});
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const parse_string = this.props.data.contentfulHomepage.youtubeVideoUrl.split('/').pop();
    const youtubeUrl = parse_string.includes('watch?v=') ? parse_string.substr(parse_string.indexOf('=')+1) : parse_string;
    const audioTrack = this.props.data.contentfulHomepage.audioTrack;


    return (
      <Layout location={this.props.location} data={this.props.data}>
          <Helmet title={siteTitle}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
          </Helmet>
          <Carousel slides={ARBUM_DATA.map((props, i) => <AlbumArt key={props.link} index={i + 1} {...props} />).reverse()} autoplay={false} interval={1000}/>
          {/*<div id="mtrss-video-hero" className="video-hero">
            <div className="video-wrapper">
              <div className="iframe-wrapper">
                <iframe id="ytplayer" width="100%" height="100%" src="https://www.youtube.com/embed/ZLSMMfBei18" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>*/}
        

          <div id="mtrss-audio" className="audio">
            <img src="/images/audio.png" alt="MTRSS:Listen"/><br/>
            { audioTrack &&
              <>
                <audio id="audioTrack"
                    src={audioTrack.localFile.publicURL}>
                        Your browser does not support the <code>audio</code> element.
                </audio>
                <a href="#" id="audioControl" onClick={this.playPause}>{!this.state.isPlaying ? <img src="/images/play.svg" width="32" height="32" alt="Play"/> : <img src="/images/pause.svg" width="32" height="32" alt="Pause"/>} </a>
              </>
            }
          </div>
            <Scroller/>
          {/*
          <div id="mtrss-video" className="video">
            <div className="video-wrapper">
              <div className="iframe-wrapper">
                <iframe id="ytplayer" type="text/html" width="100%" height="100%" src={`https://www.youtube.com/embed/`+youtubeUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          </div>*/}
          <div id="mtrss-text" className="context">
            <div className="content">
                <RichText jsonRichText={this.props.data.contentfulHomepage.aboutTextPreview.json}/>
                <RichText jsonRichText={this.props.data.contentfulHomepage.aboutTextExtra.json}/>
            </div>
          </div>

          <div className="press">
            <h2>Press about MTRSS</h2>
            <div className="row">
              <div>
                <a target="_blank" href="https://chloerobinson-32546.medium.com/mtrss-new-lyric-video-displays-scenic-tranquility-4ab5b6af12a3"><img src="/images/logos/medium.svg"/></a>
              </div>
              <div>
                <a target="_blank" href="https://www.ladygunn.com/music/interviews-music/the-alchemists-behind-mtrss/"><img src="/images/logos/ladygunn.svg"/></a>
              </div>
              <div>
                <a target="_blank" href="https://gigsoupmusic.com/pr/mtrss-release-new-single-cali-high/"><img src="/images/logos/gigsoup.svg"/></a>
              </div>
            </div>
            <div className="row">
              <div>
                <a target="_blank" href="https://www.xsnoize.com/premiere-mtrss-cali-high/"><img src="/images/logos/xs.svg"/></a>
              </div>
              <div>
                <a target="_blank" href="https://www.music-news.com/news/Underground/135389/MTRSS-video-premiere-of-Cali-High"><img src="/images/logos/mn.svg"/></a>
              </div>
              <div>
                <a target="_blank" href="https://v13.net/2021/01/art-collective-mtrss-push-musical-boundaries-with-new-single-cali-high-premiere/"><img src="/images/logos/vi3.svg"/></a>
              </div>
            </div>
            <div className="row">
              <div>
                <a target="_blank" href="https://newnoisemagazine.com/video-premiere-mtrss-cali-high/"><img src="/images/logos/newnoise.svg"/></a>
              </div>
            </div>
          </div>

          {/*<div id="spotify">
            <iframe src="https://open.spotify.com/embed/artist/6k4nRFSKe2EQuzMHAtY1gp" width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          </div>*/}
          <div id="mtrss-contacts" className="footer">
            <div>
              <a className="contact-icon facebook" target="_blank" href="https://www.facebook.com/mtrss.art"></a>
              <a className="contact-icon instagram" target="_blank" href="https://www.instagram.com/mtrss.art"></a>
              <a className="contact-icon spotify" target="_blank" href="https://open.spotify.com/artist/6k4nRFSKe2EQuzMHAtY1gp?si=05TzF1roQUqSdPnhDWxWBA"></a>
              <a className="contact-icon bandcamp" target="_blank" href="https://mtrss.bandcamp.com/"></a>
              <a className="contact-icon email" target="_blank" href="mailto:mtrss.art@gmail.com"></a>
            </div>
            <p>&copy; 2020 MTRSS Arts. All Rights Reserved</p>
          </div>

      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
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
`
