import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select, {Option} from 'rc-select';
import {doUpdateCategory, doUpdateDevice, setVoiceAppIndex} from '../../actions';
import './SearchHero.scss';

class SearchHero extends Component {

  state = {
    selectedCategory : null,
    selectedDevice : null,
  }

  componentDidMount() {
    const { updatedCategory, updatedDevice } = this.props;
    if (updatedCategory !== null) {
      this.setState({
        selectedCategory: updatedCategory.name
      });
    }

    if (updatedDevice !== null) {
      this.setState({
        selectedDevice: updatedDevice.name
      });
    }
    if (this.props.updateApps === undefined) {

    }
  }

  handleChangeCategory = (value, option) => {
    let categories = this.props.categories;
    this.setState({
      selectedCategory: value
    });
    this.props.setVoiceAppIndex(0);
    this.props.updateCategory(categories[option.key]);
    this.props.updateApps(null, categories[option.key], -1, '', true);
  }

  handleChangeDevice = (value, option) => {
    let devices = this.props.devices;
    this.setState({
      selectedDevice: value
    });
    this.props.setVoiceAppIndex(0);
    this.props.updateDevice(devices[option.key - 1]);
    this.props.updateApps(devices[option.key - 1], null, -1, '', true);
  }

  render () {
    const { devices, categories } = this.props;
    console.log('asdfasdfasdfasdfasdf: ' + categories);
    return (
      <section className="SearchHero">
        <div className="SearchHero-wrapper">
          <h2 className="SearchHero-title">Discover the best voice app</h2>

          <div className="SearchHero-search">
            <input type="search" className="SearchHero-searchInput"  placeholder="Search..." />
          </div>
          <div className="SearchHero-inputWrapper">
            <div className="SearchHero-inputCol">
              <Select className="RcSelect" placeholder="All devices" value={this.state.selectedDevice ? this.state.selectedDevice : undefined} onSelect={this.handleChangeDevice} disabled={this.props.updateApps === undefined}>
                {devices.map(device => <Option value={device.name} key={device.id}>{device.name}</Option>)}
              </Select>
            </div>
            <div className="SearchHero-inputCol">
              <Select className="RcSelect" placeholder="All categories" value={this.state.selectedCategory ? this.state.selectedCategory : undefined} onSelect={this.handleChangeCategory} disabled={this.props.updateApps === undefined}>
                  {categories.map((category, index) => <Option value={category.name} key={index} >{category.name}</Option>)}
              </Select>
            </div>
          </div>
          <div className="SearchHero-controls">
            <div className="SearchHero-controlsBtn SearchHero-controlsBtn--outlined">
              <Link to="/devices">See devices</Link>
            </div>
          </div>
        </div>
      </section>
    );
  };
}

const mapStateToProps = state => ({
  devices: state.devices.devices,
  updatedDevice: state.devices.updatedDevice,
  categories: state.categories.categories,
  updatedCategory: state.categories.updatedCategory,
  voiceAppCounts: state.voiceApps.apps.count,
  selectedVoiceAppIndex: state.voiceApps.selectedVoiceAppIndex,
  nextLink: state.voiceApps.apps.next,
  prevLink: state.voiceApps.apps.previous,
})

const mapDispatchToProps = dispatch => ({
  updateCategory: updatedCategory => dispatch(doUpdateCategory(updatedCategory)),
  updateDevice: updatedDevice => dispatch(doUpdateDevice(updatedDevice)),
  setVoiceAppIndex: index => dispatch(setVoiceAppIndex(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchHero);
