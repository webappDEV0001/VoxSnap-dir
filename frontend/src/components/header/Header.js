import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import UseCasesList from '../useCasesList';
import Logo from '../../media/img/logo.png';
import IconSearch from '../../media/img/icon-search.svg';
import IconClose from '../../media/img/icon-close.svg';
import './Header.scss';

class Header extends React.Component  {
  state = {
    navOpened: false
  }

  toogleNav = () => {
    this.setState(prevState => ({
      navOpened: !prevState.navOpened
    }));
  }

  render() {
    return (
      <header className="Header">
        <div className="Header-wrapper">
          <div className="Header-inner">
            <div className="Header-logo">
              <Link to="/">
                <img src={Logo} width="285" height="27" alt="" />
              </Link>
            </div>
            <SearchField updateApps={this.props.updateApps}/>
            <div className="Header-navToggle">
              <button
                type="button"
                className="Header-navToggleBtn"
                onClick={this.toogleNav}
              >
                <span />
              </button>
            </div>
          </div>
        </div>
        {
          this.state.navOpened
          && (
            <div className="Header-mobileNav">
              <div className="Header-mobileNavOverlay" onClick={this.toogleNav} />
              <div className="Header-mobileNavWrapper">
                <div className="Header-mobileNavHeading">
                  <div className="Header-mobileNavTitle">Use Cases</div>
                  <button
                    type="button"
                    className="Header-mobileNavBtn"
                    onClick={this.toogleNav}
                  >
                    <img src={IconClose} width="20" height="21" alt="" />
                  </button>
                </div>
                <div className="Header-mobileNavList">
                  <UseCasesList />
                </div>
              </div>
            </div>
          )
        }
      </header>
    );
  }
};

class SearchField extends Component {

  render() {
    return (
      <section className="Header-search">
        <div className="Header-searchInputWrap">
          <input type="search" className="Header-searchInput" placeholder="Search" incremental="incremental" ref={ r => this.inputRef = r } onChange={this.onSearchEvent}/>
        </div>
        <button
          type="button"
          className="Header-searchBtn"
          onClick={this.onSearch}
        >
          <img src={IconSearch} width="16" height="16" alt="Search"/>
        </button>
      </section>
    );
  }

  onSearchEvent = input => {

    const { updateApps } = this.props;
    let searchText = this.inputRef.value;
    if (searchText === '') {
      updateApps(null, null, null, searchText);
    }
  }

  onSearch = () => {
    const { updateApps } = this.props;
    let searchText = this.inputRef.value;
    updateApps(null, null, null, searchText);
  }
}

export default Header;
