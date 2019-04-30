export function getABState() {
  try {
    const abState = JSON.parse(localStorage.getItem('abState')) || {}
    return abState
  } catch (error) {
    return {}
  }
}


export function shouldShowBlog() {
  const abState = getABState()
  if (abState.shouldShowBlog !== true && abState.shouldShowBlog !== false) {
    abState.shouldShowBlog = Math.random() > 0.8
    try {
      localStorage.setItem('abState', JSON.stringify(abState))
    } catch (error) {
    }
  }
  return abState.shouldShowBlog
}
