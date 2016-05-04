import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { random } from 'lodash'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotions/authentication'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class SignUp extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.state = {
      featuredUser: userlist[index],
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { featuredUser } = this.state
    return (
      <main className="Authentication View" role="main">
        <div className="AuthenticationFormDialog">
          <RegistrationRequestForm />
        </div>
        <AppleStoreLink />
        <Credits onClick={ this.onClickTrackCredits } user={ featuredUser } />
        <Cover coverImage={ featuredUser.coverImage } modifiers="asFullScreen withOverlay" />
      </main>
    )
  }
}

export default connect()(SignUp)

