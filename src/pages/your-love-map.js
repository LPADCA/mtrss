import React, { useState, useRef } from "react";
import SvgMap from "../components/your-love-map";
import PostCardForm from "../components/your-love-map/postcard-form";
import { navigate } from "gatsby";
import { createPostcardRequest } from "../api/love-message-api";
import LoveLayout from "../components/your-love-map/love-layout";

const openPostcard = async args => {
  const { url } = await createPostcardRequest(args);
  navigate("/love-message/" + url);
};

const YourLoveMapPage = () => {
  const ref = useRef();
  const [country, setCountry] = useState("");

  const onCountryClick = country => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setCountry(country);
  };

  return (
    <LoveLayout>
      <SvgMap country={country} onCountryClick={onCountryClick} />
      <PostCardForm ref={ref} country={country} setCountry={setCountry} onSubmit={openPostcard} />
    </LoveLayout>
  );
};

export default YourLoveMapPage;
