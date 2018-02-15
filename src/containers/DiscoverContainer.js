import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  bindDiscoverKey,
  getCategories,
  loadCategoryPosts,
  loadDiscoverPosts,
} from '../actions/discover'
import { Discover } from '../components/views/Discover'
import { selectParamsType } from '../selectors/params'
import { selectPropsPathname } from '../selectors/routing'

export function getStreamAction(type) {
  switch (type) {
    case 'featured':
    case 'recommended':
      return loadCategoryPosts()
    case 'recent':
    case 'trending':
      return loadDiscoverPosts(type)
    case 'all':
      return getCategories()
    default:
      return loadCategoryPosts(type)
  }
}

function mapStateToProps(state, props) {
  return {
    paramsType: selectParamsType(state, props),
    pathname: selectPropsPathname(state, props),
  }
}

class DiscoverContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    paramsType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    paramsType: 'featured',
  }

  componentWillMount() {
    const { dispatch, paramsType } = this.props
    dispatch(bindDiscoverKey(paramsType))
  }

  componentDidUpdate(prevProps) {
    const { dispatch, paramsType, pathname } = this.props
    if (prevProps.pathname !== pathname) {
      dispatch(bindDiscoverKey(paramsType))
    }
  }

  render() {
    const { paramsType } = this.props
    return (
      <Discover
        inAllCategories={paramsType === 'all'}
        key={`discover_${paramsType}`}
        streamAction={getStreamAction(paramsType)}
      />
    )
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

