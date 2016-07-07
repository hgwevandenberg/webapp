import { expect } from '../../spec_helper'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  PROFILE,
  SET_LAYOUT_MODE,
} from '../../../src/constants/action_types'
import { gui as reducer, setLocation, findLayoutMode } from '../../../src/reducers/gui'

describe('gui reducer', () => {
  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {})
      ).to.have.keys(
      'activeNotificationsType',
      'activeUserFollowingType',
      'columnCount',
      'columnWidth',
      'contentWidth',
      'coverDPI',
      'coverOffset',
      'currentStream',
      'deviceSize',
      'discoverKeyType',
      'history',
      'innerHeight',
      'innerWidth',
      'isAuthenticationView',
      'isCoverHidden',
      'isGridMode',
      'isLayoutToolHidden',
      'isNavbarFixed',
      'isNavbarHidden',
      'isNavbarSkippingTransition',
      'isNotificationsUnread',
      'isOffsetLayout',
      'isOnboardingView',
      'lastDiscoverBeaconVersion',
      'lastFollowingBeaconVersion',
      'lastNotificationCheck',
      'lastStarredBeaconVersion',
      'modes',
      )
    })
  })

  context('#findLayoutMode', () => {
    it('/', () => {
      setLocation({ pathname: '/' })
      const initialState = reducer()
      expect(findLayoutMode(initialState.modes).label).to.equal('root')
    })
  })

  context('AUTHENTICATION', () => {
    it('LOGOUT resets the discoverKeyType', () => {
      const testState = { ...reducer(undefined, {}), discoverKeyType: 'wiketywhack' }
      expect(reducer(testState, {})).to.have.property('discoverKeyType', 'wiketywhack')
      const action = { type: AUTHENTICATION.LOGOUT }
      expect(reducer(reducer, action)).to.have.property('discoverKeyType', null)
    })
  })

  context('GUI', () => {
    it('GUI.BIND_DISCOVER_KEY updates discoverKeyType', () => {
      expect(reducer(undefined, {})).to.have.property('discoverKeyType', null)
      const action = { type: GUI.BIND_DISCOVER_KEY, payload: { type: 'radical' } }
      expect(reducer(reducer, action)).to.have.property('discoverKeyType', 'radical')
    })

    it('GUI.NOTIFICATIONS_TAB updates activeNotificationsType', () => {
      expect(reducer(undefined, {})).to.have.property('activeNotificationsType', 'all')
      const action = { type: GUI.NOTIFICATIONS_TAB, payload: { activeTabType: 'comments' } }
      expect(reducer(reducer, action)).to.have.property('activeNotificationsType', 'comments')
    })

    it('GUI.SET_ACTIVE_USER_FOLLOWING_TYPE updates activeUserFollowingType', () => {
      expect(reducer(undefined, {})).to.have.property('activeUserFollowingType', 'friend')
      const action = { type: GUI.SET_ACTIVE_USER_FOLLOWING_TYPE, payload: { tab: 'noise' } }
      expect(reducer(reducer, action)).to.have.property('activeUserFollowingType', 'noise')
    })

    it('GUI.SET_IS_OFFSET_LAYOUT updates isOffsetLayout', () => {
      expect(reducer(undefined, {})).to.have.property('isOffsetLayout', false)
      const action = { type: GUI.SET_IS_OFFSET_LAYOUT, payload: { isOffsetLayout: true } }
      expect(reducer(reducer, action)).to.have.property('isOffsetLayout', true)
    })

    it('GUI.SET_LAST_DISCOVER_BEACON_VERSION updates the lastDiscoverBeaconVersion', () => {
      expect(reducer(undefined, {})).to.have.property('lastDiscoverBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_DISCOVER_BEACON_VERSION, payload: { version: '1' } }
      expect(reducer(undefined, action)).to.have.property('lastDiscoverBeaconVersion', '1')
    })

    it('GUI.SET_LAST_FOLLOWING_BEACON_VERSION updates lastFollowingBeaconVersion', () => {
      expect(reducer(undefined, {})).to.have.property('lastFollowingBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_FOLLOWING_BEACON_VERSION, payload: { version: '666' } }
      expect(reducer(undefined, action)).to.have.property('lastFollowingBeaconVersion', '666')
    })

    it('GUI.LAST_STARRED_BEACON_VERSION updates lastStarredBeaconVersion', () => {
      expect(reducer(undefined, {})).to.have.property('lastStarredBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_STARRED_BEACON_VERSION, payload: { version: '667' } }
      expect(reducer(undefined, action)).to.have.property('lastStarredBeaconVersion', '667')
    })

    it('GUI.SET_SCROLL', () => {
      const initialState = reducer(undefined, {})
      expect(initialState.history).to.be.empty
      const action1 = { type: GUI.SET_SCROLL, payload: { key: '1', scrollTop: 0 } }
      const nextState = reducer(initialState, action1)
      expect(nextState.history['1']).to.deep.equal(action1.payload)
      const action2 = { type: GUI.SET_SCROLL, payload: { key: '2', scrollTop: 800 } }
      const lastState = reducer(nextState, action2)
      expect(lastState.history['2']).to.deep.equal({ ...action1.payload, ...action2.payload })
    })

    it('GUI.SET_SCROLL_STATE updates properties from the initialScrollState', () => {
      const initialState = reducer(undefined, {})
      expect(initialState).to.have.property('isCoverHidden', false)
      expect(initialState).to.have.property('isNavbarFixed', false)
      expect(initialState).to.have.property('isNavbarHidden', false)
      expect(initialState).to.have.property('isNavbarSkippingTransition', false)

      const action = {
        type: GUI.SET_SCROLL_STATE,
        payload: {
          isCoverHidden: true,
          isNavbarFixed: true,
          isNavbarHidden: true,
          isNavbarSkippingTransition: true,
        },
      }

      const nextState = reducer(initialState, action)
      expect(nextState).to.have.property('isCoverHidden', true)
      expect(nextState).to.have.property('isNavbarFixed', true)
      expect(nextState).to.have.property('isNavbarHidden', true)
      expect(nextState).to.have.property('isNavbarSkippingTransition', true)
    })

    it('GUI.SET_VIEWPORT_SIZE_ATTRIBUTES', () => {
      const initialState = reducer(undefined, {})
      expect(initialState).to.have.property('columnCount', 2)
      expect(initialState).to.have.property('columnWidth', 0)
      expect(initialState).to.have.property('contentWidth', 0)
      expect(initialState).to.have.property('coverDPI', 'xhdpi')
      expect(initialState).to.have.property('coverOffset', 0)
      expect(initialState).to.have.property('deviceSize', 'tablet')
      expect(initialState).to.have.property('innerHeight', 0)
      expect(initialState).to.have.property('innerWidth', 0)
      const action = {
        type: GUI.SET_VIEWPORT_SIZE_ATTRIBUTES,
        payload: {
          columnCount: 4,
          columnWidth: 320,
          contentWidth: 1280,
          coverDPI: 'optimized',
          coverOffset: 200,
          deviceSize: 'desktop',
          innerHeight: 768,
          innerWidth: 1360,
        },
      }

      const nextState = reducer(initialState, action)
      expect(nextState.columnCount).to.equal(4)
      expect(nextState.columnWidth).to.equal(320)
      expect(nextState.contentWidth).to.equal(1280)
      expect(nextState.coverDPI).to.equal('optimized')
      expect(nextState.coverOffset).to.equal(200)
      expect(nextState.deviceSize).to.equal('desktop')
      expect(nextState.innerHeight).to.equal(768)
      expect(nextState.innerWidth).to.equal(1360)
    })
  })

  context('HEAD', () => {
    it('HEAD_FAILURE updates isNotificationsUnread', () => {
      const testState = { ...reducer(undefined, {}), isNotificationsUnread: true }
      expect(reducer(testState, {})).to.have.property('isNotificationsUnread', true)
      const action = { type: HEAD_FAILURE }
      expect(reducer(reducer, action)).to.have.property('isNotificationsUnread', false)
    })

    it('HEAD_SUCCESS updates isNotificationsUnread', () => {
      expect(reducer(undefined, {})).to.have.property('isNotificationsUnread', false)
      const action = { type: HEAD_SUCCESS, payload: { serverResponse: { status: 204 } } }
      expect(reducer(reducer, action)).to.have.property('isNotificationsUnread', true)
    })
  })

  context('LOAD_STREAM_SUCCESS', () => {
    it('LOAD_STREAM_SUCCESS updates lastNotificationCheck', () => {
      const action = { type: LOAD_STREAM_SUCCESS, meta: { resultKey: '/discover' } }
      const initialState = reducer(undefined, {})
      const nextState = reducer(initialState, action)
      // faking a tick of the frame :)
      const initialTime = new Date(initialState.lastNotificationCheck).getTime() - 60
      const nextTime = new Date(nextState.lastNotificationCheck).getTime()
      expect(initialTime).to.be.below(nextTime)
    })

    it('LOAD_STREAM_SUCCESS does not update red dot when stream is a notification', () => {
      const action = { type: LOAD_STREAM_SUCCESS, meta: { resultKey: '/notifications' } }
      const initialState = { ...reducer(undefined, {}), isNotificationsUnread: true }
      expect(initialState).to.have.property('isNotificationsUnread', true)
      const nextState = reducer(initialState, action)
      expect(nextState).to.have.property('isNotificationsUnread', false)
    })
  })

  context('LOCATION_CHANGE', () => {
    it('LOCATION_CHANGE updates relevant streams to currentStream', () => {
      const action = { type: LOCATION_CHANGE, payload: { pathname: '/discover/trending' } }
      expect(reducer(undefined, action)).to.have.property('currentStream', '/discover/trending')
    })

    it('LOCATION_CHANGE updates the current grid mode', () => {
      const action1 = { type: LOCATION_CHANGE, payload: { pathname: '/following' } }
      expect(reducer(undefined, action1)).to.have.property('isGridMode', true)

      const action2 = { type: LOCATION_CHANGE, payload: { pathname: '/starred' } }
      expect(reducer(undefined, action2)).to.have.property('isGridMode', false)
    })

    it('LOCATION_CHANGE updates whether the layout tool is displayed', () => {
      const action1 = { type: LOCATION_CHANGE, payload: { pathname: '/following' } }
      expect(reducer(undefined, action1)).to.have.property('isLayoutToolHidden', false)
      const action2 = { type: LOCATION_CHANGE, payload: { pathname: '/settings' } }
      expect(reducer(undefined, action2)).to.have.property('isLayoutToolHidden', true)
      const action3 = { type: LOCATION_CHANGE, payload: { pathname: '/elloindiegogo' } }
      expect(reducer(undefined, action3)).to.have.property('isLayoutToolHidden', false)
      const action4 = { type: LOCATION_CHANGE, payload: { pathname: '/elloindiegogo/post/a5qr9a' } }
      expect(reducer(undefined, action4)).to.have.property('isLayoutToolHidden', true)
      const action5 = { type: LOCATION_CHANGE, payload: { pathname: '/discover/all' } }
      expect(reducer(undefined, action5)).to.have.property('isLayoutToolHidden', true)
    })

    it('LOCATION_CHANGE updates isAuthenticationView', () => {
      const root = { type: LOCATION_CHANGE, payload: { pathname: '/' } }
      const enter = { type: LOCATION_CHANGE, payload: { pathname: '/enter' } }
      const join = { type: LOCATION_CHANGE, payload: { pathname: '/join' } }
      const password = { type: LOCATION_CHANGE, payload: { pathname: '/forgot-password' } }
      const signup = { type: LOCATION_CHANGE, payload: { pathname: '/signup' } }
      expect(reducer(undefined, enter)).to.have.property('isAuthenticationView', true)
      expect(reducer(undefined, root)).to.have.property('isAuthenticationView', false)
      expect(reducer(undefined, join)).to.have.property('isAuthenticationView', true)
      expect(reducer(undefined, root)).to.have.property('isAuthenticationView', false)
      expect(reducer(undefined, password)).to.have.property('isAuthenticationView', true)
      expect(reducer(undefined, root)).to.have.property('isAuthenticationView', false)
      expect(reducer(undefined, signup)).to.have.property('isAuthenticationView', true)
    })

    it('LOCATION_CHANGE updates isOnboardingView', () => {
      const root = { type: LOCATION_CHANGE, payload: { pathname: '/' } }
      const onboarding = { type: LOCATION_CHANGE, payload: { pathname: '/onboarding' } }
      const communities = {
        type: LOCATION_CHANGE, payload: { pathname: '/onboarding/communities' },
      }
      const people = { type: LOCATION_CHANGE, payload: { pathname: '/onboarding/people' } }
      const header = { type: LOCATION_CHANGE, payload: { pathname: '/onboarding/profile-header' } }
      const avatar = { type: LOCATION_CHANGE, payload: { pathname: '/onboarding/profile-avatar' } }
      const bio = { type: LOCATION_CHANGE, payload: { pathname: '/onboarding/profile-bio' } }
      const one = { type: LOCATION_CHANGE, payload: { pathname: '/onboardingone' } }
      expect(reducer(undefined, onboarding)).to.have.property('isOnboardingView', true)
      expect(reducer(undefined, root)).to.have.property('isOnboardingView', false)
      expect(reducer(undefined, communities)).to.have.property('isOnboardingView', true)
      expect(reducer(undefined, people)).to.have.property('isOnboardingView', true)
      expect(reducer(undefined, header)).to.have.property('isOnboardingView', true)
      expect(reducer(undefined, avatar)).to.have.property('isOnboardingView', true)
      expect(reducer(undefined, bio)).to.have.property('isOnboardingView', true)
      expect(reducer(undefined, one)).to.have.property('isOnboardingView', false)
    })
  })

  context('PROFILE', () => {
    it('DELETE_SUCCESS resets to the initialState', () => {
      const firstState = reducer(undefined, {})
      const testState = { ...reducer(undefined, {}), isNotificationsUnread: true }
      expect(reducer(testState, {})).to.have.property('isNotificationsUnread', true)
      const action = { type: PROFILE.DELETE_SUCCESS }
      const resetState = reducer(testState, action)
      expect(resetState).to.deep.equal(firstState)
    })
  })

  context('SET_LAYOUT_MODE', () => {
    it('SET_LAYOUT_MODE updates the grid mode', () => {
      setLocation({ pathname: '/discover' })
      const listAction = { type: SET_LAYOUT_MODE, payload: { mode: 'list' } }
      const initialState = reducer(undefined, {})
      expect(reducer(initialState, listAction)).to.have.property('isGridMode', false)
    })

    it('SET_LAYOUT_MODE aborts when the grid is the same', () => {
      setLocation({ pathname: '/discover' })
      const gridAction = { type: SET_LAYOUT_MODE, payload: { mode: 'grid' } }
      const initialState = reducer(undefined, {})
      expect(reducer(initialState, gridAction)).to.have.property('isGridMode', true)
    })
  })
})
