import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { removeFromCategory } from '../actions/user'
import { selectCategoryUsers } from '../selectors/categories'
import { selectId, selectHasRoleAssignmentAccess } from '../selectors/profile'
import { CategoryAddRemoveRoleButton, CategoryRoleUserPicker } from '../components/categories/CategoryRolesRenderables'

function mapStateToProps(state, props) {
  return {
    categoryUsers: selectCategoryUsers(state, props),
    currentUserId: selectId(state, props),
    hasAssignmentAccess: selectHasRoleAssignmentAccess(state, props),
  }
}

class CategoryRolesContainer extends PureComponent {
  static propTypes = {
    actionType: PropTypes.oneOf(['add', 'remove']),
    categoryId: PropTypes.string.isRequired,
    categoryUsers: PropTypes.array,
    currentUserId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    hasAssignmentAccess: PropTypes.bool.isRequired,
    roleType: PropTypes.string,
    userId: PropTypes.string,
  }
  static defaultProps = {
    actionType: 'add',
    categoryUsers: null,
    currentUserId: null,
    roleType: 'curators',
    userId: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      userPickerOpen: false,
    }
  }

  openCloseUserPicker(setOpen = true) {
    this.setState({
      userPickerOpen: setOpen,
    })
  }

  handleMaskClick(e) {
    if (e.target.classList.contains('mask')) {
      return this.openCloseUserPicker(false)
    }
    return null
  }

  removeRole() {
    const {
      categoryUsers,
      dispatch,
      userId,
    } = this.props

    let categoryUserId = null
    categoryUsers.map((categoryUser) => {
      if (userId === categoryUser.get('userId')) {
        categoryUserId = categoryUser.get('id')
      }
      return categoryUserId
    })

    if (categoryUserId) {
      return dispatch(removeFromCategory(categoryUserId))
    }
    return null
  }

  render() {
    const {
      actionType,
      categoryId,
      currentUserId,
      hasAssignmentAccess,
      roleType,
      userId,
    } = this.props
    const { userPickerOpen } = this.state

    if (!hasAssignmentAccess) { return null }

    // add moderator or curator
    if (actionType === 'add') {
      return (
        <div className="roles-holder">
          <CategoryAddRemoveRoleButton
            actionType="add"
            handleClick={() => this.openCloseUserPicker()}
            roleType={roleType}
          />
          <CategoryRoleUserPicker
            categoryId={categoryId}
            close={() => this.openCloseUserPicker(false)}
            handleMaskClick={e => this.handleMaskClick(e)}
            isOpen={userPickerOpen}
            roleType={roleType}
          />
        </div>
      )
    }

    // remove moderator / curator
    if (userId && (userId !== currentUserId)) {
      return (
        <CategoryAddRemoveRoleButton
          actionType={actionType}
          handleClick={() => this.removeRole()}
          roleType={roleType}
          userId={userId}
        />
      )
    }

    return null
  }
}

export default connect(mapStateToProps)(CategoryRolesContainer)
