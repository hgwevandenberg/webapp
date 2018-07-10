import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import { CircleAddRemove } from '../assets/Icons'
import { DismissButtonLG } from '../buttons/Buttons'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const categoryAddRoleTriggerStyle = css(
  s.wv20,
  s.hv20,
  select('& .label', s.displayNone),
  select('& .icon',
    s.transitionColor,
    s.colorA,
  ),
  hover(
    select('& .icon',
      s.colorBlack,
    ),
  ),

  // add version
  select('&.add-role',
    select('& .icon',
      s.colorGreen,
    ),
    hover(
      select('& .icon',
        s.colorDarkGreen,
      ),
    ),
  ),
  // remove version
  select('&.remove-role',
    select('& .icon',
      select('& svg',
        { transform: 'rotate(45deg)' },
      ),
    ),
  ),
)

export function CategoryAddRemoveRoleButton({
  actionType,
  handleClick,
  roleType,
}) {
  const actionName = actionType === 'add' ? 'Add' : 'Remove'
  const roleName = roleType === 'curators' ? 'Curator' : 'Moderator'

  return (
    <button
      className={`${actionType}-role${actionType === 'add' ? ' open-trigger' : ''} ${categoryAddRoleTriggerStyle}`}
      title={`${actionName} ${roleName}`}
      onClick={handleClick}
    >
      <span className="label">
        {actionName} {roleName}
      </span>
      <span className="icon">
        <CircleAddRemove />
      </span>
    </button>
  )
}
CategoryAddRemoveRoleButton.propTypes = {
  actionType: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  roleType: PropTypes.string.isRequired,
}

const categoryRoleUserStyle = css(
)

function CategoryRoleUser({
  handleClick,
  userId,
  username,
}) {
  return (
    <li className={categoryRoleUserStyle}>
      <button onClick={() => handleClick(userId)}>
        {username}
      </button>
    </li>
  )
}
CategoryRoleUser.propTypes = {
  handleClick: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

const categoryRoleUserPickerModalStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .mask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },

    media(s.minBreak2,
      s.flex,
      s.itemsCenter,
      s.justifyCenter,
    ),
  ),
)
const categoryRoleUserPickerStyle = css(
  s.relative,
  s.block,
  s.p20,
  s.mt40,
  s.colorBlack,
  s.fullWidth,
  s.leftAlign,
  s.bgcWhite,
  {
    maxWidth: 780,
    borderRadius: 5,
  },

  media(s.minBreak2,
    s.m0,
    s.pt40,
    { width: '80%' },
  ),
  media(s.minBreak4,
    { width: '60%' },
  ),

  select('& .CloseModal',
    s.colorA,
    { top: 14, right: 20 },
    hover(s.colorBlack),

    media(s.maxBreak2,
      { top: 7, right: 7 },
    ),
  ),

  select('& h1',
    s.sansBlack,
    s.fontSize24,
  ),
)

const userPickerStyle = css(
  s.block,
  s.fullWidth,
  select('& form',
    s.flex,
    s.fullWidth,
    s.itemsCenter,
    s.justifySpaceBetween,
    s.mt30,
    select('& label',
      s.relative,
      { width: 'calc(100% - 100px)' },
      select('& .label-text',
        s.absolute,
        s.colorA,
        s.zIndex2,
        {
          left: 20,
          top: 7,
        },
      ),
      select('& .input-holder',
        s.relative,
        s.fullWidth,
        select('& input',
          s.resetInput,
          s.block,
          s.fullWidth,
          s.pr10,
          s.hv40,
          s.lh40,
          s.fontSize14,
          s.colorBlack,
          s.bgcEA,
          s.transitionBgColor,
          {
            paddingLeft: 40,
            borderRadius: 5,
          },

          select('&:focus',
            s.bgcF2,
          ),
        ),
      ),
    ),

    select('& button.user-submit',
      s.pr10,
      s.pl10,
      s.hv40,
      s.lh40,
      s.fontSize14,
      s.colorWhite,
      s.bgcGreen,
      s.transitionBgColor,
      { borderRadius: 5 },

      hover(
        s.bgcDarkGreen,
        {
          cursor: 'pointer',
        },
      ),

      select('&:disabled, &:disabled:hover',
        s.bgcA,
        hover({ cursor: 'default' }),
      ),
    ),
  ),
)

const userResultsListStyle = css(
  s.resetList,
  s.absolute,
  s.fullWidth,
  s.bgcA,
)

export function CategoryRoleUserPicker({
  close,
  handleMaskClick,
  handleRolesSubmit,
  isOpen,
  roleType,
  searchUsers,
  quickSearchUsers,
}) {
  if (!isOpen) {
    return null
  }

  const roleName = roleType === 'curators' ? 'Curator' : 'Moderator'

  return (
    <div className={categoryRoleUserPickerModalStyle}>
      <div className="mask" role="presentation" onClick={handleMaskClick}>
        <div className={categoryRoleUserPickerStyle}>
          <DismissButtonLG
            onClick={close}
          />
          <div className={`pick-user ${userPickerStyle}`}>
            <h1>Add {roleName}</h1>
            <form>
              <label htmlFor={`add-${roleType}`}>
                <span className="label-text">@</span> <span className="input-holder">
                  <input
                    autoComplete="off"
                    className="username"
                    name={`add-${roleType}`}
                    id={`add-${roleType}`}
                    type="search"
                    onChange={searchUsers}
                  />
                </span>
                <ul className={userResultsListStyle}>
                  {quickSearchUsers.map(user => (
                    <CategoryRoleUser
                      key={user.get('id')}
                      handleClick={handleRolesSubmit}
                      userId={user.get('id')}
                      username={user.get('username')}
                    />
                  ))}
                </ul>
              </label>
              <button
                className="user-submit"
                disabled={false}
                // onClick={e => this.handleSubmitLocal(e)}
              >
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
CategoryRoleUserPicker.propTypes = {
  close: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  handleRolesSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  roleType: PropTypes.string,
  searchUsers: PropTypes.func.isRequired,
  quickSearchUsers: PropTypes.object.isRequired,
}
CategoryRoleUserPicker.defaultProps = {
  newRole: null,
  roleType: 'curator',
}
