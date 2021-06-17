import React, { useEffect } from "react";
import styled from "styled-components";

const TooltipContainer = styled.div`
  margin-top: 20px;
  opacity: ${({ isShown }) => (isShown ? 1 : 0)};
  transition: opacity 0.3s;
  visibility: ${({ isShown }) => (isShown ? "visible" : "hidden")};
  z-index: 10;
`;

const PopupArrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 15px 10px;
  border-color: transparent transparent #ffffff transparent;
`;

const ShareMessageContainer = styled.div`
  margin-top: 15px;
  padding: 6px 8px;
  background: white;
  border-radius: 8px;

  color: #000000;
  p {
    margin: 0;
  }
`;

const CopyText = styled.div`
  margin-top: 20px;
  color: #a1d955;
  width: 100%;
  text-align: center;
  background-color: black;
`;

const InstaTooltip = ({ isShown, setShown, setPopperElement, styles, attributes, setArrowElement }) => {
  useEffect(() => {
    if (isShown) {
      setTimeout(() => setShown(false), 5000);
    }
  }, [isShown]);
  return (
    <TooltipContainer isShown={isShown} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
      <PopupArrow ref={setArrowElement} style={styles.arrow} />
      <ShareMessageContainer>
        <p>Sending love to @ [tag your love]</p>
        <p>________</p>
        <p>#YourLoveMap @mtrss.art @arielfitz.patrick</p>
      </ShareMessageContainer>
      <CopyText>Copied to your clipboard!</CopyText>
    </TooltipContainer>
  );
};

export default InstaTooltip;
