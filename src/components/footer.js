import React from "react";

const Footer = ({ children }) => (
  <div id="mtrss-contacts" className="footer">
    {children}
    <div>
      <a className="contact-icon facebook" target="_blank" href="https://www.facebook.com/mtrss.art"></a>
      <a className="contact-icon instagram" target="_blank" href="https://www.instagram.com/mtrss.art"></a>
      <a
        className="contact-icon spotify"
        target="_blank"
        href="https://open.spotify.com/artist/6k4nRFSKe2EQuzMHAtY1gp?si=05TzF1roQUqSdPnhDWxWBA"
      ></a>
      <a className="contact-icon bandcamp" target="_blank" href="https://mtrss.bandcamp.com/"></a>
      <a className="contact-icon email" target="_blank" href="mailto:mtrss.art@gmail.com"></a>
    </div>
    <p>&copy; 2021 MTRSS Arts. All Rights Reserved</p>
  </div>
);

export default Footer;
