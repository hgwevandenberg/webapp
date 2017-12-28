import React from 'react'
// import PropTypes from 'prop-types'

// Wraps LightBox controls/state around a component
// This function takes a component
export default function (WrappedComponent) {
  // console.log('$$$ lol')
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false,
      }
    }

    componentDidMount() {
      // console.log('$$$ hi')
    }

    componentWillUnmount() {
      // console.log('$$$ goodbye')
    }

    componentDidUpdate() {
      // console.log(this.props)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
