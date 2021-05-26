import React, { useState } from "react";
import styled from "styled-components";
import WORLD_TOPO_JSON from "../../assets/geoJsons/world2.topo.json";

const Form = styled.form`
  margin: 0 auto;
  width: 600px;
`;

const TextArea = styled.textarea`
  width: 100%;
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
      <p>
        Sending love to{" "}
        <input required placeholder="your love" value={name} onChange={e => setName(e.target.value)} /> in{" "}
        <select required placeholder="country" value={country} onChange={e => setCountry(e.target.value)}>
          <option value="" disabled hidden>
            country
          </option>
          {COUNTRIES.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <TextArea required rows={6} value={note} onChange={e => setNote(e.target.value)}></TextArea>
      </p>
      <p>
        Sincerely yours,{" "}
        <input required placeholder="" value={from} onChange={e => setFrom(e.target.value)} />
      </p>
      <button>Create Postcard</button>
    </Form>
  );
};

export default PostCardForm;
