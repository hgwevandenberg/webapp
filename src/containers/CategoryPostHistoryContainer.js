import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CategoryPostHistoryRecord } from '../components/category_posts/CategoryPostRenderables'
import {
  selectPostAuthorUsername,
  selectPostCategoryPosts,
} from '../selectors/post'

function mapStateToProps(state, props) {
  return {
    authorUsername: selectPostAuthorUsername(state, props),
    categoryPosts: selectPostCategoryPosts(state, props),
  }
}

const CategoryPostHistoryContainer = ({ categoryPosts, authorUsername }) => {
  const elems = categoryPosts.map(cp =>
    (
      <CategoryPostHistoryRecord
        key={cp.get('id')}
        authorUsername={authorUsername}
        status={cp.get('status')}
        submittedByUsername={cp.get('submittedByUsername')}
        featuredByUsername={cp.get('featuredByUsername')}
        categorySlug={cp.get('categorySlug')}
        categoryName={cp.get('categoryName')}
      />
    ),
  ).toArray()

  return <div>{elems}</div>
}
CategoryPostHistoryContainer.propTypes = {
  authorUsername: PropTypes.string.isRequired,
  categoryPosts: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(CategoryPostHistoryContainer)
