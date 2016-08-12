import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Cover from '../assets/Cover'
import { UserDetailHelmet } from '../helmets/UserDetailHelmet'
import StreamContainer from '../../containers/StreamContainer'
import UserContainer from '../../containers/UserContainer'
import { MainView } from '../views/MainView'
import { TabListButtons } from '../tabs/TabList'
import { ZeroStateCreateRelationship, ZeroStateFirstPost, ZeroStateSayHello } from '../zeros/Zeros'

const ZeroStates = ({
  isLoggedIn, isSelf, hasSaidHelloTo, hasZeroFollowers, hasZeroPosts, onSubmitHello, user,
  }) =>
  <div className="ZeroStates">
    {isSelf && hasZeroPosts ? <ZeroStateFirstPost /> : null}
    {!isSelf && hasZeroFollowers ? <ZeroStateCreateRelationship user={user} /> : null}
    {isLoggedIn && !isSelf && hasZeroPosts ?
      <ZeroStateSayHello
        onSubmit={() => onSubmitHello({ username: user.username })}
        hasPosted={hasSaidHelloTo}
        user={user}
      /> : null
    }
  </div>

ZeroStates.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  hasSaidHelloTo: PropTypes.bool.isRequired,
  hasZeroFollowers: PropTypes.bool.isRequired,
  hasZeroPosts: PropTypes.bool.isRequired,
  onSubmitHello: PropTypes.func,
  user: PropTypes.object.isRequired,
}


export const UserDetail = (props) => {
  // deconstruct props
  const { isLoggedIn, isSelf, hasSaidHelloTo, hasZeroFollowers, hasZeroPosts } = props
  const { activeType, onSubmitHello, onTabClick, streamAction, tabs, user } = props
  const { coverDPI, coverImage, coverOffset, isCoverActive, isCoverHidden } = props
  const useGif = user.viewsAdultContent || !user.postsAdultContent

  // construct component props
  const coverProps = {
    coverDPI, coverImage, coverOffset, isHidden: isCoverHidden, isModifiable: isSelf, useGif,
  }
  const userListProps = { className: 'asUserDetailHeader', showBlockMuteButton: true, useGif, user }
  const tabProps = { activeType, className: 'LabelTabList', tabClasses: 'LabelTab', tabs }
  const streamProps = { action: streamAction, isUserDetail: true }
  const zeroProps = {
    isLoggedIn, isSelf, hasSaidHelloTo, hasZeroFollowers, hasZeroPosts, onSubmitHello, user,
  }
  const classList = classNames('UserDetail', { isCoverInactive: !isCoverActive })

  return (
    <MainView className={classList}>
      <UserDetailHelmet user={user} />
      <div className="UserDetails">
        {isCoverActive ? <Cover {...coverProps} /> : null}
        <UserContainer {...userListProps} isUserDetail type="list" />
        {tabs ? <TabListButtons {...tabProps} onTabClick={({ type }) => onTabClick(type)} /> : null}
        {hasZeroPosts || hasZeroFollowers ? <ZeroStates {...zeroProps} /> : null}
        {streamAction ? <StreamContainer {...streamProps} /> : null}
      </div>
    </MainView>
  )
}

UserDetail.propTypes = {
  activeType: PropTypes.string,
  coverDPI: PropTypes.string,
  coverImage: PropTypes.shape({}),
  coverOffset: PropTypes.number,
  isCoverActive: PropTypes.bool.isRequired,
  isCoverHidden: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  hasSaidHelloTo: PropTypes.bool.isRequired,
  hasZeroFollowers: PropTypes.bool.isRequired,
  hasZeroPosts: PropTypes.bool.isRequired,
  onSubmitHello: PropTypes.func,
  onTabClick: PropTypes.func,
  streamAction: PropTypes.object,
  tabs: PropTypes.array,
  user: PropTypes.object.isRequired,
}


export const UserDetailError = ({ children }) =>
  <MainView className="UserDetail">
    <section className="StreamContainer isError">
      {children}
    </section>
  </MainView>

UserDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

