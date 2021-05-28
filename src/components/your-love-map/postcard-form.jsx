import React, { useState, useEffect, useRef } from "react";
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
      <TextArea
        required
        rows={4}
        value={note}
        placeholder="write a few words"
        onChange={e => setNote(e.target.value)}
      ></TextArea>
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
