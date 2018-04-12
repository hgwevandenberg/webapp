import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { scrollToPosition } from './../../lib/jello'
import { css, media, select } from './../../styles/jss'
import * as s from './../../styles/jso'
import {
  ChevronIcon,
  XIcon,
} from '../assets/Icons'

const categoryPostSelectorStyle = css(
  s.inlineBlock,
  s.relative,
  s.mr10,
  s.ml10,
  {
    width: 300,
  },
  media(s.maxBreak2,
    s.m0,
    s.fullWidth,
    { marginBottom: 10 },
  ),
)

const categoriesSelectionsStyle = css(
  { cursor: 'pointer' },
  select('& input', s.resetInput),
  select('& .selector, & .selected',
    s.fullWidth,
    s.block,
    s.pr20,
    s.pl20,
    s.zIndex2,
    {
      cursor: 'pointer',
      paddingTop: 9,
      paddingBottom: 9,
      lineHeight: 20,
      border: '1px solid #aaa',
      borderRadius: 5,
    },
  ),
  // selector
  select('& .selector',
    s.relative,
  ),
  select('&.open .selector',
    {
      cursor: 'text',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
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
  select('& svg.ChevronIcon',
    s.absolute,
    s.block,
    s.colorA,
    s.rotate90,
    s.zIndex1,
    {
      cursor: 'pointer',
      top: 10,
      right: 10,
    },
    // select('& polyline', { fill: '#aaa' }),
  ),
  select('&.open svg.ChevronIcon',
    s.zIndex3,
  ),
  // selected
  select('& .selected',
    {
      cursor: 'default',
      borderColor: '#979797',
    },
    select('& b',
      s.sansRegular,
      {
        lineHeight: 20,
      },
    ),
    select('& button',
      s.absolute,
      {
        right: 15,
      },
    ),
    select('& button span.text', s.displayNone),
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
      ),
      select('& button:active',
        s.colorBlack,
        s.bgcWhite,
      ),

      select('&.isSelected button, & button:hover',
        s.colorWhite,
        s.bgcBlack,
        { borderRadius: 3 },
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
    <li
      id={`categorySelect_${category.get('id')}`}
      className={classNames({ isSelected })}
    >
      <button
        role="option"
        aria-selected={isSelected}
        onClick={() => onSelect(category)}
      >
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
    resetSelection: PropTypes.bool.isRequired,
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
      open: false,
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
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

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.open && this.state.open) ||
      (!this.state.open && !prevState.focused && this.state.focused)) {
      document.addEventListener('mousedown', this.handleClickOutside)
    }

    // close & reset selection
    if (!prevProps.resetSelection && this.props.resetSelection) {
      this.close()
    }

    if (this.state.open &&
      (prevState.selectedIndex !== this.state.selectedIndex)) {
      this.scrollToSelectedCategory()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  handleSearch = (event) => {
    const searchText = event.target.value
    const { subscribedCategories, unsubscribedCategories } = this.props
    const selectedIndex = searchText === '' ? null : 0
    this.setState({
      selectedIndex,
      searchText,
      subscribedCategories: filterSearch(subscribedCategories, searchText),
      unsubscribedCategories: filterSearch(unsubscribedCategories, searchText),
    })
  }

  handleKeyDown = (event) => {
    const { onSelect } = this.props
    const {
      subscribedCategories,
      unsubscribedCategories,
      selectedIndex,
    } = this.state
    const categories = subscribedCategories.concat(unsubscribedCategories)
    const max = categories.length
    const selectedIsNull = (selectedIndex === null)

    if (event.key === 'ArrowDown' && selectedIsNull) {
      this.setState({ selectedIndex: 0 })
    } else if (event.key === 'ArrowDown' && selectedIndex === (max - 1)) {
      this.setState({ selectedIndex: 0 })
    } else if (event.key === 'ArrowDown' && selectedIndex < max) {
      this.setState({ selectedIndex: selectedIndex + 1 })
    } else if (event.key === 'ArrowUp' && !selectedIsNull && selectedIndex > 0) {
      event.preventDefault()
      this.setState({ selectedIndex: selectedIndex - 1 })
    } else if (event.key === 'ArrowUp' && !selectedIsNull && selectedIndex === 0) {
      event.preventDefault()
      this.setState({ selectedIndex: max - 1 })
    } else if (event.key === 'Enter' && !selectedIsNull) {
      onSelect(categories[selectedIndex])
    } else if (event.key === 'Escape') {
      this.categorySelectorRef.blur()
      this.close()
    }
  }

  handleBlur(isFocused) {
    this.setState({
      focused: isFocused,
    })

    if (isFocused) {
      this.open()
    }
  }

  handleSelectorClick(e) {
    const { selectedCategories } = this.props
    if (!selectedCategories) {
      return this.open()
    }
    if (e.target.nodeName === 'polyline' ||
      e.target.nodeName === 'g' ||
      e.target.nodeName === 'svg') {
      return this.close()
    }
    return null
  }

  handleClickOutside(event) {
    if (this.state.open) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.close()
      }
    }
  }

  scrollToSelectedCategory() {
    const {
      subscribedCategories,
      unsubscribedCategories,
      selectedIndex,
    } = this.state
    const categories = subscribedCategories.concat(unsubscribedCategories)
    const selectedCategory = categories[selectedIndex]
    let selectedCategoryDomId = null
    if (selectedCategory) {
      selectedCategoryDomId = `categorySelect_${selectedCategory.get('id')}`
    }

    // grab elements from the dom
    const categoryListInDom = document.getElementById('categoryList')
    const selectedCategoryItemInDom = document.getElementById(selectedCategoryDomId)

    // determine scroll offset of category item in dom
    let categoryItemInDomTopOffset = null
    let categoryListInDomTopOffset = null
    let categoryItemInDomHeight = null
    let categoryListInDomHeight = null
    if (selectedCategoryDomId) {
      categoryItemInDomTopOffset = selectedCategoryItemInDom.getBoundingClientRect().top
      categoryListInDomTopOffset = categoryListInDom.getBoundingClientRect().top
      categoryItemInDomHeight = selectedCategoryItemInDom.clientHeight
      categoryListInDomHeight = categoryListInDom.clientHeight
    }

    if (categoryItemInDomTopOffset) {
      // adjust scroll offset for window height / nav bar
      const scrollElement = categoryListInDom
      const scrollTo = (categoryItemInDomTopOffset - categoryListInDomTopOffset)
      const scrollCheckOffset = categoryItemInDomHeight

      if (
        ((scrollTo + scrollCheckOffset) > categoryListInDomHeight) ||
        (scrollTo < 0)
      ) {
        // scroll to new position
        scrollToPosition(0, scrollTo, { el: scrollElement, duration: 150 })
      }
    }
  }

  open() {
    if (!this.state.open) {
      this.setState({
        open: true,
      })
    }
  }

  close() {
    if (this.state.open) {
      this.resetSelection()
    }
  }

  resetSelection() {
    const { subscribedCategories, unsubscribedCategories } = this.props
    this.setState({
      subscribedCategories,
      unsubscribedCategories,
      searchText: '',
      selectedIndex: null,
      focused: false,
      open: false,
    })
  }

  render() {
    const { selectedCategories, onClear, onSelect } = this.props
    const {
      subscribedCategories,
      unsubscribedCategories,
      searchText,
      selectedIndex,
      open,
    } = this.state
    // Everything except this component could support multiple categories, but for now
    // we can assume there is only one selected category per post.
    const selectedCategory = selectedCategories[0]
    const offset = subscribedCategories.length
    return (
      /* eslint-disable jsx-a11y/interactive-supports-focus */
      <aside
        ref={this.setWrapperRef}
        className={categoryPostSelectorStyle}
        role="searchbox"
        onClick={e => this.handleSelectorClick(e)}
      >
        <span className={classNames({ open }, `${categoriesSelectionsStyle}`)}>
          {!selectedCategory &&
            <span className="input-with-label">
              {!searchText &&
                <label
                  className="selector-label"
                  htmlFor="categorySelector"
                >
                  {open ? 'Type community name' : 'Choose Community'}
                </label>
              }
              <ChevronIcon />
              <input
                ref={(node) => { this.categorySelectorRef = node }}
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
              <button onClick={onClear}>
                <span className="text">Remove</span>
                <span className="icon">
                  <XIcon />
                </span>
              </button>
            </span>
          }
        </span>
        {open &&
          <span
            id="categoryList"
            className={categoriesListStyle}
          >
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
        }
      </aside>
    )
  }
}
