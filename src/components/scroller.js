import React from 'react'
import ReactPlayer from 'react-player';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: { 
    breakpoint: { max: 500, min: 0 },
    items: 1
  }
};


const Scroller = () => {


  const YoutubeSlide = ({ url, isSelected }) => (
    <ReactPlayer width="100%" url={url} playing={isSelected} />
  );


  return (
    <>
      <h3 
        style={{
          textAlign: 'center',
          marginBottom: 0,
          marginTop: '50px'
        }}>Videos</h3>
      <Carousel
        draggable={true}
        showDots={false}
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        keyBoardControl={true}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        <YoutubeSlide key="youtube-1" url="https://www.youtube.com/embed/SZzd_Vt_eXQ" />
        <YoutubeSlide key="youtube-2" url="https://www.youtube.com/embed/ZLSMMfBei18" />
        <YoutubeSlide key="youtube-3" url="https://www.youtube.com/embed/bClwEwAdfMM" />
        <YoutubeSlide key="youtube-4" url="https://www.youtube.com/embed/-hxCYIFnCYU" />
        <YoutubeSlide key="youtube-5" url="https://www.youtube.com/embed/dGJ-GD7M9lA" />
        <YoutubeSlide key="youtube-6" url="https://www.youtube.com/embed/ZLSMMfBei18" />
      </Carousel>
    </>
  )
}

export default Scroller

