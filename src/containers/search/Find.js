import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replacePath } from 'redux-simple-router'
import debounce from 'lodash.debounce'
import * as ACTION_TYPES from '../../constants/action_types'
import { SIGNED_OUT_PROMOTIONS } from '../../constants/promotion_types'
import * as SearchActions from '../../actions/search'
import { trackEvent } from '../../actions/tracking'
import { updateQueryParams } from '../../components/base/uri_helper'
import Banderole from '../../components/assets/Banderole'
import SearchControl from '../../components/forms/SearchControl'
import StreamComponent from '../../components/streams/StreamComponent'
import TabListButtons from '../../components/tabs/TabListButtons'

class Find extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = this.props.search
    const terms = props.location.query.terms
    const type = props.location.query.type
    if (terms) {
      this.state.terms = terms
    }
    if (type && (type === 'users' || type === 'posts')) {
      this.state.type = type
    } else {
      this.state.type = 'posts'
    }
    this.updateLocation({ ...this.state })
  }

  componentWillMount() {
    this.search = debounce(this.search, 300)
    this.updateLocation = debounce(this.updateLocation, 300)
  }

  getAction() {
    const { terms, type } = this.state
    if (terms && terms.length > 1) {
      if (type === 'users') {
        return SearchActions.searchForUsers(terms)
      }
      return SearchActions.searchForPosts(terms)
    }
    return null
  }

  search() {
    const { dispatch } = this.props
    const { type } = this.state
    dispatch({
      type: ACTION_TYPES.SEARCH.SAVE,
      payload: this.state,
    })
    const action = this.getAction()
    if (action) {
      const label = type === 'users' ? 'people' : 'posts'
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
      dispatch(trackEvent(`search-logged-out-${label}`))
    }
  }

  updateLocation(valueObject) {
    const { dispatch } = this.props
    const vo = valueObject
    if (typeof vo.terms === 'string' && vo.terms.length < 2) {
      vo.terms = null
    }
    if (typeof vo.type === 'string' && vo.type === 'posts') {
      vo.type = null
    }
    if (typeof document !== 'undefined') {
      const uri = document.location.pathname + updateQueryParams(vo)
      dispatch(replacePath(uri, window.history.state))
    }
  }

  handleControlChange(vo) {
    this.setState(vo)
    this.search()
    this.updateLocation(vo)
  }

  creditsTrackingEvent() {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  }

  render() {
    const { terms, type } = this.state
    const tabs = [
      { type: 'posts', children: 'Posts' },
      { type: 'users', children: 'People' },
    ]
    return (
      <section className="Search Panel">
        <Banderole
          creditsClickAction={ ::this.creditsTrackingEvent }
          userlist={ SIGNED_OUT_PROMOTIONS }
        />
        <div className="SearchBar">
          <SearchControl
            controlWasChanged={ ::this.handleControlChange }
            text={ terms }
          />
          <TabListButtons
            activeType={ type }
            className="SearchTabList"
            onTabClick={ ::this.handleControlChange }
            tabClasses="LabelTab"
            tabs={ tabs }
          />
        </div>
        <StreamComponent ref="streamComponent" action={this.getAction()} />
      </section>
    )
  }
}

Find.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      terms: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  search: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    search: state.search,
  }
}

export default connect(mapStateToProps)(Find)

