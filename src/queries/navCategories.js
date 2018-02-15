import { tshirtImageVersions } from './fragments'

export default `
  ${tshirtImageVersions}
  {
    categoryNav {
      id
      name
      slug
      tileImage { ...tshirtImageVersions }
    }
  }
`
