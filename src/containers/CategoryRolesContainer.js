import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { selectInnerWidth, selectIsCategoryDrawerOpen } from '../selectors/gui'
// import { selectCategoryForPath, selectCategoryUsers } from '../selectors/categories'
// import { selectRandomPageHeader } from '../selectors/page_headers'
import CategoryRoleUserPicker from '../components/categories/CategoryRolesRenderables'

// function mapStateToProps(state) {
//   return {
//     collapsed: !selectIsCategoryDrawerOpen(state),
//   }
// }

class CategoryRolesContainer extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
  }
  static defaultProps = {
    name: 'Category',
  }

  render() {
    const { name } = this.props

    return (
      <CategoryRoleUserPicker name={name} isOpen />
    )
  }
}

// export default connect(mapStateToProps)(CategoryRolesContainer)
export default connect()(CategoryRolesContainer)
