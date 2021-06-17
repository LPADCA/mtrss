import React, { Children } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styled from "styled-components";
import { mediaQueries } from "../../screenSizes";

const NavigationWrapper = styled.div`
  position: relative;
`;

const Dots = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 10px 0;
  justify-content: center;
`;

const Dot = styled.button`
  border: none;
  width: 5px;
  height: 5px;
  background: ${({ active }) => (active ? "#FF5C5C" : "#c5c5c5")};
  border-radius: 50%;
  margin: 0 2.5px;
  padding: 2.5px;
  cursor: pointer;
`;

const Slide = styled.div``;

const ArrowSvg = styled.svg`
  width: 60px;
  padding: 0 15px;
  height: 246px;
  position: absolute;
  top: 0;
  fill: #fff;
  cursor: pointer;

  &:hover {
    fill: #ff3636;
  }
`;

const LeftArrowSvg = styled(ArrowSvg)`
  left: -60px;
`;

const RightArrowSvg = styled(ArrowSvg)`
  right: -60px;
`;

const ArrowLeft = props => {
  return (
    <LeftArrowSvg onClick={props.onClick} xmlns="http://www.w3.org/2000/ArrowSvg" viewBox="0 0 24 24">
      <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
    </LeftArrowSvg>
  );
};

const ArrowRight = props => {
  return (
    <RightArrowSvg onClick={props.onClick} xmlns="http://www.w3.org/2000/ArrowSvg" viewBox="0 0 24 24">
      <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
    </RightArrowSvg>
  );
};

export default function Carousel({ children }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, slider] = useKeenSlider({
    slidesPerView: 3,
    mode: "free-snap",
    spacing: 15,
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
    breakpoints: {
      [mediaQueries.xs]: {
        slidesPerView: 1,
      },
    },
  });

  return (
    <NavigationWrapper>
      <div ref={sliderRef} className="keen-slider">
        {Children.toArray(children).map(c => {
          return (
            <Slide key={c.key} className="keen-slider__slide">
              {c}
            </Slide>
          );
        })}
      </div>
      {slider && (
        <Dots>
          {[...Array(slider.details().size).keys()].map(idx => {
            return (
              <Dot
                key={idx}
                type="button"
                onClick={() => slider.moveToSlideRelative(idx)}
                active={currentSlide === idx}
              />
            );
          })}
          <ArrowLeft onClick={e => e.stopPropagation() || slider.prev()} disabled={currentSlide === 0} />
          <ArrowRight
            onClick={e => e.stopPropagation() || slider.next()}
            disabled={currentSlide === slider.details().size - 1}
          />
        </Dots>
      )}
    </NavigationWrapper>
  );
}
