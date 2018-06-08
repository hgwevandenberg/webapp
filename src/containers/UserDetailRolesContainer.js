import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { setIsProfileRolesActive } from '../actions/gui'
import UserDetailRoles from '../components/users/UserRolesRenderables'
import { SHORTCUT_KEYS } from '../constants/application_types'

// export function mapStateToProps(state) {
//   return {
//     classList: state.modal.get('classList'),
//   }
// }

class UserDetailRolesContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    sampleProp: PropTypes.string,
  }

  static defaultProps = {
    sampleProp: 'I could be used for something.',
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
      sampleProp,
    } = this.props

    return (
      <UserDetailRoles
        close={() => this.close()}
        isOpen={isOpen}
        handleMaskClick={e => this.handleMaskClick(e)}
        sampleProp={sampleProp}
      />
    )
  }
}

// export default connect(mapStateToProps)(UserDetailRolesContainer)
export default connect()(UserDetailRolesContainer)
