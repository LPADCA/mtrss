import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import Hero from '../components/hero'
import Layout from '../components/layout'
import Collapse from "@kunukn/react-collapse"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

const RichText = ({jsonRichText}) => {
    return (
      <>
        {documentToReactComponents(jsonRichText,)}
      </>
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
    console.log(method);
    console.log(audioTrack);
    audioTrack[method]();
    //this.setState({showDescription:true});
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const buttonText = this.props.data.contentfulHomepage.buttonText;
    const buttonUrl = this.props.data.contentfulHomepage.buttonUrl;
    const parse_string = this.props.data.contentfulHomepage.youtubeVideoUrl.split('/').pop();
    const youtubeUrl = parse_string.includes('watch?v=') ? parse_string.substr(parse_string.indexOf('=')+1) : parse_string;

    return (
      <Layout location={this.props.location}>
          <Helmet title={siteTitle} />
          <Hero buttonText={buttonText} buttonURL={buttonUrl}/>


          <div id="mtrss-audio" className="audio">
            <img src="/images/audio.png" alt="MTRSS:Listen"/><br/>
            <audio id="audioTrack"
                src="/files/demo.mp3">
                    Your browser does not support the <code>audio</code> element.
            </audio>
            <a href="#" id="audioControl" onClick={this.playPause}>{!this.state.isPlaying ? <img src="/images/play.svg" width="32" height="32" alt="Play"/> : <img src="/images/pause.svg" width="32" height="32" alt="Pause"/>} </a>
          </div>
          <div id="mtrss-video" className="video">
            <div className="video-wrapper">
              <div className="iframe-wrapper">
                <iframe id="ytplayer" type="text/html" width="100%" height="100%" src={`https://www.youtube.com/embed/`+youtubeUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          </div>
          <div id="mtrss-text" className="context">
            <div className="content">
              <img src="/images/mtrss-content.jpg" width="500" height="115" alt="MTRSS"/><br/>
                <RichText jsonRichText={this.props.data.contentfulHomepage.aboutTextPreview.json}/>
              <Collapse isOpen={this.state.showDescription}>
                <RichText jsonRichText={this.props.data.contentfulHomepage.aboutTextExtra.json}/>
              </Collapse>
              {!this.state.showDescription && <a href="#" onClick={this.triggerShowDescription} className="button">View more</a>}
            </div>
          </div>
          <div id="mtrss-contacts" className="footer">
            <p>
              <a href="https://www.facebook.com/mtrss.art"><img className="contact-icon" src="/images/contact-icon-01.svg" width="30" height="30" alt="facebook"/></a>
              <a href="https://www.instagram.com/mtrss.art"><img className="contact-icon" src="/images/contact-icon-02.svg" width="30" height="30" alt="instagram"/></a>
              <a href="#"><img className="contact-icon" src="/images/contact-icon-03.svg" width="30" height="30" alt="bandcamp"/></a>
              <a href="mailto:mtrss.art@gmail.com"><img className="contact-icon" src="/images/contact-icon-04.svg" width="30" height="30" alt="email"/></a>
            </p>
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
