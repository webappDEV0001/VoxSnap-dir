import React, { Component } from 'react';
import { connect } from 'react-redux';
import {getAlexaDevices, getGoogleDevices} from '../../actions';
import { Link } from 'react-router-dom';
import Hero from '../../components/hero';
import Button from '../../components/button';
import './Devices.scss';
import VoiceControlCover from '../../media/img/voice-control-cover.jpg';
import LogoAlexa from '../../media/img/logo-alexa--lg.png';
import LogoHome from '../../media/img/logo-home--lg.png';
import LogoHomePod from '../../media/img/logo-homepod--lg.png';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


class Devices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 5,
      activePageForAlexa: 0,
      activePageForGoogle: 0,
      activePageForApple: 0
    };
  }

  componentDidMount() {
    const { loadAlexaDevices, loadGoogleDevices } = this.props;
    loadAlexaDevices(this.state.pageSize * this.state.activePageForAlexa);
    loadGoogleDevices(this.state.pageSize * this.state.activePageForAlexa);
  }

  handlePageChange(e, kind=0, index) {
    const { loadAlexaDevices, loadGoogleDevices } = this.props;
    e.preventDefault();
    switch (kind) {
      case 0:
        this.setState({
          activePageForAlexa: index
        });
        loadAlexaDevices(this.state.pageSize * index);
        break;
      case 1:
        this.setState({
          activePageForGoogle: index
        });
        loadGoogleDevices(this.state.pageSize * index);
        break;
      case 2:
        this.setState({
          activePageForApple: index
        });
        break;

      default:
        break;
    }
  }


  render() {
    const { alexaDevicesData, googleDevicesData } = this.props;

    let alexaDevices = [];
    let googleDevices = [];
    if (alexaDevicesData.results !== undefined) {
      alexaDevices = alexaDevicesData.results;
    }
    if (googleDevicesData.results !== undefined) {
      googleDevices = googleDevicesData.results;
    }
    let alexaPaginationItems = [];
    let googlePaginationItems = [];
    let alexaPageCount = 0, googlePageCount = 0;
    if (alexaDevicesData.count > 0) {
      alexaPageCount = Math.ceil(alexaDevicesData.count / this.state.pageSize);
    }
    if (googleDevicesData.count > 0) {
      googlePageCount = Math.ceil(googleDevicesData.count / this.state.pageSize);
    }

    // prev, next links for alexa
    let prevLinkForAlexa = '';
    let nextLinkForAlexa = '';
    if (alexaDevicesData.next !== null) {
      nextLinkForAlexa = alexaDevicesData.next;
    }
    if (alexaDevicesData.previous !== null) {
      prevLinkForAlexa = alexaDevicesData.previous;
    }
    // prev, next links for google
    let prevLinkForGoogle = '';
    let nextLinkForGoogle = '';
    if (googleDevicesData.next !== null) {
      nextLinkForGoogle = googleDevicesData.next;
    }
    if (googleDevicesData.previous !== null) {
      prevLinkForGoogle = googleDevicesData.previous;
    }

    alexaPaginationItems.push(
      <PaginationItem key = {-1} disabled={ prevLinkForAlexa === '' }>
        <PaginationLink onClick={e => this.handlePageChange(e, 0, this.state.activePageForAlexa - 1)} previous />
      </PaginationItem>
    );
    for (let i = 0; i < alexaPageCount; i++) {
      alexaPaginationItems.push(
        <PaginationItem key={i} active={i === this.state.activePageForAlexa}>
          <PaginationLink onClick={e => this.handlePageChange(e, 0, i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    alexaPaginationItems.push(
      <PaginationItem key = {9999999} disabled={ nextLinkForAlexa === '' }>
        <PaginationLink onClick={e => this.handlePageChange(e, 0, this.state.activePageForAlexa + 1)} next />
      </PaginationItem>
    );
    googlePaginationItems.push(
      <PaginationItem disabled={prevLinkForGoogle === ''}>
        <PaginationLink onClick={e => this.handlePageChange(e, 1, this.state.activePageForGoogle - 1)} previous />
      </PaginationItem>
    );
    for (let i = 0; i < googlePageCount; i++) {
      googlePaginationItems.push(
        <PaginationItem key={i} active={i === this.state.activePageForGoogle}>
          <PaginationLink onClick={e => this.handlePageChange(e, 1, i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    googlePaginationItems.push(
      <PaginationItem disabled={nextLinkForGoogle === ''}>
        <PaginationLink onClick={e => this.handlePageChange(e, 1, this.state.activePageForGoogle + 1)} next />
      </PaginationItem>
    );
    return (
      <section className="Devices">
        <Hero
          title="Discover more ways to use Smart Speakers"
        />
        <div className="Devices-wrapper">
          <section className="Devices-banner">
            <div className="Devices-bannerTitle">Voice control your home</div>
            <div className="Devices-bannerCover">
              <img src={VoiceControlCover} alt="" />
            </div>
            <div className="Devices-bannerLink">
              <Button>
                <Link to="/voice-control"><span>Discover</span></Link>
              </Button>
            </div>
          </section>
          <div className="Devices-title">Devices</div>
          <section className="Devices-group">
            <div className="Devices-groupLogo">
              <img src={LogoAlexa} width="246" height="36" alt="Amazon Alexa" />
            </div>
            <div className="Devices-groupList">
              {alexaDevices.map(device => <DeviceCard device={ device } source='0'/>)}
            </div>
            <div>
              <Pagination>
                {alexaPaginationItems}
              </Pagination>
            </div>
          </section>
          <section className="Devices-group">
            <div className="Devices-groupLogo">
              <img src={LogoHome} width="233" height="42" alt="Google Home" />
            </div>
            <div className="Devices-groupList">
              {googleDevices.map(device => <DeviceCard device={ device } source='1'/>)}
            </div>
            <div>
              <Pagination>
                {googlePaginationItems}
              </Pagination>
            </div>
          </section>
          <section className="Devices-group">
            <div className="Devices-groupLogo">
              <img src={LogoHomePod} width="203" height="58" alt="Apple HomePod" />
            </div>
            <div className="Devices-groupList">
              {/* <DeviceCard
                img={AppleHomePod}
                title="Apple HomePod"
                desc="HomePod is a Siri activated speaker that senses its location and tunes the music to sound amazing wherever you are in the room. Together with Apple Music, it gives you access to over 45 million songs. And with the intelligence of Siri, it's a helpful home assistant for everyday tasks, and for controlling your smart home accessories - all with just your voice."
                price="299.99"
                url="/"
              /> */}
            </div>
          </section>
        </div>
      </section>
    )
  }
};

const DeviceCard = ({device, source}) => {
  return (
    <section className="DeviceCard">
      <div className="DeviceCard-thumb">
        <img src={device.image_url} alt="" />
      </div>
      <div className="DeviceCard-content">
        <div className="DeviceCard-title">{device.name}</div>
        <div className="DeviceCard-desc">{device.description}</div>
        <div className="DeviceCard-link">
          <Button>
            {/* <Link to={device.id}>Buy - <span>${device.price}</span></Link> */}
            <Link to='http://google.com'>Buy - <span>${device.price}</span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


const mapStateToProps = state => ({
  alexaDevicesData: state.devices.alexaDevices,
  googleDevicesData: state.devices.googleDevices
})

const mapDispatchToProps = dispatch => ({
  loadAlexaDevices: offset => dispatch(getAlexaDevices(offset)),
  loadGoogleDevices: offset => dispatch(getGoogleDevices(offset)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
