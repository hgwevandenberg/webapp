import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CategoryLink } from '../components/buttons/Buttons'
import {
  CategorySubscribedIcon,
  CategorySubscribeLink,
} from '../components/categories/CategoryRenderables'
import {
  selectCategoryName,
  selectCategorySlug,
  selectCategoryTileImageUrl,
  selectCategoryIsSubscribed,
} from '../selectors/categories'
import { selectSubscribedCategoryIds } from '../selectors/profile'
import { selectIsLoggedIn } from '../selectors/authentication'
import { followCategories } from '../actions/profile'

function mapStateToProps(state, props) {
  return {
    name: selectCategoryName(state, props),
    slug: selectCategorySlug(state, props),
    tileImageUrl: selectCategoryTileImageUrl(state, props),
    isSubscribed: selectCategoryIsSubscribed(state, props),
    isLoggedIn: selectIsLoggedIn(state, props),
    subscribedIds: selectSubscribedCategoryIds(state, props),
  }
}

class CategoryContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    tileImageUrl: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    categoryId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    subscribedIds: PropTypes.object.isRequired,
  }

  static defaultProps = {
    tileImageUrl: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
  }

  subscribe = (e) => {
    const { isLoggedIn, categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    if (!isLoggedIn) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('subscribe-from-page-header')
    } else {
      const catIds = subscribedIds.push(categoryId)
      dispatch(followCategories(catIds))
    }
  }

  unsubscribe = (e) => {
    const { categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    const catIds = subscribedIds.filter(id => id !== categoryId)
    dispatch(followCategories(catIds))
  }

  render() {
    const { name, slug, tileImageUrl, isSubscribed } = this.props
    return (
      <CategoryLink imageUrl={tileImageUrl} to={`/discover/${slug}`} >
        <CategorySubscribedIcon isSubscribed={isSubscribed} />
        {name}
        <CategorySubscribeLink
          subscribe={this.subscribe}
          unsubscribe={this.unsubscribe}
          isSubscribed={isSubscribed}
        />
      </CategoryLink>
    )
  }
}

export default connect(mapStateToProps)(CategoryContainer)

