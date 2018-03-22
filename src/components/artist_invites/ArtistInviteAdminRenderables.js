/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router'
import { css, hover, media, modifier, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

// const selectionTabSwitcherStyle = css(

// )

const buttonStyle = css(
  s.colorA,
  s.fontSize24,
  s.inlineBlock,
  s.sansBlack,
  s.truncate,
  media(s.minBreak3, s.mb20, parent('.ArtistInvitesDetail', s.mb0, s.fontSize38)),
  s.borderBottom,
  s.ml20,
  s.transitionColor,
  modifier('.approvedSubmissions', hover(s.colorGreen)),
  modifier('.selectedSubmissions', hover(s.colorYellow)),
  modifier('.unapprovedSubmissions', hover(s.colorBlack)),
  modifier('.declinedSubmissions', hover(s.colorRed)),
  modifier('.approvedSubmissions.isActive', s.colorGreen),
  modifier('.selectedSubmissions.isActive', s.colorYellow),
  modifier('.unapprovedSubmissions.isActive', s.colorBlack),
  modifier('.declinedSubmissions.isActive', s.colorRed),
)

const SelectionTabSwitcher = ({
  dataKey,
  isActive,
  label,
  onClick,
}) => {
  const className = `${buttonStyle} ${dataKey} ${isActive ? 'isActive' : ''}`
  const hrefDecoration = `#${dataKey.replace('Submissions', '').replace('approved', 'accepted')}`
  return (
    <a
      href={hrefDecoration}
      className={className}
      data-key={dataKey}
      onClick={onClick}
    >
      {label}
    </a>
  )
}
const propTypes = {
  dataKey: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
const defaultProps = {
  isActive: false,
}
SelectionTabSwitcher.propTypes = propTypes
SelectionTabSwitcher.defaultProps = defaultProps

export default SelectionTabSwitcher
