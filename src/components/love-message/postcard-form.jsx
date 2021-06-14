import React, { useState, forwardRef } from "react";
import styled, { css } from "styled-components";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world3.topo.json";
import Button from "../button";
import arrowUrl from "../../assets/icons/arrow.svg";
import Carousel from "./carousel.jsx";
import songBgUrl1 from "../../assets/images/song-bg1@2x.jpg";
import songBgUrl2 from "../../assets/images/song-bg2@2x.jpg";
import songBgUrl3 from "../../assets/images/song-bg3@2x.jpg";
import { mediaQueries } from "../../screenSizes";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";

const inputMixin = css`
  flex: 1 0 auto;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 20px;
  vertical-align: middle;

  &::placeholder {
    color: #ff3636;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media ${mediaQueries.xs} {
    padding: 5px;
  }
`;

const Form = styled.form`
  margin: 50px auto;
  padding: 60px;
  width: 100%;
  max-width: 992px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;

  @media ${mediaQueries.xs} {
    padding: 20px;
  }
`;

const Line = styled.span`
  display: inline-flex;
  width: 100%;

  @media ${mediaQueries.xs} {
    input {
      margin: 0;
    }
  }
`;

const LineColumn = styled.div`
  @media ${mediaQueries.xs} {
    width: 100%;
  }
  width: 50%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  input {
    width: 50%;
    margin-left: 20px;
    margin-right: 20px;

    @media ${mediaQueries.xs} {
      margin-left: 10px;
      margin-right: 0;
    }
  }
`;

const FirstLine = styled(Line)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SecondLine = styled(Line)`
  margin: 20px 0;
  justify-content: center;
  align-items: center;
`;

const ThirdLine = styled(Line)`
  justify-content: center;
  margin-bottom: 20px;
  button {
    width: 600px;
  }
`;

const FourthLine = styled(Line)`
  justify-content: center;
  button {
    width: 600px;

    svg {
      margin-right: 10px;
    }
  }
`;

const Input = styled.input`
  ${inputMixin}
  margin: 0 20px;
  color: white;
`;

const Select = styled.select`
  ${inputMixin}
  color: white;
  max-width: 100%;
  appearance: none;
  position: relative;
  background-image: url("${arrowUrl}");
  background-size: 16px;
  background-repeat: no-repeat;
  background-position-x: calc(100% - 15px);
  background-position-y: 50%;

  &:invalid,
  & option[value=""] {
    color: #ff3636;
  }
`;

const CountrySelect = styled(Select)`
  margin-left: 20px;
`;

const CarouselTitle = styled.p`
  text-align: center;
  margin-top: 0;
`;

const SecondWrapper = styled.div`
  @media ${mediaQueries.xs} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  span {
    margin-bottom: 20px;
  }
`;

const getBg = i => {
  if (i % 3 === 0) return songBgUrl1;
  if (i % 3 === 1) return songBgUrl2;
  if (i % 3 === 2) return songBgUrl3;
};

const Song = styled.div`
  height: 100%;
  background-image: url(${({ index }) => getBg(index)});
  border-radius: 30px;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 3px;

  label {
    border-radius: 30px;
    border: 3px solid #ffffff;
    height: 100%;
    display: flex;

    padding: 20px 30px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  input {
    position: absolute;
    visibility: hidden;
  }

  input:checked + label {
    border: 3px solid red;
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const COUNTRIES = [...new Set(WORLD_TOPO_JSON.objects.world.geometries.map(e => e.properties.name))].sort(
  (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
);

const NOTES = [
  `“Nothing can separate me from your love” 
 - Ariel Fitz-Patrick, ‘Your Love’`,
  `“When I am with you there’s no place I’d rather be.”
 - Clean Bandit, Rather be`,
  `“How wonderful life is while you’re in the world.”
 - Elton John, ‘Your Song’`,
  `“You’re the only one that I want. Think I’m addicted to your light.”
 - Beyoncé, ‘Halo’`,
  `“Cause all of me loves all of you.”
 - John Legend, ‘All of Me’`,
  `“My world is a better place because of you.”
 - Celine Dion, ‘Because You Loved Me’`,
  `“My heart’s been borrowed and yours has been blue; all’s well that ends well to end up with you.”
 - Taylor Swift, ‘Lover’`,
  `“But I won’t hesitate no more. No more it cannot wait, I’m yours”
 - Jason Mraz, ‘I’m Yours’`,
  `“I’m so in love with you and I hope you know”
 - James Arthur ‘Say You Won’t Let Go’`,
  `“Darling, I will be loving you till we’re seventy”
 - Ed Sheeran, ‘Thinking Out Loud’`,
  ` “I fall in love with you every single day”
 - Ed Sheeran, ‘Perfect’`,
  ` “I just wanna be part of your symphony”
 - Clean Bandit, ‘Symphony’`,
  `"I just wanna lay my head on your chest, So I'm close as it gets to your heart"
- Lil Peep, ‘we think too much’`,
  `“However far away, I will always love you”
 - The Cure, ‘Lovesong’`,
  ` “You’re my passport home, without you close I can’t go on”
 - JP Cooper, ‘Passport Home’`,
  ` “I like me better when I’m with you”
 - Lauv, ‘I Like Me Better’`,
  ` “I’d spend every hour of every day keeping you safe”
 - Calum Scott, ‘You Are the Reason’`,
  ` “You could put an ocean between our love, it won’t keep us apart”
 - Martin Garrix (feat. Khalid), ‘Ocean’`,
  `“If life is a movie, oh, you’re the best part”
 - Daniel Caesar (feat. H.E.R.), ‘Best Part’`,
  ` “Your love is better than ice cream.”
 - Sarah McLachlan, ‘Ice Cream’`,
  ` “Everything means nothing if I ain’t got you”
 - Alicia Keys, ‘If I ain’t got you’`,
  ` “If the world was ending you’d come over, right?”
 - JP Saxe & Julia Michaels, ‘If the World Was Ending’`,
];

const PostCardForm = forwardRef(({ onSubmit, onBackClick, country, setCountry }, ref) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState(NOTES[0]);
  const [from, setFrom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    onSubmit({ name, country, note, from });
  };

  return (
    <FormContainer>
      <Form ref={ref} onSubmit={handleSubmit}>
        <FirstLine>
          <LineColumn>
            <span>Sending love to </span>
            <Input
              required
              placeholder="your love’s name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </LineColumn>
          <LineColumn>
            <span> in </span>
            <CountrySelect required value={country} onChange={e => setCountry(e.target.value)}>
              <option value="" disabled hidden>
                Country
              </option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </CountrySelect>
          </LineColumn>
        </FirstLine>
        <CarouselTitle>Select your love note</CarouselTitle>
        <Carousel>
          {NOTES.map((n, i) => {
            return (
              <Song index={i} key={n}>
                <input
                  id={`song-${i}`}
                  required
                  name="song"
                  type="radio"
                  value={n}
                  checked={n === note}
                  onChange={() => setNote(n)}
                />
                <label htmlFor={`song-${i}`}>{n}</label>
              </Song>
            );
          })}
        </Carousel>
        <SecondLine>
          <SecondWrapper>
            <span>Sincerely yours, </span>
            <Input required placeholder="your name" value={from} onChange={e => setFrom(e.target.value)} />
          </SecondWrapper>
        </SecondLine>
        <ThirdLine>
          <Button loading={loading}>{!loading ? "Generate Postcard" : "Generating your postcard…"}</Button>
        </ThirdLine>
        <FourthLine>
          <Button type="button" onClick={onBackClick} theme="outline">
            <ArrowLeft width={10} /> Back to the map
          </Button>
        </FourthLine>
      </Form>
    </FormContainer>
  );
});

PostCardForm.displayName = "PostCardForm";

export default PostCardForm;
