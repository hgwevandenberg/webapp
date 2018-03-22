/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router'
import { css, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const selectionTabSwitcherStyle = css(

)

const tabStyle = css(
  s.block,
  { border: 0 },
  media(s.minBreak3, s.mb20, parent('.ArtistInvitesDetail', s.mb0, s.fontSize38)),
  select('& .label',
    s.block,
    s.fullWidth,
    s.colorA,
    s.fontSize24,
    s.sansBlack,
    s.truncate,
    s.borderBottom,
    s.transitionColor,
    media(s.minBreak3, s.mb0, s.fontSize38),
  ),

  select('& .text',
    s.block,
    s.fullWidth,
    s.colorBlack,
    s.fontSize14,
  ),

  modifier('.approvedSubmissions', select('& .label', hover(s.colorGreen))),
  modifier('.selectedSubmissions', select('& .label', hover(s.colorYellow))),
  modifier('.unapprovedSubmissions', select('& .label', hover(s.colorBlack))),
  modifier('.declinedSubmissions', select('& .label', hover(s.colorRed))),
  modifier('.approvedSubmissions.isActive', select('& .label', s.colorGreen)),
  modifier('.selectedSubmissions.isActive', select('& .label', s.colorYellow)),
  modifier('.unapprovedSubmissions.isActive', select('& .label', s.colorBlack)),
  modifier('.declinedSubmissions.isActive', select('& .label', s.colorRed)),
)

const SelectionTabSwitcher = ({
  dataKey,
  isActive,
  label,
  onClick,
}) => {
  const className = `${tabStyle} ${dataKey} ${isActive ? 'isActive' : ''}`
  const href = `?submissionType=${dataKey}`

  let explainerText = null
  switch (dataKey) {
    case 'unapprovedSubmissions' :
      explainerText = 'Submissions to be Accepted or Declined. Not publicly visible.'
      break
    case 'approvedSubmissions' :
      explainerText = 'Accepted Submissions to be Accepted or Declined. Not publicly visible.'
      break
    case 'selectedSubmissions' :
      explainerText = 'Selected Submissions to be Accepted or Declined. Not publicly visible.'
      break
    case 'declinedSubmissions' :
      explainerText = 'Declined Submissions to be Accepted or Declined. Not publicly visible.'
      break
    default :
      explainerText = null
  }

  return (
    <li className={selectionTabSwitcherStyle}>
      <a
        href={href}
        className={className}
        onClick={onClick}
      >
        <span className="label">
          {label}
        </span>
        <span className="text">
          {explainerText}
        </span>
      </a>
    </li>
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
