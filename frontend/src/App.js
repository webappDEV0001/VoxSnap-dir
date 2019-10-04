import React, {Component} from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/home';
import AudioApp from './pages/audioApp';
import Devices from './pages/devices';
import VoiceControl from './pages/voiceControl';
import Header from './components/header';
import Footer from './components/footer';
import { getApps, setVoiceAppIndex, getDevices, getCategories,  } from './actions';

class App extends Component {

  componentDidMount() {
    const { loadApps, loadDevices, loadCategories } = this.props;
    loadDevices();
    loadCategories();
    loadApps();
  }

  updateApps = (newDevice, newCategory, selectedVoiceAppIndex, searchText='', isFiltering) => {
    const { loadApps, pageSize, setVoiceAppIndex, currentVoiceAppIndex } = this.props;
    if (newDevice === null) {
      newDevice = this.props.updatedDevice;
    }
    let device = 'unspecification';
    if (newDevice != null) {
      switch (newDevice.id) {
        case 1:
          device = 'alexa';
          break;
        case 2:
          device = 'google';
          break;
        default:
          device = 'alexa';
          break;
      }
    }
    if (newCategory === null) {
      newCategory = this.props.updatedCategory;
    }
    let category = '-1';
    if (newCategory != null) {
      category = newCategory.id;
    }
    if (selectedVoiceAppIndex !== -1) {
      setVoiceAppIndex(selectedVoiceAppIndex);
      loadApps(pageSize, selectedVoiceAppIndex * pageSize, device, category, searchText, isFiltering);
    } else {
      loadApps(pageSize, currentVoiceAppIndex * pageSize, device, category, searchText, isFiltering);
    }
  }

  render() {
    return(
      <Router>
        <div className="App">
          <Header updateApps={this.updateApps}/>
          <Route exact path="/" component={() => <Home updateApps={this.updateApps} />} />
          {/* <Route path="/app/:app_id" component={() => <AudioApp updateApps={this.updateApps} />} /> */}
          <Route path="/app/:app_id" component={AudioApp} />
          <Route path="/devices" component={Devices} />
          <Route path="/voice-control" component={VoiceControl} />
          <Footer />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  voiceApps: state.voiceApps.apps,
  updatedDevice: state.devices.updatedDevice,
  updatedCategory: state.categories.updatedCategory,
  currentVoiceAppIndex: state.voiceApps.selectedVoiceAppIndex,
  pageSize: state.voiceApps.paginationSize,
})

const mapDispatchToProps = dispatch => ({
  loadDevices: () => dispatch(getDevices()),
  loadCategories: () => dispatch(getCategories()),
  loadApps: (limit = 10, offset = 0, device = 'unspecification', category = -1, searchText = '', isFiltering = false) => dispatch(getApps(limit, offset, device, category, searchText, isFiltering)),
  setVoiceAppIndex: index => dispatch(setVoiceAppIndex(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
