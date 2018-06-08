import React from 'react'
import PropTypes from 'prop-types'
import { DismissButtonLGReverse } from './../buttons/Buttons'
import { css, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const userDetailRolesModalStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .mask',
    s.flex,
    s.itemsCenter,
    s.justifyCenter,
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },
  ),
)
const userDetailRolesStyle = css(
  s.relative,
  s.block,
  s.p20,
  s.pt40,
  s.colorBlack,
  s.leftAlign,
  s.bgcWhite,
  {
    width: '60%',
    borderRadius: 10,
  },

  select('& h1',
    s.sansBlack,
    s.fontSize24,
  ),
)

export default function UserDetailRoles({
  close,
  handleMaskClick,
  isOpen,
  sampleProp,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={userDetailRolesModalStyle}>
      <div className="mask" role="presentation" onClick={handleMaskClick}>
        <DismissButtonLGReverse
          onClick={close}
        />
        <div className={`${userDetailRolesStyle} content`}>
          <h1>Hello, I am modal.</h1>
          <p>I have fancy content.</p>
          <p>{sampleProp}</p>
        </div>
      </div>
    </div>
  )
}
UserDetailRoles.propTypes = {
  close: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  sampleProp: PropTypes.string.isRequired,
}
