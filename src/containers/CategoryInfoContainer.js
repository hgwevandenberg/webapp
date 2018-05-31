import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setIsCategoryDrawerOpen } from '../actions/gui'
import { followCategories } from '../actions/profile'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsCategoryDrawerOpen } from '../selectors/gui'
import { selectCategoryForPath, selectCategoryName, selectCategoryUsers } from '../selectors/categories'
import { selectSubscribedCategoryIds } from '../selectors/profile'
import { CategoryInfo } from '../components/categories/CategoryRenderables'

function mapStateToProps(state, props) {
  const category = selectCategoryForPath(state, props)
  const categoryId = category.get('id')
  const isLoggedIn = selectIsLoggedIn(state)
  const subscribedIds = selectSubscribedCategoryIds(state, props)

  return {
    category,
    categoryId,
    categoryUsers: selectCategoryUsers(state, { categoryId }),
    collapsed: !selectIsCategoryDrawerOpen(state),
    isLoggedIn,
    name: selectCategoryName(state, props),
    subscribedIds,
    isSubscribed: !!categoryId && !!isLoggedIn && subscribedIds.includes(categoryId),
  }
}

class CategoryInfoContainer extends PureComponent {
  static propTypes = {
    category: PropTypes.object.isRequired,
    categoryId: PropTypes.number.isRequired,
    categoryUsers: PropTypes.object.isRequired,
    collapsed: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    subscribedIds: PropTypes.object.isRequired,
  }

  handleTriggerClick(e) {
    e.preventDefault()

    const { collapsed } = this.props
    this.props.dispatch(setIsCategoryDrawerOpen({ isOpen: collapsed }))
  }

  subscribe = (e) => {
    const { isLoggedIn, categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    if (!isLoggedIn) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('subscribe-from-page-header')
    } else {
      const catIds = subscribedIds.push(categoryId)
      dispatch(followCategories(catIds, true))
    }
  }

  unsubscribe = (e) => {
    const { categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    const catIds = subscribedIds.filter(id => id !== categoryId)
    dispatch(followCategories(catIds, true))
  }

  render() {
    const {
      category,
      categoryUsers,
      collapsed,
      isSubscribed,
      name,
    } = this.props

    return (
      <CategoryInfo
        category={category}
        categoryUsers={categoryUsers}
        collapsed={collapsed}
        handleTriggerClick={e => this.handleTriggerClick(e)}
        isSubscribed={isSubscribed}
        name={name}
        subscribe={this.subscribe}
        unsubscribe={this.unsubscribe}
      />
    )
  }
}

export default connect(mapStateToProps)(CategoryInfoContainer)
