import React, { useState } from "react";
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
  const [country, setCountry] = useState("");
  return (
    <LoveLayout>
      <SvgMap country={country} onCountryClick={setCountry} />
      <PostCardForm country={country} setCountry={setCountry} onSubmit={openPostcard} />
    </LoveLayout>
  );
};

export default YourLoveMapPage;
