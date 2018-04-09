import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css, hover, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const categoryPostSelectorStyle = css(
  s.inlineBlock,
  s.relative,
  s.mr10,
  s.ml10,
  {
    width: 300,
  },
)

const categoriesSelectionsStyle = css(
  select('& .selector, & .selected',
    s.fullWidth,
  ),
  select('& input.selector',
    s.resetInput,
    s.relative,
    s.pr20,
    s.pl20,
    s.zIndex2,
    {
      paddingTop: 9,
      paddingBottom: 9,
      lineHeight: 20,
      border: '1px solid #aaa',
      borderRadius: 0,
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
    },
  ),
  select('& .selector-label',
    s.absolute,
    s.colorA,
    s.zIndex1,
    {
      left: 20,
    },
  ),
)

const categoriesListStyle = css(
  s.absolute,
  s.fullWidth,
  s.p10,
  s.overflowHidden,
  s.overflowScrollWebY,
  s.bgcWhite,
  s.zTools,
  {
    top: 39,
    left: 0,
    maxHeight: 260,
    border: '1px solid #aaa',
    borderRadius: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  select('& .divider',
    s.p0,
    s.m10,
    s.bgcA,
    {
      height: 1,
      border: 0,
    },
  ),
  // list items
  select('& b',
    s.block,
    s.m0,
    s.p5,
    s.pr10,
    s.pl10,
    s.colorA,
    s.sansRegular,
    {
      lineHeight: 20,
    },
  ),
  select('& ul',
    s.resetList,
    select('& li',
      s.m0,
      s.p0,
      select('& button',
        s.block,
        s.p5,
        s.pr10,
        s.pl10,
        s.fullWidth,
        {
          height: 'auto',
          textAlign: 'left',
          lineHeight: 20,
        },
        hover(
          s.colorWhite,
          s.bgcBlack,
          { borderRadius: 3 },
        ),
      ),
      select('& button:active',
        s.colorBlack,
        s.bgcWhite,
      ),
    ),
  ),
)

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
      focused: false,
    }
  }

  componentDidMount() {
    const { onSelect, featuredInCategories } = this.props
    if (featuredInCategories.length > 0) {
      onSelect(featuredInCategories[0])
    }
  }

  // componentDidUpdate() {
  //   console.log(`focused? ${this.state.focused}`)
  // }

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

  handleBlur(isFocused) {
    this.setState({
      focused: isFocused,
    })

    // if (this.props.handleBlur) {
    //   this.props.handleBlur(isFocused)
    // }
  }

  render() {
    const { selectedCategories, onClear, onSelect } = this.props
    const { subscribedCategories, unsubscribedCategories, searchText, selectedIndex } = this.state
    // Everything except this component could support multiple categories, but for now
    // we can assume there is only one selected category per post.
    const selectedCategory = selectedCategories[0]
    const offset = subscribedCategories.length
    return (
      <aside className={categoryPostSelectorStyle}>
        <span className={categoriesSelectionsStyle}>
          {!selectedCategory &&
            <span className="input-with-label">
              {!searchText &&
                <label
                  className="selector-label"
                  htmlFor="categorySelector"
                >
                  Type community name
                </label>
              }
              <input
                className="selector"
                name="categorySelector"
                type="search"
                value={searchText}
                onChange={this.handleSearch}
                onKeyDown={this.handleKeyDown}
                onBlur={() => this.handleBlur(false)}
                onFocus={() => this.handleBlur(true)}
              />
            </span>
          }
          {selectedCategory &&
            <span className="selected">
              <b>{selectedCategory.get('name')}</b>
              <button onClick={onClear}>X</button>
            </span>
          }
        </span>
        <span className={categoriesListStyle}>
          {subscribedCategories.length > 0 &&
            <span className="subscribed">
              <b>Your Categories</b>
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
              <hr className="divider" />
            </span>
          }
          <span className="all">
            <b>All Categories</b>
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
          </span>
        </span>
      </aside>
    )
  }
}
