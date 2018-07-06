import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { selectInnerWidth, selectIsCategoryDrawerOpen } from '../selectors/gui'
// import { selectCategoryForPath, selectCategoryUsers } from '../selectors/categories'
// import { selectRandomPageHeader } from '../selectors/page_headers'
import { CategoryAddRoleTrigger, CategoryRoleUserPicker } from '../components/categories/CategoryRolesRenderables'

// function mapStateToProps(state) {
//   return {
//     collapsed: !selectIsCategoryDrawerOpen(state),
//   }
// }

class CategoryRolesContainer extends PureComponent {
  static propTypes = {
    roleType: PropTypes.string,
  }
  static defaultProps = {
    roleType: 'curator',
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

  render() {
    const { roleType } = this.props
    const { userPickerOpen } = this.state

    return (
      <div className="roles-holder">
        <CategoryAddRoleTrigger
          handleTriggerClick={() => this.openCloseUserPicker()}
          type={roleType}
        />
        <CategoryRoleUserPicker
          close={() => this.openCloseUserPicker(false)}
          handleMaskClick={e => this.handleMaskClick(e)}
          isOpen={userPickerOpen}
          roleType={roleType}
        />
      </div>
    )
  }
}

// export default connect(mapStateToProps)(CategoryRolesContainer)
export default connect()(CategoryRolesContainer)
