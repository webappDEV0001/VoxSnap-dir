import React from 'react';
import Rate from 'rc-rate';
import './Review.scss';

const Review = () => {
  return (
    <section className="Review">
      <div className="Review-author">Travis L. Teague </div>
      <div className="Review-title">great skill to relax and work</div>
      <div className="Review-rate">
        <Rate className="RcRate" defaultValue={4} allowClear={false} disabled />
      </div>
      <div className="Review-text">
        Per the description, it is an ambient noise loop of light rainfall. To the reviewer that gave it a low rating because it doesn't have thunder... it wasn't advertised as such. It does what it says on the tin, and it does it well. I can listen to this while I am working without my dogs freaking out about the thunder.
      </div>
    </section>
  );
}

export default Review;
