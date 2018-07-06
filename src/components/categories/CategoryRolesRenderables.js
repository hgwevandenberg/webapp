import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import { ChevronIcon } from '../assets/Icons'
import { DismissButtonLG } from '../buttons/Buttons'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

export function CategoryAddRoleTrigger({
  handleTriggerClick,
  type,
}) {
  const roleName = type === 'curator' ? 'Curator' : 'Moderator'

  return (
    <button
      className="category-info open-trigger"
      title={`Add ${roleName}`}
      onClick={handleTriggerClick}
    >
      <span className="label">
        Add {roleName}
      </span>
      <span className="icon">
        <ChevronIcon />
      </span>
    </button>
  )
}
CategoryAddRoleTrigger.propTypes = {
  handleTriggerClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
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

    select('& button',
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
        {
          cursor: 'pointer',
          backgroundColor: '#16a905',
        },
      ),

      select('&:disabled, &:disabled:hover',
        s.bgcA,
        hover({ cursor: 'default' }),
      ),
    ),
  ),
)

export function CategoryRoleUserPicker({
  close,
  handleMaskClick,
  // handleRolesSubmit,
  isOpen,
  // isStaff,
  roleType,
  // userId,
}) {
  if (!isOpen) {
    return null
  }

  const roleName = roleType === 'curator' ? 'Curator' : 'Moderator'

  return (
    <div className={categoryRoleUserPickerModalStyle}>
      <div className="mask" role="presentation" onClick={handleMaskClick}>
        <div className={`${categoryRoleUserPickerStyle} content`}>
          <DismissButtonLG
            onClick={close}
          />
          <div className={`pick-user ${userPickerStyle}`}>
            <h1>Add {roleName}</h1>
            <form>
              <label htmlFor={`add-${roleType}`}>
                <span className="label-text">@</span>
                <span className="input-holder">
                  <input
                    className="username"
                    name={`add-${roleType}`}
                    id={`add-${roleType}`}
                    type="search"
                    value=""
                  />
                </span>
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
  // handleRolesSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  // isStaff: PropTypes.bool.isRequired,
  roleType: PropTypes.string,
  // userId: PropTypes.string.isRequired,
}
CategoryRoleUserPicker.defaultProps = {
  newRole: null,
  roleType: 'curator',
}
