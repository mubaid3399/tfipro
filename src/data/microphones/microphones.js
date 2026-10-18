import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const microphones = [
  {
    id: 'microphone-wireless-lavalier-lapel',
    legacyId: 'microphoneProduct2',
    category: 'microphones',
    title: 'Wireless Lavalier Lapel Microphone',
    description: `Ultra-compact wireless lavalier clip-on microphone featuring 20m transmission distance, 10-hour battery life, DSP intelligent noise reduction, and universal compatibility. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: true,
    subcategory: 'Microphones',
    image: asset.wirelessLavalierMic,
  },
  {
    id: 'microphone-wireless-set-dual',
    legacyId: 'microphoneProduct4',
    category: 'microphones',
    title: 'Wireless Microphone Set',
    description: `Wireless microphone set for audio recording and speaking. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: false,
    subcategory: 'Microphones',
    image: asset.wirelessMicrophoneSet,
  },
]

export const microphonesProducts = microphones

export default microphones
