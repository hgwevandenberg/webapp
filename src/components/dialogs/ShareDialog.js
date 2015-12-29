import React, { Component, PropTypes } from 'react'
import {
  FacebookIcon,
  GooglePlusIcon,
  LinkedInIcon,
  MailIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
} from './ShareDialogIcons'

const SHARE_TYPES = {
  EMAIL: 'email',
  FACEBOOK: 'facebook',
  GOOGLE_PLUS: 'google+',
  LINKEDIN: 'linkedin',
  PINTEREST: 'pinterest',
  REDDIT: 'reddit',
  TUMBLR: 'tumblr',
  TWITTER: 'twitter',
}

const SHARE_DIMENSIONS = {}
SHARE_DIMENSIONS[SHARE_TYPES.FACEBOOK] = { width: 480, height: 210 }
SHARE_DIMENSIONS[SHARE_TYPES.GOOGLE_PLUS] = { width: 500, height: 385 }
SHARE_DIMENSIONS[SHARE_TYPES.LINKEDIN] = { width: 550, height: 460 }
SHARE_DIMENSIONS[SHARE_TYPES.PINTEREST] = { width: 750, height: 320 }
SHARE_DIMENSIONS[SHARE_TYPES.REDDIT] = { width: 540, height: 420 }
SHARE_DIMENSIONS[SHARE_TYPES.TUMBLR] = { width: 450, height: 430 }
SHARE_DIMENSIONS[SHARE_TYPES.TWITTER] = { width: 520, height: 250 }

class ShareDialog extends Component {
  static propTypes = {
    author: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    trackEvent: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    const { author, post } = this.props
    this.postLink = `${window.location.protocol}//${window.location.host}/${author.username}/post/${post.token}`
    let summary = 'Check out this post on Ello'
    // email string, since we can fit more text content
    const emailSubject = `${summary}, via @${author.username}`
    // grab out the image and summary from the post
    this.image = null
    for (const region of post.summary) {
      if (region.kind === 'text') {
        const div = document.createElement('div')
        div.innerHTML = region.data
        summary = div.textContent
      } else if (!this.image && region.kind === 'image') {
        this.image = region.data.url
        if (this.image.indexOf('//') === 0) {
          this.image = `http:${this.image}`
        }
      }
    }
    // truncate the tweet summary to be <= 140
    let tweetSummary = summary
    if (tweetSummary.length + this.postLink.length > 139) {
      tweetSummary = tweetSummary.substr(0, 139 - this.postLink.length)
      const summaryArr = tweetSummary.split(' ')
      summaryArr.pop()
      tweetSummary = summaryArr.join(' ')
    }
    // create "safe" versions of what we need to use
    this.postLinkSafe = window.encodeURIComponent(this.postLink)
    this.summarySafe = window.encodeURIComponent(summary)
    this.tweetSummarySafe = window.encodeURIComponent(tweetSummary)
    this.emailSubjectSafe = window.encodeURIComponent(emailSubject)
    this.emailBodySafe = `${this.summarySafe}%0D%0A%0D%0A${this.postLinkSafe}`
  }

  getUrl(type) {
    switch (type) {
      case SHARE_TYPES.FACEBOOK:
        return `https://www.facebook.com/sharer/sharer.php?u=${this.postLinkSafe}`
      case SHARE_TYPES.GOOGLE_PLUS:
        return `https://plus.google.com/share?url=${this.postLinkSafe}`
      case SHARE_TYPES.LINKEDIN:
        return `http://www.linkedin.com/shareArticle?mini=true&url=${this.postLinkSafe}&title=${this.summarySafe}`
      case SHARE_TYPES.PINTEREST:
        return `http://pinterest.com/pin/create/button/?url=${this.postLinkSafe}&description=${this.summarySafe}&media=${this.image}`
      case SHARE_TYPES.REDDIT:
        return `http://reddit.com/submit?url=${this.postLinkSafe}&title=${this.summarySafe}`
      case SHARE_TYPES.TUMBLR:
        return `http://www.tumblr.com/share/link?url=${this.postLinkSafe}&name=${this.summarySafe}`
      case SHARE_TYPES.TWITTER:
        return `https://twitter.com/intent/tweet?url=${this.postLinkSafe}&text=${this.tweetSummarySafe}`
      case SHARE_TYPES.EMAIL:
      default:
        return `mailto:?subject=${this.emailSubjectSafe}&body=${this.emailBodySafe}`
    }
  }

  popShareWindow(type) {
    const url = this.getUrl(type)
    const { trackEvent } = this.props
    if (url.indexOf('mailto') === 0) {
      document.location.href = url
    } else {
      const width = SHARE_DIMENSIONS[type].width || 700
      const height = SHARE_DIMENSIONS[type].height || 450
      window.open(url, 'sharewindow', `width=${width}, height=${height}, left=${window.innerWidth / 2 - width / 2}, top=${window.innerHeight / 2 - height / 2}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`)
    }
    if (trackEvent) {
      trackEvent(`share-to-${type}`)
    }
  }

  render() {
    return (
      <div className="Dialog ShareDialog">
        <input
          className="ShareControl"
          type="url"
          readOnly
          onClick={(e) => e.target.select()}
          value={this.postLink} />
        <div className="ShareLinks">
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.EMAIL)}><MailIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.FACEBOOK)}><FacebookIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.TWITTER)}><TwitterIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.PINTEREST)}><PinterestIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.GOOGLE_PLUS)}><GooglePlusIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.TUMBLR)}><TumblrIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.REDDIT)}><RedditIcon/></button>
          <button className="ShareLink" onClick={() => this.popShareWindow(SHARE_TYPES.LINKEDIN)}><LinkedInIcon/></button>
        </div>
      </div>
    )
  }
}

export default ShareDialog
