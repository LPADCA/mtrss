import React from "react";
import styled from "styled-components";
import { ReactComponent as InfoIcon } from "../../../assets/icons/info.svg";
import Button from "../../button";
import { mediaQueries } from "../../../screenSizes";

const LoadingScreenContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 1);
  padding: 20px;
`;

const InfoText = styled.p`
  font-size: 24px;
  margin-top: 40px;
  margin-bottom: 50px;
  text-align: center;

  @media ${mediaQueries.xm} {
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 25px;
  }
`;

const Steps = styled.div`
  display: flex;

  @media ${mediaQueries.sm} {
    margin-left: -10px;
    margin-right: -10px;
  }

  @media ${mediaQueries.xm} {
    flex-direction: column;
  }
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media ${mediaQueries.sm} {
    margin: 0 10px;
  }

  @media ${mediaQueries.xm} {
    flex-direction: row;
    margin-bottom: 20px;
    width: 100%;
  }
`;

const StepNumber = styled.span`
  font-size: 50px;
  text-align: center;

  @media ${mediaQueries.xm} {
    font-size: 24px;
    margin-right: 10px;
    width: 50px;
  }
`;

const CardContainer = styled.div`
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgb(255, 255, 255, 0.5);
  padding: 20px;
  max-width: 340px;
  text-align: center;
  flex: 1 1 auto;

  @media ${mediaQueries.xm} {

    padding: 10px;
    font-size: 14px;
  }
`;
const LoadingScreen = ({ disabled, onStart }) => {
  return (
    <LoadingScreenContainer>
      <InfoIcon />
      <InfoText>
        We’ve all been too far away from our loved ones this year. Let the love bring you closer.
      </InfoText>
      <Steps>
        <StepContainer>
          <StepNumber>01</StepNumber>
          <CardContainer>
            Join thousands of listeners of <a>#YourLove</a> around the world
          </CardContainer>
        </StepContainer>
        <StepContainer>
          <StepNumber>02</StepNumber>
          <CardContainer>
            Share your love though a postcard. <a>Click on a country</a> where Your Love is at the moment and
            select your love note in the form below. Add your names to make it personal.
          </CardContainer>
        </StepContainer>
        <StepContainer>
          <StepNumber>03</StepNumber>
          <CardContainer>
            Voila. Your custom love note is ready for you to share on social. Don’t forget to mention
            <a>@mtrss.art @arielfitz.patrick #YourLoveNote</a>
          </CardContainer>
        </StepContainer>
      </Steps>
      <Button
        css={`
          margin-top: 20px;
          width: 200px;
        `}
        disabled={disabled}
        onClick={onStart}
      >
        Let's go
      </Button>
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;
