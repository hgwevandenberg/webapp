import { tshirtImageVersions } from './fragments'

export default `
  ${tshirtImageVersions}
  {
    allCategories {
      id
      name
      slug
      level
      order
      allowInOnboarding
      isCreatorType
      tileImage { ...tshirtImageVersions }
    }
  }
`
