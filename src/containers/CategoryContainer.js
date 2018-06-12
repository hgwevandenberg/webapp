import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CategoryCard } from '../components/categories/CategoryRenderables'
import {
  selectCategoryName,
  selectCategorySlug,
  selectCategoryTileImageUrl,
  selectCategoryIsSubscribed,
  selectCategoryIsPromo,
} from '../selectors/categories'

function mapStateToProps(state, props) {
  return {
    name: selectCategoryName(state, props),
    slug: selectCategorySlug(state, props),
    tileImageUrl: selectCategoryTileImageUrl(state, props),
    isSubscribed: selectCategoryIsSubscribed(state, props),
    isPromo: selectCategoryIsPromo(state, props),
  }
}

class CategoryContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    tileImageUrl: PropTypes.string,
    isSubscribed: PropTypes.bool.isRequired,
    isPromo: PropTypes.bool.isRequired,
    categoryId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    tileImageUrl: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
  }

  render() {
    const {
      categoryId,
      isSubscribed,
      isPromo,
      name,
      slug,
      tileImageUrl,
    } = this.props
    return (
      <CategoryCard
        categoryId={categoryId}
        name={name}
        imageUrl={tileImageUrl}
        to={`/discover/${slug}`}
        isSubscribed={isSubscribed}
        isPromo={isPromo}
      />
    )
  }
}

export default connect(mapStateToProps)(CategoryContainer)

