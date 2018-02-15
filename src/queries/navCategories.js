import { tshirtImageVersions } from './fragments'

export default `
  ${tshirtImageVersions}
  {
    categoryNav {
      id
      name
      slug
      level
      tileImage { ...tshirtImageVersions }
    }
  }
`
