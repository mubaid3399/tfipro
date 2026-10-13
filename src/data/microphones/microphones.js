import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const microphones = [
  {
    id: 'microphoneProduct1',
    title: 'Handheld Microphone',
    description: `Handheld microphone for voice and audio recording setups. ${sampleNote}`,
    actualPrice: 3900,
    discountedPrice: 3099,
    bestseller: false,
    subcategory: 'Microphones',
    image: asset.handheldMicrophone,
  },
  {
    id: 'microphoneProduct2',
    title: 'RGB Desktop Microphone',
    description: `Desktop microphone with RGB-style lighting. ${sampleNote}`,
    actualPrice: 4500,
    discountedPrice: 3599,
    bestseller: true,
    subcategory: 'Microphones',
    image: asset.rgbDesktopMicrophone,
  },
  {
    id: 'microphoneProduct3',
    title: 'Studio Microphone',
    description: `Studio-style microphone with a desktop stand. ${sampleNote}`,
    actualPrice: 5200,
    discountedPrice: 4199,
    bestseller: false,
    subcategory: 'Microphones',
    image: asset.studioMicrophone,
  },
  {
    id: 'microphoneProduct4',
    title: 'Wireless Microphone Set',
    description: `Wireless microphone set for audio recording and speaking. ${sampleNote}`,
    actualPrice: 5800,
    discountedPrice: 4699,
    bestseller: false,
    subcategory: 'Microphones',
    image: asset.wirelessMicrophoneSet,
  },
]

export const microphonesProducts = microphones

export default microphones
