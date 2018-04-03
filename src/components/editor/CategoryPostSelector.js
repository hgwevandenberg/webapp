import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

function filterSearch(categories, searchText) {
  if (searchText === '') { return categories }
  return categories.filter(c => c.get('name').toLowerCase().includes(searchText.toLowerCase()))
}

export default class CategoryPostSelector extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    subscribedCategories: PropTypes.array.isRequired,
    featuredInCategories: PropTypes.array.isRequired,
    unsubscribedCategories: PropTypes.array.isRequired,
    selectedCategories: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    const { subscribedCategories, unsubscribedCategories } = props
    this.state = { subscribedCategories, unsubscribedCategories, searchText: '' }
  }

  componentDidMount() {
    const { onSelect, featuredInCategories } = this.props
    if (featuredInCategories.length > 0) {
      onSelect(featuredInCategories[0])
    }
  }

  componentWillReceiveProps(nextProps) {
    const { subscribedCategories, unsubscribedCategories } = nextProps
    const { searchText } = this.state
    this.setState({
      subscribedCategories: filterSearch(subscribedCategories, searchText),
      unsubscribedCategories: filterSearch(unsubscribedCategories, searchText),
    })
  }

  onSearch = (event) => {
    const searchText = event.target.value
    const { subscribedCategories, unsubscribedCategories } = this.props
    this.setState({
      searchText,
      subscribedCategories: filterSearch(subscribedCategories, searchText),
      unsubscribedCategories: filterSearch(unsubscribedCategories, searchText),
    })
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
    const { selectedCategories, onClear } = this.props
    const { subscribedCategories, unsubscribedCategories, searchText } = this.state
    // Everything except this component could support multiple categories, but for now
    // we can assume there is only one selected category per post.
    const selectedCategory = selectedCategories[0]
    return (
      <div>
        {!selectedCategory &&
          <input
            type="search"
            value={searchText}
            onChange={this.onSearch}
          />
        }
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
