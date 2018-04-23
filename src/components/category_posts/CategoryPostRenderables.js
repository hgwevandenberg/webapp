import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { FeatureCategoryPostTool } from '../posts/PostTools'

export class CategoryPostHistoryRecord extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    authorUsername: PropTypes.string.isRequired,
    categorySlug: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
    submittedByUsername: PropTypes.string,
    featuredByUsername: PropTypes.string,
    actions: PropTypes.object,
    fireAction: PropTypes.func.isRequired,
  }

  static defaultProps = {
    submittedByUsername: null,
    featuredByUsername: null,
    actions: null,
  }

  statusIcon() {
    const { status, actions, fireAction } = this.props
    return (
      <FeatureCategoryPostTool
        status={status}
        actions={actions}
        fireAction={fireAction}
      />
    )
  }

  featuredElement() {
    const {
      status,
      featuredByUsername,
    } = this.props
    if (status === 'featured' && featuredByUsername) {
      return (
        <span>
          Featured by <Link to={`/${featuredByUsername}`}>@{featuredByUsername}</Link>.
        </span>
      )
    } else if (status === 'featured') {
      return <span>Featured by <Link to="/ello">@ello</Link></span>
    }
    return null
  }

  submittedElement() {
    const {
      submittedByUsername,
      authorUsername,
      categorySlug,
      categoryName,
    } = this.props
    if (submittedByUsername === authorUsername) {
      return (
        <span>
          Posted into&nbsp;
          <Link to={`/discover/${categorySlug}`}>{categoryName}</Link>.
        </span>
      )
    }
    return (
      <span>
        Nominated to
        <Link to={`/discover/${categorySlug}`}>{categoryName}</Link> by
        <Link to={`/${submittedByUsername}`}>{submittedByUsername}</Link>.
      </span>
    )
  }

  render() {
    const { status } = this.props
    if (status === 'removed') { return null }
    return (
      <p>
        {this.statusIcon()}
        {this.featuredElement()}&nbsp;
        {this.submittedElement()}
      </p>
    )
  }
}

export default CategoryPostHistoryRecord
