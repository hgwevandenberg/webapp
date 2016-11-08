import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import debounce from 'lodash/debounce'
import { hideSoftKeyboard } from '../../lib/jello'
import {
  selectLinksAsText,
  selectLocation,
  selectName,
  selectShortBio,
  selectUsername,
} from '../../selectors/profile'
import { selectIsCompleterActive } from '../../selectors/gui'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { saveProfile } from '../../actions/profile'
import BioControl from '../forms/BioControl'
import NameControl from '../forms/NameControl'
import LinksControl from '../forms/LinksControl'
import TextControl from '../forms/TextControl'
import { isValidURL } from '../forms/Validators'

function mapStateToProps(state) {
  return {
    isCompleterActive: selectIsCompleterActive(state),
    linksText: selectLinksAsText(state),
    location: selectLocation(state),
    name: selectName(state),
    shortBio: selectShortBio(state),
    username: selectUsername(state),
  }
}

class InfoForm extends Component {

  static propTypes = {
    className: PropTypes.string,
    controlClassModifiers: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    linksText: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
    shortBio: PropTypes.string,
    tabIndexStart: PropTypes.number,
    username: PropTypes.string,
  }

  static defaultProps = {
    tabIndexStart: 0,
  }

  componentWillMount() {
    this.state = {
      bioStatus: STATUS.INDETERMINATE,
      linksStatus: STATUS.INDETERMINATE,
      locationStatus: STATUS.INDETERMINATE,
      nameStatus: STATUS.INDETERMINATE,
      showThenHideMessage: false,
    }

    this.nameText = ''
    this.shortBioText = ''
    this.linkText = ''
    this.locationText = ''

    this.saveForm = debounce(this.saveForm, 300)
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { linksText, location, name, shortBio } = nextProps
    this.linksText = linksText || ''
    this.locationText = location || ''
    this.nameText = name || ''
    this.shortBioText = shortBio || ''
    this.setState({
      bioStatus: this.shortBioText.length ? STATUS.SUCCESS : STATUS.INDETERMINATE,
      linksStatus: this.getLinksStatus(),
      locationStatus: this.locationText.length ? STATUS.SUCCESS : STATUS.INDETERMINATE,
      nameStatus: this.nameText.length ? STATUS.SUCCESS : STATUS.INDETERMINATE,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onChangeControl = (vo, prop) => {
    const status = this.state[prop]
    const value = Object.values(vo)[0]
    const hasValue = !!(value.length)
    if (status !== STATUS.INDETERMINATE && !hasValue && status !== STATUS.SUCCESS) {
      this.setState({ [prop]: STATUS.INDETERMINATE })
    } else if (status !== STATUS.REQUEST) {
      if (prop === 'linksStatus' && /\s$/.test(value)) {
        this.setState({ [prop]: status })
      } else {
        this.setState({ [prop]: STATUS.REQUEST })
      }
    }
    this.saveForm()
  }

  onChangeNameControl = (vo) => {
    this.nameText = Object.values(vo)[0]
    this.onChangeControl(vo, 'nameStatus')
  }

  onChangeBioControl = (vo) => {
    this.shortBioText = Object.values(vo)[0]
    this.onChangeControl(vo, 'bioStatus')
  }

  onChangeLinksControl = (vo) => {
    this.linksText = Object.values(vo)[0]
    this.onChangeControl(vo, 'linksStatus')
  }

  onChangeLocationControl = (vo) => {
    this.locationText = Object.values(vo)[0]
    this.onChangeControl(vo, 'locationStatus')
  }

  onSubmit(e) {
    e.preventDefault()
    hideSoftKeyboard()
  }

  getLinksStatus() {
    if (this.linksText.length === 0) {
      return STATUS.INDETERMINATE
    }
    const linkArr = this.linksText.split(/[,\s]+/)
    const isValid = linkArr.every(link => (link.length ? isValidURL(link) : true))
    return isValid ? STATUS.SUCCESS : STATUS.FAILURE
  }

  saveForm() {
    const { dispatch, linksText } = this.props
    const vo = {
      location: this.locationText,
      name: this.nameText,
      unsanitized_short_bio: this.shortBioText,
    }
    const linksStatus = this.getLinksStatus()
    if (this.linksText !== linksText &&
        (linksStatus === STATUS.SUCCESS || /^\s?$/.test(this.linksText))) {
      vo.external_links = this.linksText
    }
    dispatch(saveProfile(vo))
    this.setState({ linksStatus })
  }

  render() {
    const { bioStatus, linksStatus, locationStatus, nameStatus } = this.state
    const {
      className,
      controlClassModifiers,
      linksText,
      location,
      name,
      shortBio,
      tabIndexStart,
      username,
    } = this.props
    if (!username) {
      return null
    }
    return (
      <form
        className={classNames(className, 'InfoForm')}
        noValidate="novalidate"
        onSubmit={this.onSubmit}
        role="form"
      >
        <NameControl
          classList={controlClassModifiers}
          onChange={this.onChangeNameControl}
          status={nameStatus}
          tabIndex={`${tabIndexStart}`}
          text={name || ''}
        />
        <TextControl
          classList={classNames(controlClassModifiers, 'LocationControl', 'text')}
          id="location"
          label="Location"
          name="user[location]"
          onChange={this.onChangeLocationControl}
          placeholder="Location"
          status={locationStatus}
          tabIndex={`${tabIndexStart + 1}`}
          text={location || ''}
        />
        <BioControl
          classList={controlClassModifiers}
          onChange={this.onChangeBioControl}
          status={bioStatus}
          tabIndex={`${tabIndexStart + 2}`}
          text={shortBio || ''}
        />
        <LinksControl
          classList={controlClassModifiers}
          onChange={this.onChangeLinksControl}
          status={linksStatus}
          tabIndex={`${tabIndexStart + 3}`}
          text={linksText}
        />
      </form>
    )
  }
}

export default connect(mapStateToProps)(InfoForm)

