import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const headphones = [
  {
    id: 'headphoneProduct1',
    title: 'Brown Wireless Headphones',
    description: `Brown over-ear headphones with a wireless-style design. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: false,
    subcategory: 'Over-Ear Headphones',
    image: asset.brownWirelessHeadphones,
  },
  {
    id: 'headphoneProduct3',
    title: 'Over-Ear Headphones',
    description: `Over-ear headphones with padded ear cups. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: true,
    subcategory: 'Over-Ear Headphones',
    image: asset.overEarHeadphones,
  },
  {
    id: 'headphoneProduct4',
    title: 'Pink Cat-Ear Headphones',
    description: `Pink over-ear headphones with decorative cat ears. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 3100,
    bestseller: false,
    subcategory: 'Over-Ear Headphones',
    image: asset.pinkCatEarHeadphones,
  },
  {
    id: 'headphoneProduct5',
    title: 'Pink RGB Headphones',
    description: `Pink over-ear headphones with RGB-style lighting. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 3100,
    bestseller: false,
    subcategory: 'Over-Ear Headphones',
    image: asset.pinkRgbHeadphones,
  },
  {
    id: 'headphoneProduct6',
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
