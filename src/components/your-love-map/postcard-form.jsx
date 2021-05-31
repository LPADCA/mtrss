import React, { useState } from "react";
import styled, { css } from "styled-components";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world2.topo.json";
import Button from "../button";

const inputMixin = css`
  flex: 1 0 auto;
  background: none;
  border: none;
  font-size: 16px;
  border-bottom: 2px solid #ff3636;
  padding: 3px 5px 5px;

  &::placeholder {
    color: #ff3636;
  }
`;

const Form = styled.form`
  margin: 50px auto;
  width: 100%;
  max-width: 600px;
`;

const TextArea = styled.textarea`
  ${inputMixin}
  width: 100%;
  resize: none;
  color: white;
  caret-color: white;
`;

const Line = styled.span`
  display: inline-flex;
  width: 100%;
  margin-bottom: 20px;
`;

const SecondLine = styled(Line)`
  margin-top: 20px;
  justify-content: flex-end;
  align-items: center;
`;

const Input = styled.input`
  ${inputMixin}
  margin: 0 5px;
  color: white;
`;

const Select = styled.select`
  ${inputMixin}
  margin-left: 5px;
  color: white;

  &:invalid,
  & option[value=""] {
    color: #ff3636;
  }
`;

const COUNTRIES = [...new Set(WORLD_TOPO_JSON.objects.world.geometries.map(e => e.properties.NAME))].sort(
  (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
);

const NOTES = [
  `“When I am with you there’s no place I’d rather be.”
 - Clean Bandit - Rather be`,
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
  `“However far away, I will always loving you”
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

const PostCardForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ name, country, note, from });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Line>
        Sending love to{" "}
        <Input required placeholder="your love" value={name} onChange={e => setName(e.target.value)} /> in{" "}
        <Select required value={country} onChange={e => setCountry(e.target.value)}>
          <option value="" disabled hidden>
            Country
          </option>
          {COUNTRIES.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
      </Line>
      <Select required value={country} onChange={e => setNote(e.target.value)}>
        {NOTES.map(note => {
          return (
            <option key={note} value={note}>
              {note}
            </option>
          );
        })}
      </Select>

      <SecondLine>
        <div>
          Sincerely yours,{" "}
          <Input required placeholder="" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
      </SecondLine>
      <Button>Create Postcard</Button>
    </Form>
  );
};

export default PostCardForm;
