import React from 'react'
import Img from 'gatsby-image'

import styles from './hero.module.css'

const buttonURL2 = "https://ffm.to/yeqvjb1"
const buttonText2 = "Listen Now"


export default ({ data, buttonText, buttonURL }) => (
  <>
    <div className="hero desktop">
      <div class="insert-left"></div>
      <div class="insert-right"></div>
      <div className="overlay1-shadow">
        <div className="overlay1">
          <a href={buttonURL} className="button">{buttonText}</a>
        </div>
      </div>
      <div className="overlay2-shadow">
        <div className="overlay2">
          <a href={buttonURL2} className="button">{buttonText2}</a>
        </div>
      </div>
    </div>
    <div className="hero mobile">
      <div className="cover1">
        <div className="overlay1">
          <a href={buttonURL} className="button">{buttonText}</a>
        </div>
      </div>
      <div className="cover2">
        <div className="overlay2">
          <a href={buttonURL2} className="button">{buttonText2}</a>
        </div>
      </div>
    </div>
  </>
)
