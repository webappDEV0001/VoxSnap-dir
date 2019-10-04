import React, {Component} from 'react';
import Rate from 'rc-rate';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchHero from '../../components/searchHero';
import AppCard from '../../components/appCard';
import Review from '../../components/review';
import ReactLoading from 'react-loading';

import IconFb from '../../media/img/icon-facebook.svg';
import IconTw from '../../media/img/icon-twitter.svg';
import IconLi from '../../media/img/icon-linkedin.svg';
import LogoAlexa from '../../media/img/logo-alexa.png';
import LogoGoogle from '../../media/img/logo-home.png';
import LogoSiri from '../../media/img/logo-siri.png';
import './AudioApp.scss';

class AudioApp extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { voiceApps } = this.props;
    const { app_id } = this.props.match.params;
    let voiceApp, app = [], isAlexa;
    if (voiceApps !== undefined) {
      voiceApps.forEach(app => {
        if (app.id == app_id) {
          voiceApp = app;
        }
      });
    }
    if (voiceApp) {
      if (voiceApp.alexa_skill) {
        isAlexa = true;
        app = voiceApp.alexa_skill_review[0];
      } else if (voiceApp.google_assistant_action) {
        isAlexa = false;
        app = voiceApp.google_assistant_action_review[0];
      }
      return (
        <section className="AudioApp">
          <SearchHero/>
          <section className="AudioApp-content">
            <div className="AudioApp-wrapper">
              <div className="AudioApp-contentInner">
                <div className="AudioApp-colInfo">
                  <Info
                    app={app}
                    isAlexa={isAlexa} />
                </div>
                <div className="AudioApp-colEnable">
                  <Enable />
                </div>
              </div>
            </div>
          </section>

          <Details />
          <Reviews />
          {/* <Related app = { app }/> */}
        </section>
      );
    } else {
      return (
        <section className="AudioApp">
      </section>
      );
    }
  }
};

function getAverageRating(reviews) {
  let total = 0;
  reviews.forEach((review, index) => {
    total += review.rating;
  });
  return total / reviews.length / 20;
}

const mapStateToProps = state => ({
  voiceApps: state.voiceApps.apps.results
})

export default connect(mapStateToProps)(AudioApp);

const Info = (props) => {
  return (
    <section className="AudioApp-info">
      <section className="AudioApp-heading">
        <div className="AudioApp-headingThumb">
          <img src={props.app.icon_url} alt="Image" />
        </div>
        <div className="AudioApp-headingContent">
          <div className="AudioApp-headingTitle">{props.isAlexa ? props.app.title : props.app.name}</div>
          <div className="AudioApp-headingSubtitle">by {props.app.author.name}</div>
        </div>
      </section>
      <section className="AudioApp-description">
        <p>
          { props.app.description }
        </p>
      </section>
      <section className="AudioApp-rate">
        <div className="AudioApp-rateTitle">{props.app.category.name}</div>
        <div className="AudioApp-rateInner">
          <div className="AudioApp-rateStat">
            <Rate className="RcRate" defaultValue={props.isAlexa ? getAverageRating(props.app.reviews) : 4} allowClear={false} disabled />
          </div>
          <div className="AudioApp-rateNum">{props.isAlexa ? props.app.reviews.length : 12} Reviews</div>
        </div>
      </section>
      <section className="AudioApp-share">
        <div className="AudioApp-shareTitle">Share on</div>
        <div className="AudioApp-shareLinks">
          <Link to="/" className="AudioApp-shareLink is-fb">
            <img src={IconFb} alt="" />
            <span>Facebook</span>
          </Link>
          <Link to="/" className="AudioApp-shareLink is-tw">
            <img src={IconTw} alt="" />
            <span>Twitter</span>
          </Link>
          <Link to="/" className="AudioApp-shareLink is-li">
            <img src={IconLi} alt="" />
            <span>LinkedIn</span>
          </Link>
        </div>
      </section>
    </section>
  );
}

const Enable = () => {
  return (
    <section className="AudioApp-enable">
      <section className="AudioApp-enableItem">
        <div className="AudioApp-enableTitle">Enable on</div>
        <div className="AudioApp-enableLink">
          <Link to="/">
            <img src={LogoAlexa} width="24" height="24" alt="" />
            <span>Amazon Alexa</span>
          </Link>
        </div>
        <div className="AudioApp-enableInfo">Details: Flash Briefing Skill</div>
        <div className="AudioApp-enableTxt">Alexa: Alexa, open [skill name]</div>
      </section>
      <section className="AudioApp-enableItem">
        <div className="AudioApp-enableTitle">Enable on</div>
        <div className="AudioApp-enableLink">
          <Link to="/">
            <img src={LogoGoogle} width="27" height="25" alt="" />
            <span>Google Home</span>
          </Link>
        </div>
        <div className="AudioApp-enableInfo">Details: Flash Briefing Skill</div>
        <div className="AudioApp-enableTxt">Google: OK, Google open [skill name]</div>
      </section>
      <section className="AudioApp-enableItem">
        <div className="AudioApp-enableTitle">Enable on</div>
        <div className="AudioApp-enableLink">
          <Link to="/">
            <img src={LogoSiri} width="25" height="25" alt="" />
            <span>Apple Siri</span>
          </Link>
        </div>
        <div className="AudioApp-enableInfo">Details: Flash Briefing Skill</div>
        <div className="AudioApp-enableTxt">Hey Siri, play [station name or call letters] radio.</div>
      </section>
    </section>
  );
}

const Details = () => {
  return (
    <section className="AudioApp-details">
      <div className="AudioApp-wrapper">
        <div className="AudioApp-detailsInner">
          <div className="AudioApp-detailsCol">
            <div className="AudioApp-detailsSubtitle">Pros</div>
            <ul className="AudioApp-detailsList">
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
            </ul>
          </div>
          <div className="AudioApp-detailsCol">
            <div className="AudioApp-detailsSubtitle">Cons</div>
            <ul className="AudioApp-detailsList">
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
              <li className="AudioApp-detailsItem">Play along as the Happy Meal® Time Travel</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const Reviews = () => {
  return (
    <section className="AudioApp-reviews">
      <div className="AudioApp-wrapper">
        <div className="AudioApp-sectTitle">Top 10 Reviews</div>
        <div className="AudioApp-reviewsList">
          <Review />
          <Review />
          <Review />
          <Review />
          <Review />
          <Review />
        </div>
      </div>
    </section>
  );
}

// class Related extends Component {
//   return() {
//     console.log('asdfasdfasdfasdf: ' + this.props);
//     <section className="AudioApp-related">
//       <div className="AudioApp-wrapper">
//         <div className="AudioApp-sectTitle">Related Voice Apps</div>
//         <div className="AudioApp-relatedList">
//           <AppCard app = {this.props.app}/>
//           <AppCard app = {this.props.app}/>
//           <AppCard app = {this.props.app}/>
//         </div>
//       </div>
//     </section>
//   }
// }
