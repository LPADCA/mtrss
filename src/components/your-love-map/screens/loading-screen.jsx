import React from "react";
import styled from "styled-components";
import Button from "../../button";
import { mediaQueries } from "../../../screenSizes";

const LoadingScreenContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 1);
  padding: 20px;
  height: 100%;
`;

const InfoText = styled.span`
  font-size: 24px;
  margin-top: 40px;
  margin-bottom: 50px;
  text-align: center;

  @media ${mediaQueries.xs} {
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

  @media ${mediaQueries.xs} {
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

  @media ${mediaQueries.xs} {
    flex-direction: row;
    margin-bottom: 20px;
    width: 100%;
  }
`;

const StepNumber = styled.span`
  font-size: 50px;
  text-align: center;

  @media ${mediaQueries.xs} {
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
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1 1 auto;

  @media ${mediaQueries.xs} {
    padding: 10px;
    font-size: 14px;
  }
`;
const LoadingScreen = ({ loading, onStart }) => {
  return (
    <LoadingScreenContainer>
      <InfoText>
        Some of us have been very far from their loved ones this year.
        <p>
          <a>Let the love bring you closer.</a>
        </p>
      </InfoText>
      <Steps>
        <StepContainer>
          <StepNumber>01</StepNumber>
          <CardContainer>
            <span>
              Join thousands of listeners of <a>#YourLove</a> around the world
            </span>
          </CardContainer>
        </StepContainer>
        <StepContainer>
          <StepNumber>02</StepNumber>
          <CardContainer>
            <span>
              Share your love though a postcard. <a>Click on a country</a> where Your Love is at the moment
              and select your love note in the form below. Add your names to make it personal.
            </span>
          </CardContainer>
        </StepContainer>
        <StepContainer>
          <StepNumber>03</StepNumber>
          <CardContainer>
            <span>
              Voila. Your custom love note is ready for you to share on social. Don’t forget to mention
              <a> @mtrss.art @arielfitz.patrick #YourLoveNote</a>
            </span>
          </CardContainer>
        </StepContainer>
      </Steps>
      <Button
        loading={loading}
        css={`
          margin-top: 20px;
          width: 200px;
        `}
        onClick={onStart}
      >
        Open Map
      </Button>
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;
