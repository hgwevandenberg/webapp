import { isFSA } from '../../support/test_helpers'
import { notificationList } from '../../../src/components/streams/StreamRenderables'
import * as subject from '../../../src/actions/notifications'

describe('notifications actions', () => {
  context('#loadNotifications (default)', () => {
    const action = subject.loadNotifications()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('notificationStream')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('activities')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(notificationList)
      expect(action.meta.renderStream.asGrid).to.equal(notificationList)
      expect(action.meta.renderStream.asZero).to.exist
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/notifications')
    })

    it('has the correct updateKey in the action', () => {
      expect(action.meta.updateKey).to.equal('/notifications')
    })
  })

  context('#loadNotifications (with params)', () => {
    const action = subject.loadNotifications({ category: 'comments' })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.variables.category).to.equal('COMMENTS')
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/notifications/comments')
    })
  })

  context('#checkForNewNotifications', () => {
    const action = subject.checkForNewNotifications()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('newNotificationStreamContent')
    })
  })
})

