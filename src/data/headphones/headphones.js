import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const headphones = [
  {
    id: 'headphone-brown-wireless',
    legacyId: 'headphoneProduct1',
    category: 'headphones',
    title: 'Brown Wireless Headphones',
    description: `Brown over-ear headphones with a wireless-style design. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: false,
    subcategory: 'Over-Ear Headphones',
    image: asset.brownWirelessHeadphones,
  },
  {
    id: 'headphone-over-ear-studio',
    legacyId: 'headphoneProduct3',
    category: 'headphones',
    title: 'Over-Ear Headphones',
    description: `Over-ear headphones with padded ear cups. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: true,
    subcategory: 'Over-Ear Headphones',
    image: asset.overEarHeadphones,
  },
  {
    id: 'headphone-pink-cat-ear',
    legacyId: 'headphoneProduct4',
    category: 'headphones',
    title: 'Pink Cat-Ear Headphones',
    description: `Pink over-ear headphones with decorative cat ears. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 3100,
    bestseller: false,
    subcategory: 'Over-Ear Headphones',
    image: asset.pinkCatEarHeadphones,
  },
  {
    id: 'headphone-pink-rgb-gaming',
    legacyId: 'headphoneProduct5',
    category: 'headphones',
    title: 'Pink RGB Headphones',
    description: `Pink over-ear headphones with RGB-style lighting. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 3100,
    bestseller: false,
    subcategory: 'Over-Ear Headphones',
    image: asset.pinkRgbHeadphones,
  },
  {
    id: 'headphone-wired-gaming-headset',
    legacyId: 'headphoneProduct6',
    category: 'headphones',
    title: 'Wired Gaming Headset',
    description: `Wired over-ear gaming headset with a boom microphone. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 3100,
    bestseller: true,
    subcategory: 'Gaming Headsets',
    image: asset.wiredGamingHeadset,
  },
]

export const headphonesProducts = headphones

export default headphones
