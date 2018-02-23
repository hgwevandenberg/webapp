import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCategories } from '../actions/discover'
import { selectOrderedCategoryIds } from '../selectors/categories'
import CategoryContainer from './CategoryContainer'
import { MainView } from '../components/views/MainView'
import { css, media } from '../styles/jss'
import * as s from '../styles/jso'

function mapStateToProps(state, props) {
  return {
    categoryIds: selectOrderedCategoryIds(state, props).toJS(),
  }
}

const categoriesStyle = css(
  s.flex,
  s.flexRow,
  s.flexWrap,
  s.mt10,
  { marginLeft: -20 },
  media(s.minBreak4, s.mt20, { marginLeft: -40 }),
)

class DiscoverAllContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    categoryIds: PropTypes.array,
  }

  static defaultProps = {
    categoryIds: null,
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getCategories())
  }

  render() {
    const { categoryIds } = this.props
    if (!categoryIds) { return null }
    return (
      <MainView className="Discover">
        <div className={categoriesStyle}>
          {categoryIds.map(id => <CategoryContainer categoryId={id} key={`category-grid-${id}`} />)}
        </div>
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(DiscoverAllContainer)

