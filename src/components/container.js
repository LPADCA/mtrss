import React from "react";

export default function Container({ children }) {
  return <div style={{ maxWidth: 1180, margin: "0 auto" }}>{children}</div>;
}
