import { earbuds } from './earbuds/earbuds'
import { headphones } from './headphones/headphones'
import { bags } from './bags/bags'
import { microphones } from './microphones/microphones'
import { accessories } from './accessories/accessories'
import { watches } from './watches/watches'
import { stands } from './stands/stands'

export {
  earbuds,
  headphones,
  bags,
  microphones,
  accessories,
  watches,
  stands,
}

export const products = [
  ...earbuds,
  ...headphones,
  ...bags,
  ...microphones,
  ...accessories,
  ...watches,
  ...stands,
]

export default products
