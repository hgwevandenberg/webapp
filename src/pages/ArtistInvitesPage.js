import React, { Component } from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadArtistInvites } from '../actions/artist_invites'
import { getLinkObject } from '../helpers/json_helper'
import { trackPostViews } from '../actions/posts'
import StreamContainer from '../containers/StreamContainer'
import { HeroHeader } from '../components/heros/HeroRenderables'
import { MainView } from '../components/views/MainView'
import { selectQueryPreview } from '../selectors/routing'
import { selectRandomArtistInvitePromotion } from '../selectors/promotions'
import { selectJson } from '../selectors/store'
import { css } from '../styles/jss'
import { selectHeroDPI } from '../selectors/gui'

const streamStyle = css({
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
})

const mapStateToProps = state => ({
  dpi: selectHeroDPI(state),
  isPreview: selectQueryPreview(state) === 'true',
  json: selectJson(state),
  randomPromotion: selectRandomArtistInvitePromotion(state),
})

class ArtistInvitesPage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    json: PropTypes.object,
    randomPromotion: PropTypes.object,
  }

  static defaultProps = {
    isPreview: false,
    json: null,
    randomPromotion: null,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.randomPromotion, this.props.randomPromotion) ||
      ['dpi'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  componentDidUpdate() {
    const { dispatch, randomPromotion } = this.props
    if (randomPromotion && randomPromotion.get('postToken')) {
      dispatch(trackPostViews([], [randomPromotion.get('postToken')], 'promo'))
    }
  }

  render() {
    const { dpi, json, randomPromotion } = this.props
    let hero
    if (randomPromotion) {
      const header = randomPromotion.get('header', '')
      const subheader = randomPromotion.get('subheader', '')
      const user = getLinkObject(randomPromotion, 'user', json) || Immutable.Map()
      const avatarSources = user.get('avatar', null)
      const username = user.get('username', null)
      const sources = randomPromotion.get('image', null)
      hero = (<HeroHeader
        dpi={dpi}
        headerText={header}
        subHeaderText={subheader}
        sources={sources}
        avatarSources={avatarSources}
        username={username}
      />)
    }
    return (
      <MainView className="ArtistInvites">
        {hero}
        <StreamContainer
          action={loadArtistInvites(this.props.isPreview)}
          className={`${streamStyle}`}
          paginatorText="Load More"
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(ArtistInvitesPage)

