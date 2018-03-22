/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router'
import { css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const selectionTabSwitcherStyle = css(

)

const tabStyle = css(
  s.block,
  { border: 0 },
  select('& .label',
    s.block,
    s.fullWidth,
    s.colorA,
    s.fontSize24,
    s.sansBlack,
    s.truncate,
    s.borderBottom,
    s.transitionColor,
    {
      lineHeight: 34,
      borderWidth: 2,
    },
    media(s.minBreak3,
      s.fontSize38,
      { lineHeight: 48 },
    ),
  ),

  select('& .text',
    s.block,
    s.fullWidth,
    s.colorA,
    s.fontSize14,
    { marginTop: 25 },
  ),

  modifier('.isActive', select('& .text', s.colorBlack)),
  modifier('.approvedSubmissions', hover(select('& .label', s.colorGreen))),
  modifier('.selectedSubmissions', hover(select('& .label', s.colorYellow))),
  modifier('.unapprovedSubmissions', hover(select('& .label', s.colorBlack))),
  modifier('.declinedSubmissions', hover(select('& .label', s.colorRed))),
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
      explainerText = 'Accepting a submission sends an email to the artist letting them know you have received their work. It also notifies the followers of the artist that their submission was accepted for further consideration. Accepting a submission makes it publicly visible on the Artist Invite.'
      break
    case 'selectedSubmissions' :
      explainerText = 'Submissions may be “selected” at any point during the submission period. We recommend using this tab to save top submissions for final review when the Invite closes. You can remove submissions from the Selected tab by toggling the selected icon. Not publicly visible.'
      break
    case 'declinedSubmissions' :
      explainerText = 'We encourage only decline work that is incomplete, inappropriate, or extremely off-brand. Not publicly visible.'
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
