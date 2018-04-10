import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {
  ArrowIcon,
  BrowseIcon,
  MoneyIconCircle,
  ReplyAllIcon,
  XIconLG,
} from '../assets/Icons'
import CategoryPostSelector from './CategoryPostSelector'
import { openModal, closeModal } from '../../actions/modals'
import { updateBuyLink, updateCategoryId, clearCategoryId } from '../../actions/editor'
import BuyLinkDialog from '../dialogs/BuyLinkDialog'
import {
  selectSubscribedCategories,
  selectUnsubscribedCategories,
  selectFeaturedInCategories,
  selectPostSelectedCategories,
} from '../../selectors/categories'
import { css, disabled, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const wrapperStyle = css(
  s.flex,
  s.justifySpaceBetween,
  s.hv40,
  s.lh40,
  s.mt10,
)

const leftStyle = css(
  select('& button', s.mr10),
  select('& button:last-child', s.mr0),
  select('& .forCancel.text', s.displayNone),
  select('.PostGrid & .forCancel.text', s.displayNone),
  media(s.minBreak2, select('& .forCancel.text', s.inlineBlock, s.mr0, s.p0)),
  select('& .forCancel.button', s.inlineBlock),
  select('.PostGrid & .forCancel.button', s.inlineBlock),
  media(s.minBreak2, select('& .forCancel.button', s.displayNone)),
)

const rightStyle = css(
  select('& button + button', s.ml10),
  select('& button:first-child', s.ml0),
)

const buttonStyle = css(
  s.bgcBlack,
  s.colorWhite,
  s.hv40,
  s.wv40,
  s.lh40,
  s.nowrap,
  {
    borderRadius: 5,
    transition: `background-color 0.2s ease, color 0.2s ease, width 0.2s ${s.ease}`,
  },
  disabled(s.pointerNone, s.bgcA),
  hover({ backgroundColor: '#6a6a6a' }),
  media(
    s.minBreak2,
    { width: 'auto' },
    select('&.forSubmit',
      { minWidth: 120 },
    ),
  ),
  modifier('.isBuyLinked', s.bgcGreen),
  modifier(
    '.forComment',
    parent(
      '.isComment',
      s.wv40,
      disabled(s.bgcA),
    ),
    parent(
      '.PostGrid .isComment',
      s.wv40,
    ),
  ),
  modifier('.forSubmit', s.bgcGreen, disabled(s.bgcA), hover({ backgroundColor: '#02b302' }), { width: 'auto' }),
  parent('.isComment', s.wv40, media(s.minBreak2, s.wv40)),
  parent('.PostGrid', s.wv40, media(s.minBreak2, s.wv40)),
)

const buttonContentsStyle = css(
  s.inlineFlex,
  s.itemsCenter,
  s.contentCenter,
  s.justifySpaceBetween,
  s.fullWidth,
  s.fullHeight,
  s.pl20,
  s.pr20,
)

const cancelTextButtonStyle = css(
  s.colorA,
  s.px10,
  { width: 'auto' },
  hover({ color: '#6a6a6a' }),
)

const labelStyle = css(
  s.displayNone,
  { marginRight: 10 },
  media(
    s.minBreak2,
    s.inlineBlock,
    select('& + .SVGIcon', { marginLeft: 10 }),
    parent(
      '.PostDetail .forComment',
      // select('& + .SVGIcon', { marginRight: 11, marginLeft: 11 }),
    ),
  ),
  // parent('.forSubmit', s.inlineBlock, select('& + .SVGIcon', { marginRight: 11 })),
  parent('.isComment', s.displayNone, select('& + .SVGIcon', s.mr0)),
  parent('.PostGrid', s.displayNone, select('& + .SVGIcon', s.mr0)),
  parent('.PostGrid .isComment .forComment', s.displayNone, select('& + .SVGIcon', s.mr0)),
  parent('.forSubmit',
    s.inlineBlock,
    select('& + .SVGIcon', { transform: 'scale(1.2)' }),
  ),
)

const hide = css(s.hide)

function mapStateToProps(state, props) {
  return {
    subscribedCategories: selectSubscribedCategories(state, props),
    featuredInCategories: selectFeaturedInCategories(state, props),
    unsubscribedCategories: selectUnsubscribedCategories(state, props),
    selectedCategories: selectPostSelectedCategories(state, props),
  }
}

class PostActionBar extends Component {

  static propTypes = {
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool.isRequired,
    editorId: PropTypes.string.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    hasMedia: PropTypes.bool,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
    postIntoCategory: PropTypes.bool.isRequired,
    subscribedCategories: PropTypes.array.isRequired,
    selectedCategories: PropTypes.array.isRequired,
    featuredInCategories: PropTypes.array.isRequired,
    unsubscribedCategories: PropTypes.array.isRequired,
  }

  static defaultProps = {
    buyLink: null,
    hasMedia: false,
    replyAllAction: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      resetCategorySelection: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset the resets
    if (!prevState.resetCategorySelection && this.state.resetCategorySelection) {
      this.refreshResets()
    }
  }

  onAddBuyLink = ({ value }) => {
    const { dispatch, editorId } = this.props
    dispatch(updateBuyLink(editorId, value))
    this.onCloseModal()
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onSelectCategory = (category) => {
    const { dispatch, editorId } = this.props
    dispatch(updateCategoryId(editorId, category.get('id')))

    this.setState({
      resetCategorySelection: true,
    })
  }

  onClearCategory = () => {
    const { dispatch, editorId } = this.props
    dispatch(clearCategoryId(editorId))
  }

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
  }

  handleFileBrowser = (e) => {
    const { handleFileAction } = this.props
    handleFileAction(e)
    this.fileBrowser.value = ''
  }

  browse = () => {
    this.browseButton.blur()
    this.fileBrowser.click()
  }

  cancel = () => {
    this.props.cancelAction()
  }

  money = () => {
    const { dispatch, buyLink, submitText } = this.props
    dispatch(openModal(
      <BuyLinkDialog
        dispatch={dispatch}
        onConfirm={this.onAddBuyLink}
        onDismiss={this.onCloseModal}
        text={buyLink}
        editorType={submitText}
      />))
  }

  refreshResets = () => {
    this.setState({
      resetCategorySelection: false,
    })
  }

  render() {
    const {
      disableSubmitAction,
      hasMedia,
      replyAllAction,
      submitText,
      editorId,
      postIntoCategory,
      subscribedCategories,
      selectedCategories,
      featuredInCategories,
      unsubscribedCategories,
    } = this.props
    const { resetCategorySelection } = this.state
    const isBuyLinked = this.props.buyLink && this.props.buyLink.length
    return (
      <div className={wrapperStyle} id={editorId}>
        <div className={leftStyle}>
          <button className={`PostActionButton forCancel text ${cancelTextButtonStyle}`} onClick={this.cancel}>
            <span>Cancel</span>
          </button>
          {replyAllAction &&
            <button className={`PostActionButton forReplyAll ${buttonStyle}`} onClick={replyAllAction}>
              <div className={buttonContentsStyle}>
                <span className={labelStyle}>Reply All</span>
                <ReplyAllIcon />
              </div>
            </button>
          }
          <button
            className={`PostActionButton forCancel button ${buttonStyle}`}
            onClick={this.cancel}
            disabled={disableSubmitAction}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>Cancel</span>
              <XIconLG />
            </div>
          </button>
        </div>

        <div className={rightStyle}>
          <button
            className={`PostActionButton forUpload ${buttonStyle}`}
            onClick={this.browse}
            ref={(comp) => { this.browseButton = comp }}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>Upload</span>
              <BrowseIcon />
            </div>
          </button>
          <button
            className={classNames('PostActionButton forMoney', { isBuyLinked }, `${buttonStyle}`)}
            disabled={!hasMedia}
            onClick={this.money}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>Sell</span>
              <MoneyIconCircle />
            </div>
          </button>
          {postIntoCategory &&
            <CategoryPostSelector
              onSelect={this.onSelectCategory}
              onClear={this.onClearCategory}
              subscribedCategories={subscribedCategories}
              featuredInCategories={featuredInCategories}
              unsubscribedCategories={unsubscribedCategories}
              selectedCategories={selectedCategories}
              resetSelection={resetCategorySelection}
            />
          }
          <button
            className={`PostActionButton forSubmit for${submitText} ${buttonStyle}`}
            disabled={disableSubmitAction}
            ref={(comp) => { this.submitButton = comp }}
            onClick={this.submitted}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>{submitText}</span>
              <ArrowIcon />
            </div>
          </button>
        </div>
        <input
          className={hide}
          onChange={this.handleFileBrowser}
          ref={(comp) => { this.fileBrowser = comp }}
          type="file"
          accept="image/*"
          multiple
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(PostActionBar)

