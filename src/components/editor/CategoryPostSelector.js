import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function filterSearch(categories, searchText) {
  if (searchText === '') { return categories }
  return categories.filter(c => c.get('name').toLowerCase().includes(searchText.toLowerCase()))
}

function CategoryItem({ category, index, selectedIndex, onSelect }) {
  const isSelected = selectedIndex === index
  return (
    <li className={classNames({ isSelected })}>
      <button onClick={() => onSelect(category)}>
        {category.get('name')}
      </button>
    </li>
  )
}

CategoryItem.propTypes = {
  category: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
}

CategoryItem.defaultProps = {
  selectedIndex: null,
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
    this.state = {
      subscribedCategories,
      unsubscribedCategories,
      searchText: '',
      selectedIndex: null,
    }
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

  handleSearch = (event) => {
    const searchText = event.target.value
    const { subscribedCategories, unsubscribedCategories } = this.props
    this.setState({
      selectedIndex: 0,
      searchText,
      subscribedCategories: filterSearch(subscribedCategories, searchText),
      unsubscribedCategories: filterSearch(unsubscribedCategories, searchText),
    })
  }

  handleKeyDown = (event) => {
    const { subscribedCategories, unsubscribedCategories, selectedIndex } = this.state
    const { onSelect } = this.props
    const categories = subscribedCategories.concat(unsubscribedCategories)
    const max = categories.length
    if (event.key === 'ArrowDown' && isNaN(selectedIndex)) {
      this.setState({ selectedIndex: 0 })
    } else if (event.key === 'ArrowDown' && selectedIndex < max) {
      this.setState({ selectedIndex: selectedIndex + 1 })
    } else if (event.key === 'ArrowUp' && !isNaN(selectedIndex) && selectedIndex > 0) {
      this.setState({ selectedIndex: selectedIndex - 1 })
    } else if (event.key === 'Enter' && !isNaN(selectedIndex)) {
      onSelect(categories[selectedIndex])
    }
  }

  render() {
    const { selectedCategories, onClear, onSelect } = this.props
    const { subscribedCategories, unsubscribedCategories, searchText, selectedIndex } = this.state
    // Everything except this component could support multiple categories, but for now
    // we can assume there is only one selected category per post.
    const selectedCategory = selectedCategories[0]
    const offset = subscribedCategories.length
    return (
      <div>
        {!selectedCategory &&
          <input
            type="search"
            value={searchText}
            onChange={this.handleSearch}
            onKeyDown={this.handleKeyDown}
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
              {subscribedCategories.map((category, index) =>
                (<CategoryItem
                  key={`categorySelect:${category.get('id')}`}
                  category={category}
                  index={index}
                  selectedIndex={selectedIndex}
                  onSelect={onSelect}
                />),
              )}
            </ul>
          </div>
        }
        <div>
          <p>All Categories</p>
          <ul>
            {unsubscribedCategories.map((category, index) =>
              (<CategoryItem
                key={`categorySelect:${category.get('id')}`}
                category={category}
                index={index + offset}
                selectedIndex={selectedIndex}
                onSelect={onSelect}
              />),
            )}
          </ul>
        </div>
      </div>
    )
  }
}
