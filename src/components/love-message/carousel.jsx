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
        </Dots>
      )}
    </NavigationWrapper>
  );
}
