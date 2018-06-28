import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { DismissButtonLG } from './../buttons/Buttons'
import { FilterSelectorControl } from './../forms/FilterSelectorControl'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const userDetailRolesModalStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .mask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },

    media(s.minBreak2,
      s.flex,
      s.itemsCenter,
      s.justifyCenter,
    ),
  ),
)
const userDetailRolesStyle = css(
  s.relative,
  s.block,
  s.pt20,
  s.pb10,
  s.mt40,
  s.colorBlack,
  s.fullWidth,
  s.leftAlign,
  s.bgcWhite,
  {
    maxWidth: 780,
    borderRadius: 5,
  },

  media(s.minBreak2,
    s.m0,
    s.pt40,
    { width: '80%' },
  ),
  media(s.minBreak4,
    { width: '60%' },
  ),

  select('& .CloseModal',
    s.colorA,
    { top: 14, right: 20 },
    hover(s.colorBlack),

    media(s.maxBreak2,
      { top: 7, right: 7 },
    ),
  ),

  select('& h1',
    s.sansBlack,
    s.fontSize24,
  ),

  select('& .assign-roles',
    s.pb10,
    s.pr20,
    s.pl20,

    select('& .fs-rolePicker',
      s.ml10,
      { width: 200 },
    ),
  ),
  select('& .user-roles',
    s.pt20,
    s.pr20,
    s.pl20,
    s.resetList,
    s.borderTop,
    { borderColor: '#f2f2f2' },
  ),
)

const roleName = {
  FEATURED: 'Featured User',
  CURATOR: 'Curator',
  MODERATOR: 'Moderator',
}

export default function UserDetailRoles({
  close,
  handleMaskClick,
  isOpen,
  categoryUsers,
  administeredCategories,
  searchCategories,
  userId,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={userDetailRolesModalStyle}>
      <div className="mask" role="presentation" onClick={handleMaskClick}>
        <div className={`${userDetailRolesStyle} content`}>
          <DismissButtonLG
            onClick={close}
          />
          <div className="assign-roles">
            <h1>Role Administrator</h1>
            <CategoryUserForm
              administeredCategories={administeredCategories}
              userId={userId}
              searchCategories={searchCategories}
            />
          </div>
          <ul className="user-roles">
            {categoryUsers.map(cu => (
              <UserRole
                key={cu.get('id')}
                name={roleName[cu.get('role')]}
                categoryName={cu.get('categoryName')}
                categorySlug={cu.get('categorySlug')}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
UserDetailRoles.propTypes = {
  close: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  categoryUsers: PropTypes.object.isRequired,
  administeredCategories: PropTypes.object.isRequired,
  searchCategories: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}

const userRoleStyle = css(
  s.flex,
  s.justifySpaceBetween,
  s.fullWidth,
  s.mb10,
  s.bgcF2,
  { padding: '6px 8px 2px 8px' },
)

function UserRole({
  categoryName,
  categorySlug,
  name,
}) {
  return (
    <li className={userRoleStyle}>
      <span className="meta">
        {name} in&nbsp;
        <Link to={`/discover/${categorySlug}`}>{categoryName}</Link>
      </span>
      <span className="controls">
        controls
      </span>
    </li>
  )
}
UserRole.propTypes = {
  name: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
}

const formStyle = css(
  s.flex,
  s.justifySpaceBetween,
  s.fullWidth,
  s.mt30,

  select('& .selectors',
    s.flex,
    s.justifyStart,
    select('& .fs',
      s.block,
    ),
  ),
)

class CategoryUserForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedCategories: [],
      selectedRoles: [],
    }
    this.onSelectCategory = this.onSelectCategory.bind(this)
    this.onClearCategory = this.onClearCategory.bind(this)
    this.onSelectRole = this.onSelectRole.bind(this)
    this.onClearRole = this.onClearRole.bind(this)
  }

  onSelectCategory(item) {
    // abandoning multi-select for now
    // const { selectedCategories } = this.state
    const selectedCategories = []
    selectedCategories.push(item)

    this.setState({ selectedCategories })
  }

  onClearCategory() {
    this.setState({
      selectedCategories: [],
    })
  }

  onSelectRole(item) {
    // abandoning multi-select for now
    // const { selectedRoles } = this.state
    const selectedRoles = []
    selectedRoles.push(item)

    this.setState({ selectedRoles })
  }

  onClearRole() {
    this.setState({
      selectedRoles: [],
    })
  }

  render() {
    const {
      administeredCategories,
      userId,
      searchCategories,
    } = this.props

    const {
      selectedCategories,
      selectedRoles,
    } = this.state

    const userRoles = Immutable.fromJS([
      { id: 'FEATURED_USER', name: 'Featured User' },
      { id: 'CURATOR', name: 'Curator' },
      { id: 'MODERATOR', name: 'Moderator' },
    ])

    if (administeredCategories.count() < 1) {
      return null
    }

    return (
      <form className={formStyle}>
        <div className="selectors">
          <FilterSelectorControl
            searchCallback={searchCategories}
            labelText="Choose Category"
            listItems={administeredCategories}
            onSelect={this.onSelectCategory}
            onClear={this.onClearCategory}
            searchPromptText="Type category name"
            selectedItems={selectedCategories}
            type="roleCategoryPicker"
          />
          <FilterSelectorControl
            labelText="Choose position"
            listItems={userRoles}
            onSelect={this.onSelectRole}
            onClear={this.onClearRole}
            searchPromptText="Type position"
            selectedItems={selectedRoles}
            type="rolePicker"
          />
        </div>
        <p>
          form needs to send:<br />
          userId - {userId}<br />
          categoryId<br />
          role
        </p>
      </form>
    )
  }
}
CategoryUserForm.propTypes = {
  administeredCategories: PropTypes.object.isRequired,
  searchCategories: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}
