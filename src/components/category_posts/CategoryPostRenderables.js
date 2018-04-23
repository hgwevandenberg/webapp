import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { BadgeFeaturedIcon } from '../assets/Icons'

export class CategoryPostHistoryRecord extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    authorUsername: PropTypes.string.isRequired,
    categorySlug: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
    submittedByUsername: PropTypes.string,
    featuredByUsername: PropTypes.string,
  }

  static defaultProps = {
    submittedByUsername: null,
    featuredByUsername: null,
  }

  statusIcon() {
    const { status } = this.props
    const color = status === 'submitted' ? '#aaaaaa' : '#00D101'
    return <BadgeFeaturedIcon color={color} size={30} />
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
