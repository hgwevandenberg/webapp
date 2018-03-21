// @flow
import React from 'react'
import classNames from 'classnames'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

const baseStyle = css(s.displayNone, s.hidden)

type Props = {
  isAuthenticationView: boolean,
  isDiscoverView: boolean,
  isNavbarHidden: boolean,
  isLightBoxActive: boolean,
  isNotificationsActive: boolean,
  isOnboardingView: boolean,
  isProfileMenuActive: boolean,
  userDetailPathClassName: string | null,
}

export const Viewport = (props: Props) =>
  (<div
    className={classNames(
      'Viewport',
      { isAuthenticationView: props.isAuthenticationView },
      { isDiscoverView: props.isDiscoverView },
      { isNavbarHidden: props.isNavbarHidden || props.isLightBoxActive },
      { isNotificationsActive: props.isNotificationsActive },
      { isOnboardingView: props.isOnboardingView },
      { isProfileMenuActive: props.isProfileMenuActive },
      props.userDetailPathClassName,
      `${baseStyle}`,
    )}
    role="presentation"
  />)

export default Viewport

