import { expect, isFSA, isFSAN } from '../spec_helper'
import * as subject from '../../src/actions/gui'

describe('gui actions', () => {
  describe('#setActiveUserFollowingType', () => {
    const action = subject.setActiveUserFollowingType('noise')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAN(action, subject.setActiveUserFollowingType)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('tab')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.tab).to.equal('noise')
    })
  })

  describe('#setIsOffsetLayout', () => {
    const action = subject.setIsOffsetLayout({ isOffsetLayout: false })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAN(action, subject.setIsOffsetLayout)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('isOffsetLayout')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isOffsetLayout).to.be.false
    })
  })

  describe('#setScrollState', () => {
    const action = subject.setScrollState({
      isCoverHidden: false,
      isFixed: true,
      isHidden: false,
      isSkippingTransition: false,
    })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAN(action, subject.setScrollState)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys(
        'isCoverHidden',
        'isNavbarFixed',
        'isNavbarHidden',
        'isNavbarSkippingTransition',
      )
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isCoverHidden).to.be.false
      expect(action.payload.isNavbarFixed).to.be.true
      expect(action.payload.isNavbarHidden).to.be.false
      expect(action.payload.isNavbarSkippingTransition).to.be.false
    })
  })

  describe('#setViewportSizeAttributes', () => {
    const action = subject.setViewportSizeAttributes({
      columnCount: 4,
      columnWidth: 320,
      contentWidth: 1280,
      coverDPI: 'xhdpi',
      coverOffset: 200,
      deviceSize: 'desktop',
      innerHeight: 768,
      innerWidth: 1360,
    })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAN(action, subject.setViewportSizeAttributes)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys(
        'columnCount',
        'columnWidth',
        'contentWidth',
        'coverDPI',
        'coverOffset',
        'deviceSize',
        'innerHeight',
        'innerWidth',
      )
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.columnCount).to.equal(4)
      expect(action.payload.columnWidth).to.equal(320)
      expect(action.payload.contentWidth).to.equal(1280)
      expect(action.payload.coverDPI).to.equal('xhdpi')
      expect(action.payload.coverOffset).to.equal(200)
      expect(action.payload.deviceSize).to.equal('desktop')
      expect(action.payload.innerHeight).to.equal(768)
      expect(action.payload.innerWidth).to.equal(1360)
    })
  })
})
