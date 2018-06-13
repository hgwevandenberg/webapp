import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { setIsProfileRolesActive } from '../actions/gui'
import UserDetailRoles from '../components/users/UserRolesRenderables'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectUserCategoryUsers } from '../selectors/user'

export function mapStateToProps(state, props) {
  return {
    classList: state.modal.get('classList'),
    categoryUsers: selectUserCategoryUsers(state, props),
  }
}

class UserDetailRolesContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    sampleProp: PropTypes.string,
    categoryUsers: PropTypes.object.isRequired,
  }

  static defaultProps = {
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
  }

  // componentDidUpdate() {
  // }

  componentWillUnmount() {
    this.close()
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  close() {
    this.props.dispatch(setIsProfileRolesActive({ isActive: false }))
  }

  handleMaskClick(e) {
    if (e.target.classList.contains('mask')) {
      return this.close()
    }
    return null
  }

  render() {
    const {
      isOpen,
      categoryUsers,
    } = this.props

    return (
      <UserDetailRoles
        close={() => this.close()}
        isOpen={isOpen}
        handleMaskClick={e => this.handleMaskClick(e)}
        categoryUsers={categoryUsers}
      />
    )
  }
}

export default connect(mapStateToProps)(UserDetailRolesContainer)
