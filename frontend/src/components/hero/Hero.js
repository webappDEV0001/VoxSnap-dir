import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.scss';

const Hero = ({title}) => {
  return (
    <section className="Hero">
      <div className="Hero-wrapper">
        <h2 className="Hero-title">{title}</h2>
        <div className="Hero-link">
          <Link to="/">Back to voice apps directory</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
