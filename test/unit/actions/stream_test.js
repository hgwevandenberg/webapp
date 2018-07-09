import { isFSA } from '../../support/test_helpers'
import * as subject from '../../../src/actions/stream'
import { postsAsGrid, postsAsList } from '../../../src/components/streams/StreamRenderables'

describe('stream actions', () => {
  context('#loadFollowing', () => {
    const action = subject.loadFollowing('recent')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('followingPostStream')
    })

    it('has the correct variables in the action', () => {
      expect(action.payload.variables.kind).to.equal('RECENT')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
      expect(action.meta.renderStream.asZero).to.exist
    })
  })
})

