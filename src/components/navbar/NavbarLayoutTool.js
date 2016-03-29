import React, { PropTypes } from 'react'

const NavbarLayoutTool = ({ icon, onClick }) =>
  <button className="NavbarLayoutTool" onClick={ onClick } >
    { icon }
  </button>

NavbarLayoutTool.propTypes = {
  icon: PropTypes.node,
  onClick: PropTypes.func,
}

export default NavbarLayoutTool
