import React, {Component} from 'react';
import Rate from 'rc-rate';
import { Link } from 'react-router-dom';
import './AppCard.scss';

class AppCard extends Component {

  render() {
    const { app } = this.props;
    let title, desc, category_name, author, review_count = 0, rating, image_url;
    if (app.alexa_skill_review.length > 0) {
      let skill = app.alexa_skill_review[0];
      title = skill.title;
      desc = skill.description;
      if (skill.category) {
        category_name = skill.category.name;
      }
      if (skill.author) {
        author = skill.author.name;
      }
      if (skill.reviews) {
        review_count = skill.reviews.length;
        rating = getAverageRating(skill.reviews);
      }
    } else if (app.google_assistant_action_review.length > 0) {
      let action = app.google_assistant_action_review[0];
      title = action.name;
      desc = action.description;
      if (action.category) {
        category_name = action.category.name;
      }
      if (action.author) {
        author = action.author.name;
      }
      image_url = action.icon_url;
    }
    return (
      <section className="AppCard">
        <Link to={`/app/${app.id}`}>
          <div className="AppCard-header">
            <div className="AppCard-logo">
              <img src={image_url} alt="" />
            </div>
            <div className="AppCard-name">
              <div className="AppCard-title">{title}</div>
              <div className="AppCard-subtitle">{category_name}</div>
            </div>
          </div>
          <div className="AppCard-body">
            {desc}
          </div>
          <div className="AppCard-creator">By: {author}</div>
          <div className="AppCard-footer">
            <div className="AppCard-reviews">
              <div className="AppCard-footerLabel">{review_count} Reviews</div>
              <Rate className="RcRate" defaultValue={rating} allowClear={false} disabled />
            </div>
            <div className="AppCard-info">
              <div className="AppCard-footerLabel">Available for:</div>
              <div className="AppCard-infoContent">Alexa, Homepod</div>
            </div>
          </div>
        </Link>
      </section>
    );
  }
}

function getAverageRating(reviews) {
  let total = 0;
  reviews.forEach((review, index) => {
    total += review.rating;
  });
  return total / reviews.length / 20;
}

export default AppCard;
