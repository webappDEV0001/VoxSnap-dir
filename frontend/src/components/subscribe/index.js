import React from 'react';
import Button from '../button';
import './Subscribe.scss';

const Subscribe = () => {
  return (
    <section className="Subscribe">
      <div className="Subscribe-title">Get the latest news about voice apps</div>
      <div className="Subscribe-row">
        <div className="Subscribe-colInput">
          <input className="Subscribe-input" type="email" placeholder="Enter you email …" />
        </div>
        <div className="Subscribe-colBtn">
          <Button><span>Subscribe</span></Button>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
