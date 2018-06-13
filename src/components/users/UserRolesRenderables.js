import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
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

const roleName = {
  'FEATURED': 'Featured User',
  'CURATOR': 'Curator',
  'MODERATOR': 'Moderator',
}

export default function UserDetailRoles({
  close,
  handleMaskClick,
  isOpen,
  categoryUsers,
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
          <h1>Role Administrator</h1>
          {categoryUsers.map(cu => (
            <div key={cu.get('id')}>
              {roleName[cu.get('role')]} in&nbsp;
              <Link to={`/discover/${cu.get('categorySlug')}`}>{cu.get('categoryName')}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
UserDetailRoles.propTypes = {
  close: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  categoryUsers: PropTypes.object.isRequired,
}
