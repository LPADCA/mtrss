import React from 'react'
import Img from 'gatsby-image'

import styles from './hero.module.css'

export default ({ data, buttonText, buttonUrl }) => (
  <>
    <div className="hero">
      <div id="keep-ratio-01"></div>
      <div className="overlay1-shadow hide-aspect">
        <div className="overlay1">
          <a href={buttonUrl} className="button">{buttonText}</a>
        </div>
      </div>
      <div className="overlay2-shadow">
        <div className="overlay2">
        </div>
      </div>
    </div>
    <div className="show-aspect aspect-insert">
      <a href="#" className="button">Listen now</a>
    </div>
  </>
)
