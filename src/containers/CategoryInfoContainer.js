import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setIsCategoryDrawerOpen } from '../actions/gui'
import { selectIsCategoryDrawerOpen } from '../selectors/gui'
import { selectCategoryName } from '../selectors/categories'
import { CategoryInfo } from '../components/categories/CategoryRenderables'

function mapStateToProps(state, props) {
  return {
    collapsed: !selectIsCategoryDrawerOpen(state),
    name: selectCategoryName(state, props),
  }
}

class CategoryInfoContainer extends PureComponent {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }

  // static defaultProps = {
  //   tileImageUrl: null,
  // }

  handleTriggerClick(e) {
    e.preventDefault()

    const { collapsed } = this.props
    this.props.dispatch(setIsCategoryDrawerOpen({ isOpen: collapsed }))
  }

  render() {
    const { collapsed, name } = this.props
    return (
      <CategoryInfo
        collapsed={collapsed}
        handleTriggerClick={e => this.handleTriggerClick(e)}
        name={name}
      />
    )
  }
}

export default connect(mapStateToProps)(CategoryInfoContainer)
