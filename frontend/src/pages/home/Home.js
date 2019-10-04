import React, {Component} from 'react';
import { connect } from 'react-redux';
import SearchHero from '../../components/searchHero';
import VoiceAppsBar from '../../components/voiceAppsBar';
import UseCasesList from '../../components/useCasesList';
import AppCard from '../../components/appCard';
import Subscribe from '../../components/subscribe';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './Home.scss';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 0,
    };
  }

  render () {
    const { voiceApps, voiceAppCounts} = this.props;
    let updatedCategoryForPage = 0;
    let updatedDeviceForPage = 0;
    if (this.props.updatedCategory !== null) {
      updatedCategoryForPage = this.props.updatedCategory.id;
    }
    if (this.props.updatedDevice !== null) {
      updatedDeviceForPage = this.props.updatedDevice.id;
    }
    let filteredAppAsDevice = [];
    //
    //filtering with Devices ==== Alexa, google, apple
    //_review should be used for detail, not use element without _review such as  alexa_skill, google...
    if (voiceApps) {
      if (updatedDeviceForPage !== 0) {
        voiceApps.forEach(app => {
          switch (updatedDeviceForPage) {
            case 1: //alexa
              if (app.alexa_skill_review.length > 0) {
                filteredAppAsDevice.push(app);
              }
              break;
            case 2: //google action
              if (app.google_assistant_action_review.length > 0) {
                filteredAppAsDevice.push(app);
              }
              break;
            case 3: //TODO //apple home pod implementation.

              break;

            default:
              break;
          }
        });
      } else {
        filteredAppAsDevice = voiceApps;
      }
    }
    //filtering as the selected category
    let allocatedApps = [];
    if (filteredAppAsDevice) {
      if (updatedCategoryForPage !== 0) {
        filteredAppAsDevice.forEach(app => {
          if (app.alexa_skill_review.length > 0) {
            let category_id = app.alexa_skill_review[0].category.id
            if (updatedCategoryForPage === category_id) {
              allocatedApps.push(app);
            }
          } else if (app.google_assistant_action_review.length > 0) {
            let category_id = app.google_assistant_action_review[0].category.id
            if (updatedCategoryForPage === category_id) {
              allocatedApps.push(app);
            }
          }
        });
      } else {
        allocatedApps = filteredAppAsDevice;
      }
    }

    let updatedCategoryName = 'Top Ranked';
    if (updatedCategoryForPage !== 0) {
      updatedCategoryName = this.props.updatedCategory.name;
    } else {
      allocatedApps.sort((prev, next) => {
        let prev_val, next_val;
        if (prev.alexa_skill_review.length > 0) {
          if (prev.alexa_skill_review[0].reviews.length > 0) {
            let total = 0;
            prev.alexa_skill_review[0].reviews.forEach (review => {
              total += review.rating;
            });
            prev_val = total / prev.alexa_skill_review[0].reviews.length;
          } else {
            prev_val = 0;
          }
        } else if (prev.google_assistant_action_review.length > 0) {
          if (prev.google_assistant_action_review[0].reviews.length > 0) {
            let total = 0;
            prev.google_assistant_action_review[0].reviews.forEach (review => {
              total += review.rating;
            });
            prev_val = total / prev.google_assistant_action_review[0].reviews.length;
          } else {
            prev_val = 0;
          }
        }
        if (next.alexa_skill_review.length > 0) {
          if (next.alexa_skill_review[0].reviews.length > 0) {
            let total = 0;
            next.alexa_skill_review[0].reviews.forEach (review => {
              total += review.rating;
            });
            next_val = total / next.alexa_skill_review[0].reviews.length;
          } else {
            next_val = 0;
          }
        } else if (next.google_assistant_action_review.length > 0) {
          if (next.google_assistant_action_review[0].reviews.length > 0) {
            let total = 0;
            next.google_assistant_action_review[0].reviews.forEach (review => {
              total += review.rating;
            });
            next_val = total / next.google_assistant_action_review[0].reviews.length;
          } else {
            next_val = 0;
          }
        }
        return next_val - prev_val;
      });
    }
    let paginationItems = [];
    let pageCount = 0;
    let prevLink = '';
    let nextLink = '';
    if (voiceAppCounts > 0) {
      pageCount = Math.ceil(voiceAppCounts / this.props.pageSize);
    }
    if (this.props.prevLink !== null) {
      prevLink = this.props.prevLink;
    }
    if (this.props.nextLink !== null) {
      nextLink = this.props.nextLink;
    }
    paginationItems = this.getPaginationItems(pageCount, prevLink, nextLink);

    return (
      <section className="Home">
        <SearchHero updateApps={this.props.updateApps}/>
        <VoiceAppsBar />
        <div className="Home-devider" />
        <div className="Home-wrapper">
          <div className="Home-inner">
            <div className="Home-colCases">
              <div className="Home-colTitle">Use Cases</div>
              <UseCasesList />
            </div>
            <div className="Home-colCards">
              <Subscribe />
              <div className="Home-colTitle">{updatedCategoryName}</div>
              <div className="Home-appsList">
                {allocatedApps.map((app, index) => <AppCard app={app} key={index} />)}
              </div>
              <div>
                <Pagination> {paginationItems} </Pagination>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  getPaginationItems(totalPageCount, prevLink, nextLink) {

    let paginationItemSize = 9; //item count including ellipsis, next...
    const { selectedVoiceAppIndex } = this.props;
    let voiceAppIndex = selectedVoiceAppIndex;
    if (voiceAppIndex > totalPageCount - 1) {
      voiceAppIndex = 0;
    }
    let ellipsisItem1 = '';
    let ellipsisItem2 = '';
    let retVal = [];
    ellipsisItem1 = <PaginationItem key={-111} ><div className="Home-pagination-ellipsis">&nbsp;...&nbsp;</div></PaginationItem>;
    ellipsisItem2 = <PaginationItem key={-222} ><div className="Home-pagination-ellipsis">&nbsp;...&nbsp;</div></PaginationItem>;
    if (paginationItemSize === 11) {
      retVal.push(
        <PaginationItem key = {-11} disabled={ prevLink === '' }>
          <PaginationLink onClick={e => this.handlePageChange(e, 0)} first />
        </PaginationItem>
      );
    }
    retVal.push(
      <PaginationItem key = {-1} disabled={ prevLink === '' }>
        <PaginationLink onClick={e => this.handlePageChange(e, voiceAppIndex - 1)} previous />
      </PaginationItem>
    );
    if (totalPageCount <= paginationItemSize - 1) {
      for (let i = 0; i < totalPageCount; i++) {
        retVal.push(
          <PaginationItem key={i} active={i === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>);
      }
    } else {
      // first 2 items
      for (let i = 0; i < 2; i++) {
        retVal.push(
          <PaginationItem key={i} active={i === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>);
      }
      // 3th item
      if (voiceAppIndex >= Math.floor(paginationItemSize / 2)) {
        retVal.push(ellipsisItem1);
      } else {
        retVal.push(
          <PaginationItem key={2} active={2 === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, 2)}>
              {3}
            </PaginationLink>
          </PaginationItem>);
      }
      //(4th~8th) = item is 11 AND (4th~6th) = item is 9
      if (paginationItemSize ===11) {
        let startIndex = 3;
        if (voiceAppIndex === 5 || voiceAppIndex === 6) {
          startIndex = 5;
        } else if (voiceAppIndex >= totalPageCount - 5) {
          startIndex = totalPageCount - 8;
        } else if (voiceAppIndex >= 0 && voiceAppIndex < 5) {
          startIndex = 3;
        } else {
          startIndex = voiceAppIndex - 2;
        }
        for (let i = startIndex; i <= startIndex + 4; i++) {
          retVal.push(
            <PaginationItem key={i} active={i === voiceAppIndex}>
              <PaginationLink onClick={e => this.handlePageChange(e, i)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>);
        }
      } else {
        let startIndex = 3;
        if (voiceAppIndex === 4) {
          startIndex = 3;
        } else if (voiceAppIndex >= totalPageCount - 5) {
          startIndex = totalPageCount - 6;
        } else if (voiceAppIndex >= 0 && voiceAppIndex < 4) {
          startIndex = 3;
        } else {
          startIndex = voiceAppIndex - 1;
        }
        for (let i = startIndex; i <= startIndex + 2; i++) {
          retVal.push(
            <PaginationItem key={i} active={i === voiceAppIndex}>
              <PaginationLink onClick={e => this.handlePageChange(e, i)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>);
        }
      }
      /////////////
      if (paginationItemSize === 11) {
        if (voiceAppIndex >= totalPageCount - 5) {
          retVal.push(
            <PaginationItem key={8} active={totalPageCount - 3 === voiceAppIndex}>
              <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 3)}>
                {totalPageCount - 2}
              </PaginationLink>
            </PaginationItem>);

        } else {
          retVal.push(ellipsisItem2);
        }
        retVal.push(
          <PaginationItem key={9} active={totalPageCount - 2 === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 2)}>
              {totalPageCount - 1}
            </PaginationLink>
          </PaginationItem>);

        retVal.push(
          <PaginationItem key={10} active={totalPageCount - 1 === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 1)}>
              {totalPageCount}
            </PaginationLink>
          </PaginationItem>);
      } else {
        if (voiceAppIndex >= totalPageCount - 4) {
          retVal.push(
            <PaginationItem key={6} active={totalPageCount - 3 === voiceAppIndex}>
              <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 3)}>
                {totalPageCount - 2}
              </PaginationLink>
            </PaginationItem>);

        } else {
          retVal.push(ellipsisItem2);
        }
        retVal.push(
          <PaginationItem key={7} active={totalPageCount - 2 === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 2)}>
              {totalPageCount - 1}
            </PaginationLink>
          </PaginationItem>);

        retVal.push(
          <PaginationItem key={8} active={totalPageCount - 1 === voiceAppIndex}>
            <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 1)}>
              {totalPageCount}
            </PaginationLink>
          </PaginationItem>);
      }
    }
    //next
    retVal.push(
      <PaginationItem key = {9999999} disabled={ nextLink === '' }>
        <PaginationLink onClick={e => this.handlePageChange(e, voiceAppIndex + 1)} next />
      </PaginationItem>
    );
    if (paginationItemSize === 11) {
      //last
      retVal.push(
        <PaginationItem key = {-999999} disabled={ nextLink === '' }>
          <PaginationLink onClick={e => this.handlePageChange(e, totalPageCount - 1)} last />
        </PaginationItem>
      );
    }
    return retVal;
  }

  handlePageChange(e, index) {
    e.preventDefault();
    this.props.updateApps(null, null, index, '', false);
  }
};

const mapStateToProps = state => ({
  updatedCategory: state.categories.updatedCategory,
  updatedDevice: state.devices.updatedDevice,
  voiceApps: state.voiceApps.apps.results,
  voiceAppCounts: state.voiceApps.apps.count,
  selectedVoiceAppIndex: state.voiceApps.selectedVoiceAppIndex,
  nextLink: state.voiceApps.apps.next,
  prevLink: state.voiceApps.apps.previous,
  pageSize: state.voiceApps.paginationSize,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
