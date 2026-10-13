import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const accessories = [
  {
    id: 'accessoryProduct1',
    title: 'Power Adapter',
    description: `Compact power adapter for compatible electronic devices. ${sampleNote}`,
    actualPrice: 1800,
    discountedPrice: 1399,
    bestseller: false,
    subcategory: 'Power Accessories',
    image: asset.powerAdapter,
  },
  {
    id: 'accessoryProduct2',
    title: 'Power Bank',
    description: `Portable power bank for charging compatible devices. ${sampleNote}`,
    actualPrice: 3200,
    discountedPrice: 2499,
    bestseller: true,
    subcategory: 'Power Accessories',
    image: asset.powerBank,
  },
  {
    id: 'accessoryProduct3',
    title: 'Ultra 7 in 1 Strap Smartwatch',
    description: `Ultra smartwatch featuring 7 interchangeable straps. ${sampleNote}`,
    actualPrice: 2600,
    discountedPrice: 1999,
    bestseller: false,
    subcategory: 'Smartwatches',
    image: asset.ultra7in1OrangeSmartwatch,
  },
  {
    id: 'accessoryProduct4',
    title: 'Three-in-One Wireless Charging Station',
    description: `Wireless charging station shown with multiple device charging areas. ${sampleNote}`,
    actualPrice: 4900,
    discountedPrice: 3899,
    bestseller: false,
    subcategory: 'Chargers',
    image: asset.wirelessChargingStation,
  },
  {
    id: 'accessoryProduct5',
    title: 'USB Audio Adapter',
    description: `USB audio accessory for compatible devices. ${sampleNote}`,
    actualPrice: 1700,
    discountedPrice: 1299,
    bestseller: false,
    subcategory: 'Audio Accessories',
    image: asset.usbAudioAdapter,
  },
  {
    id: 'accessoryProduct6',
    title: 'USB Wall Charger',
    description: `Wall charger with USB ports for compatible devices. ${sampleNote}`,
    actualPrice: 1500,
    discountedPrice: 1099,
    bestseller: false,
    subcategory: 'Chargers',
    image: asset.usbWallCharger,
  },
  {
    id: 'accessoryProduct7',
    title: 'Wi-Fi Extender',
    description: `Plug-in Wi-Fi extender for compatible wireless networks. ${sampleNote}`,
    actualPrice: 3600,
    discountedPrice: 2799,
    bestseller: false,
    subcategory: 'Network Accessories',
    image: asset.wifiExtender,
  },
]

export const accessoriesProducts = accessories

export default accessories
