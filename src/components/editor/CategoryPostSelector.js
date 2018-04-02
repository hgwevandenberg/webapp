import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class CategoryPostSelector extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    subscribedCategories: PropTypes.array.isRequired,
    featuredInCategories: PropTypes.array.isRequired,
    unsubscribedCategories: PropTypes.array.isRequired,
    selectedCategories: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { onSelect, featuredInCategories } = this.props
    if (featuredInCategories.length > 0) {
      onSelect(featuredInCategories[0])
    }
  }

  categoryItem = (category) => {
    const { onSelect } = this.props
    return (
      <li key={`categorySelect:${category.get('id')}`}>
        <button onClick={() => onSelect(category)}>
          {category.get('name')}
        </button>
      </li>
    )
  }

  render() {
    const { subscribedCategories, unsubscribedCategories, selectedCategories, onClear } = this.props
    // Everything except this component could support multiple categories, but for now
    // we can assume there is only one selected category per post.
    const selectedCategory = selectedCategories[0]
    return (
      <div>
        {selectedCategory &&
          <div>
            <p>{selectedCategory.get('name')}</p>
            <button onClick={onClear}>X</button>
          </div>
        }
        {subscribedCategories.length > 0 &&
          <div>
            <p>Your Categories</p>
            <ul>
              {subscribedCategories.map(c => this.categoryItem(c))}
            </ul>
          </div>
        }
        <div>
          <p>All Categories</p>
          <ul>
            {unsubscribedCategories.map(c => this.categoryItem(c))}
          </ul>
        </div>
      </div>
    )
  }
}
