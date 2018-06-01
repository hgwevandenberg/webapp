import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectIsCategoryDrawerOpen } from '../selectors/gui'
import { selectCategoryForPath, selectCategoryUsers } from '../selectors/categories'
import { CategoryInfo } from '../components/categories/CategoryRenderables'

function mapStateToProps(state, props) {
  const category = selectCategoryForPath(state, props)
  const categoryId = category.get('id')
  const categoryName = category.get('name')

  return {
    category,
    categoryId,
    categoryUsers: selectCategoryUsers(state, { categoryId }),
    collapsed: !selectIsCategoryDrawerOpen(state),
    name: categoryName,
  }
}

class CategoryInfoContainer extends PureComponent {
  static propTypes = {
    category: PropTypes.object.isRequired,
    categoryUsers: PropTypes.object.isRequired,
    collapsed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }

  render() {
    const {
      category,
      categoryUsers,
      collapsed,
      name,
    } = this.props

    return (
      <CategoryInfo
        category={category}
        categoryUsers={categoryUsers}
        collapsed={collapsed}
        name={name}
      />
    )
  }
}

export default connect(mapStateToProps)(CategoryInfoContainer)
