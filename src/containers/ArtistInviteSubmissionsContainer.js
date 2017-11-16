import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { loadArtistInviteSubmissions } from '../actions/artist_invites'
import {
  selectSubmissionType,
  selectPathname,
} from '../selectors/routing'
import { updateQueryParams } from '../helpers/uri_helper'
import { css, hover, media, modifier, parent } from '../styles/jss'
import * as s from '../styles/jso'
import StreamContainer from './StreamContainer'

const KEYS = ['unapprovedSubmissions', 'approvedSubmissions', 'selectedSubmissions', 'declinedSubmissions']

const containerStyle = css(
  { paddingBottom: 50 },
)

const titleWrapperStyle = css(
  s.flex,
  s.itemsCenter,
  s.maxSiteWidth,
  s.px10,
  s.mxAuto,
  media(s.minBreak2, s.px20),
  media(s.minBreak4, s.px0),
)

const titleStyle = css(
  s.colorA,
  s.fontSize24,
  s.inlineBlock,
  s.sansBlack,
  s.truncate,
  media(s.minBreak3, s.mb20, parent('.ArtistInvitesDetail', s.mb0, s.fontSize38)),
)

const buttonStyle = css(
  { ...titleStyle },
  s.borderBottom,
  s.ml20,
  s.transitionColor,
  modifier('.approvedSubmissions', hover(s.colorGreen)),
  modifier('.selectedSubmissions', hover(s.colorYellow)),
  modifier('.unapprovedSubmissions', hover(s.colorBlack)),
  modifier('.declinedSubmissions', hover(s.colorRed)),
  modifier('.approvedSubmissions.isActive', s.colorGreen),
  modifier('.selectedSubmissions.isActive', s.colorYellow),
  modifier('.unapprovedSubmissions.isActive', s.colorBlack),
  modifier('.declinedSubmissions.isActive', s.colorRed),
)

const mapStateToProps = (state, props) => {
  const links = (props.links || Immutable.Map([])).filter(l => l.get('type') === 'artist_invite_submission_stream')
  const selectedKey = links.size > 0 ? selectSubmissionType(state, props) || KEYS[0] : KEYS[0]
  return {
    links,
    selectedKey,
    pathname: selectPathname(state),
    streamAction: links.size > 0 ? loadArtistInviteSubmissions(links.getIn([selectedKey, 'href']), selectedKey, props.slug) : null,
  }
}

class ArtistInviteSubmissionsContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    links: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
    status: PropTypes.string,
    streamAction: PropTypes.object,
    selectedKey: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    status: null,
    streamAction: null,
  }

  componentWillMount() {
    this.state = { streamAction: this.props.streamAction }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.streamAction && nextProps.streamAction) {
      this.setState({ streamAction: nextProps.streamAction })
    }
  }

  onClickSubmissionType = (e) => {
    const key = e.target.dataset.key
    const { links, slug, pathname, dispatch } = this.props
    const search = updateQueryParams({ submissionType: key })
    this.setState({ streamAction: loadArtistInviteSubmissions(links.getIn([`${key}`, 'href']), key, slug) })
    dispatch(push({ pathname, search }))
  }

  renderAdmin() {
    const { selectedKey, links } = this.props
    const { streamAction } = this.state
    return (
      <div>
        <div className={titleWrapperStyle}>
          <h2 className={titleStyle}>Submissions:</h2>
          {KEYS.map((key) => {
            const submissionStream = links.get(key)
            return (
              <button
                className={`${buttonStyle} ${key} ${selectedKey === key ? 'isActive' : ''}`}
                data-key={key}
                key={key}
                onClick={this.onClickSubmissionType}
              >
                {submissionStream.get('label')}
              </button>
            )
          })}
        </div>
        {streamAction &&
          <StreamContainer
            action={streamAction}
            key={`submissionStream_${selectedKey}`}
            paginatorText="Load More"
            paginatorCentered
          />
        }
      </div>
    )
  }

  renderNormal() {
    const { links, slug, status } = this.props
    switch (status) {
      case 'closed':
        return (
          <div>
            <StreamContainer
              action={loadArtistInviteSubmissions(links.getIn([KEYS[2], 'href']), KEYS[2], slug, 'Selections')}
              hasShowMoreButton
              key={`submissionStream_${KEYS[2]}`}
              paginatorText="Load More"
              paginatorCentered
              shouldInfiniteScroll={false}
            />
            <StreamContainer
              action={loadArtistInviteSubmissions(links.getIn([KEYS[1], 'href']), KEYS[1], slug, 'Submissions')}
              hasShowMoreButton
              key={`submissionStream_${KEYS[1]}`}
              paginatorText="Load More"
              paginatorCentered
              shouldInfiniteScroll={false}
            />
          </div>
        )
      case 'open':
      case 'selecting':
        return (
          <div>
            <StreamContainer
              action={loadArtistInviteSubmissions(links.getIn([KEYS[1], 'href']), KEYS[1], slug, 'Submissions')}
              hasShowMoreButton
              key={`submissionStream_${KEYS[1]}`}
              paginatorText="Load More"
              paginatorCentered
              shouldInfiniteScroll={false}
            />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const { links } = this.props
    if (links.size === 0) { return null }
    return (
      <section className={`Submissions ${containerStyle}`}>
        {links.size >= 3 && this.renderAdmin()}
        {links.size > 0 && links.size < 3 && this.renderNormal()}
      </section>
    )
  }
}

export default connect(mapStateToProps)(ArtistInviteSubmissionsContainer)

