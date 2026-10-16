import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const accessories = [
  {
    id: 'accessoryProduct1',
    title: 'Power Adapter',
    description: `Compact power adapter for compatible electronic devices. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: false,
    subcategory: 'Power Accessories',
    image: asset.powerAdapter,
  },
  {
    id: 'accessoryProduct2',
    title: 'Power Bank',
    description: `Portable power bank for charging compatible devices. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: true,
    subcategory: 'Power Accessories',
    image: asset.powerBank,
  },
  {
    id: 'accessoryProduct3',
    title: 'Ultra 7 in 1 Strap Smartwatch',
    description: `Ultra smartwatch featuring 7 interchangeable straps. ${sampleNote}`,
    actualPrice: 4200,
    discountedPrice: 3199,
    bestseller: false,
    subcategory: 'Smartwatches',
    image: asset.ultra7in1OrangeSmartwatch,
  },
  {
    id: 'accessoryProduct4',
    title: 'Three-in-One Wireless Charging Station',
    description: `Wireless charging station shown with multiple device charging areas. ${sampleNote}`,
    actualPrice: 5600,
    discountedPrice: 4499,
    bestseller: false,
    subcategory: 'Chargers',
    image: asset.wirelessChargingStation,
  },
  {
    id: 'accessoryProduct5',
    title: 'USB Audio Adapter',
    description: `USB audio accessory for compatible devices. ${sampleNote}`,
    actualPrice: 3200,
    discountedPrice: 2499,
    bestseller: false,
    subcategory: 'Audio Accessories',
    image: asset.usbAudioAdapter,
  },
  {
    id: 'accessoryProduct6',
    title: 'USB Wall Charger',
    description: `Wall charger with USB ports for compatible devices. ${sampleNote}`,
    actualPrice: 2800,
    discountedPrice: 2099,
    bestseller: false,
    subcategory: 'Chargers',
    image: asset.usbWallCharger,
  },
  {
    id: 'accessoryProduct7',
    title: 'Wi-Fi Extender',
    description: `Plug-in Wi-Fi extender for compatible wireless networks. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 3099,
    bestseller: false,
    subcategory: 'Network Accessories',
    image: asset.wifiExtender,
  },
  {
    id: 'accessoryProduct8',
    title: '25W USB-C Power Adapter',
    description: `25W USB-C fast charging wall power adapter with foldable pins for smartphones and portable devices. ${sampleNote}`,
    actualPrice: 2200,
    discountedPrice: 1599,
    bestseller: false,
    subcategory: 'Chargers',
    image: asset.usbCPowerAdapter,
  },
  {
    id: 'accessoryProduct9',
    title: 'Type-C to Type-C & 3.5mm Audio Adapter (2-in-1 OTG)',
    description: `2-in-1 Type-C splitter adapter featuring simultaneous Type-C fast charging and 3.5mm audio headphone jack output. ${sampleNote}`,
    actualPrice: 3200,
    discountedPrice: 2499,
    bestseller: true,
    subcategory: 'Audio Accessories',
    image: asset.typeCOtgAudioAdapter,
  },
]

export const accessoriesProducts = accessories

export default accessories
