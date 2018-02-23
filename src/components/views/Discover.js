import React from 'react'
import PropTypes from 'prop-types'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Discover = ({
  streamAction,
  }) =>
    (<MainView className="Discover">
      <StreamContainer
        action={streamAction}
        paginatorText="Load More"
      />
    </MainView>)

Discover.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Discover

