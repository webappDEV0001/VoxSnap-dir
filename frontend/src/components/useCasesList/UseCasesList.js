import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../button';
import './UseCasesList.scss';
import SimpleReactValidator from 'simple-react-validator';
import { submitNewApp } from '../../api';
import Dialog from 'react-dialog'


class UseCasesList extends React.Component {
  state = {
    submitAppModalActive: false,
    submit_new_google: '',
    submit_new_alexa: '',
    submit_email: '',
    isDialogOpen: false
  }

  constructor() {
    super();
    this.validator = new SimpleReactValidator();

  }

  openDialog = () => this.setState({ isDialogOpen: true })

  handleClose = () => this.setState({ isDialogOpen: false })

  toggleSubmitAppModal = () => {
    this.setState(prevState => ({
      submitAppModalActive: !prevState.submitAppModalActive,
    }));
  }

  render () {
    return (
      <section className="UseCasesList">
        <div className="UseCasesList-wrapper">
          <div className="UseCasesList-items">
            <div className="UseCasesList-item">
              <Link to="/app">I’m curious, I want to learn</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/devices">Listen to some music</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Get inspired</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">See what’s useful</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Listen to news and radio</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Play games</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Buy something</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Cook something</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Talk to someone</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">For my kids</Link>
            </div>
            <div className="UseCasesList-item">
              <Link to="/">Ideal for screens</Link>
            </div>
            <div className="UseCasesList-item is-active">
              <Link to="/">Voice control your home</Link>
            </div>
          </div>
          <div className="UseCasesList-submit">
            <a
              href="#"
              className="UseCasesList-submitBtn"
              onClick={this.toggleSubmitAppModal}
            >
              <span>Can’t find your voice app?</span>
              <span className="UseCasesList-submitBtnIcon">Submit It</span>
            </a>
          </div>
        </div>
        {
          this.state.submitAppModalActive && (
            <section className="UseCasesList-submitAppModal">
              <div className="UseCasesList-submitAppModalWrapper">
                <div className="UseCasesList-submitAppModalForm">
                  <h3 className="UseCasesList-submitAppModalTitle">Can’t find your voice app</h3>
                  <p className="UseCasesList-submitAppModalDesc">Submit it now! We will notify you by email when It will be available in 24h. </p>
                  <div className="UseCasesList-submitAppModalItem">
                    <input placeholder="Alexa Skill Url…" value={this.state.submit_new_alexa} onChange={this.onChangeAlexaURL}/>
                    {this.validator.message('alexa_skill_url', this.state.submit_new_alexa, 'required|url')}
                  </div>
                  <div className="UseCasesList-submitAppModalItem">
                    <input placeholder="Google Action…"  value={this.state.submit_new_google} onChange={this.onChangeGoogleURL}/>
                    {this.validator.message('google_action_url', this.state.submit_new_google, 'required|url')}
                  </div>
                  <div className="UseCasesList-submitAppModalItem UseCasesList-submitAppModalItem--email">
                    <input placeholder="Your email…" value={this.state.submit_email} onChange={this.onChangeEmail}/>
                    {this.validator.message('your_email', this.state.submit_email, 'required|email')}
                  </div>
                  <div className="UseCasesList-submitAppModalControls">
                    <Button
                      type="secondary"
                      onClick={this.toggleSubmitAppModal}
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button onClick={this.onSubmitNewUrl}>
                      <span>Submit</span>
                    </Button>
                    {
                      this.state.isDialogOpen &&
                      <Dialog
                          title="Dialog Title"
                          modal={true}
                          onClose={this.handleClose}
                          buttons={
                              [{
                                  text: "Close",
                                  onClick: () => this.handleClose()
                              }]
                          }>
                          <h1>Dialog Content</h1>
                          <p>More Content. Anything goes here</p>
                      </Dialog>
                    }
                  </div>
                </div>
              </div>
            </section>
          )
        }
      </section>
    );
  }

  onChangeAlexaURL = e => {
    this.setState({submit_new_alexa: e.target.value})
  }

  onChangeGoogleURL = e => {
    this.setState({submit_new_google: e.target.value})
  }

  onChangeEmail = e => {
    this.setState({submit_email: e.target.value})
  }

  onSubmitNewUrl = () => {
    if (this.validator.allValid()) {
      this.setState(prevState => ({
        submitAppModalActive: !prevState.submitAppModalActive,
      }));
      submitNewApp(this.state.submit_new_alexa, this.state.submit_new_google, this.state.submit_email).then(res => {
        this.openDialog()
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }

  }
};

export default UseCasesList;
