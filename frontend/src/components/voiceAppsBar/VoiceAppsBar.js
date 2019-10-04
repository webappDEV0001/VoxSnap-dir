import React from 'react';

import LogoAlexa from '../../media/img/logo-alexa.png';
import LogoGoogle from '../../media/img/logo-home.png';
import LogoSiri from '../../media/img/logo-siri.png';

import './VoiceAppsBar.scss';

const VoiceAppsBar = () => {
    return (
      <section className="VoiceAppsBar">
        <div className="VoiceAppsBar-wrapper">
          <div className="VoiceAppsBar-inner">
            <section className="VoiceAppsBar-item">
              <div className="VoiceAppsBar-itemImg">
                <img src={LogoAlexa} width="25" height="24" alt="" />
              </div>
              <div className="VoiceAppsBar-itemContent">
                <span>Works with</span>
                <span className="ttl">Amazon Alexa</span>
              </div>
            </section>
            <section className="VoiceAppsBar-item">
              <div className="VoiceAppsBar-itemImg">
                <img src={LogoGoogle} width="28" height="26" alt="" />
              </div>
              <div className="VoiceAppsBar-itemContent">
                <span>Works with</span>
                <span className="ttl">Google Home</span>
              </div>
            </section>
            <section className="VoiceAppsBar-item">
              <div className="VoiceAppsBar-itemImg">
                <img src={LogoSiri} width="25" height="26" alt="" />
              </div>
              <div className="VoiceAppsBar-itemContent">
                <span>Works with</span>
                <span className="ttl">Apple Siri</span>
              </div>
            </section>
          </div>
        </div>
      </section>
    );
};

export default VoiceAppsBar;
