import React from 'react';
import { Link } from 'react-router-dom';
import LogoFb from '../../media/img/logo-fb.svg';
import LogoGroup from '../../media/img/logo-group.svg';
import LogoTw from '../../media/img/logo-tw.svg';
import LogoInst from '../../media/img/logo-inst.svg';
import IconHart from '../../media/img/icon-hart.svg';
import './Footer.scss';

const Footer = () => {
    return (
      <footer className="Footer">
        <div className="Footer-wrapper">
          <section className="Footer-links">
            <Link to="/">
              <img src={LogoFb} width="22" height="22" alt="" />
            </Link>
            <Link to="/">
              <img src={LogoGroup} width="22" height="23" alt="" />
            </Link>
            <Link to="/">
              <img src={LogoTw} width="26" height="21" alt="" />
            </Link>
            <Link to="/">
              <img src={LogoInst} width="21" height="21" alt="" />
            </Link>
          </section>
          <section className="Footer-mail">
            <div className="Footer-mailContent">
              For feedback or suggestions email
              { ' ' }
              <Link to="/">ilovevoiceapps@gmail.com</Link>
            </div>
          </section>
          <section className="Footer-info">
            Built with <img src={IconHart} width="13" height="12" alt="" /> by the VoxSnap team.<br />
            All rights reserved.
          </section>
        </div>
      </footer>
    );
};

export default Footer;
