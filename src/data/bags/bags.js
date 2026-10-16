import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const bags = [
  {
    id: 'bagProduct1',
    title: 'Compact Backpack',
    description: `Compact everyday backpack with a practical storage design. ${sampleNote}`,
    actualPrice: 4999,
    discountedPrice: 3999,
    bestseller: false,
    subcategory: 'Backpacks',
    image: asset.compactBackpack,
  },
  {
    id: 'bagProduct2',
    title: 'Hard-Shell Backpack',
    description: `Structured backpack with a hard-shell exterior. ${sampleNote}`,
    actualPrice: 8999,
    discountedPrice: 7300,
    bestseller: false,
    subcategory: 'Backpacks',
    image: asset.hardShellBackpack,
  },
  {
    id: 'bagProduct3',
    title: 'Laptop Backpack',
    description: `Backpack designed to carry a laptop and daily essentials. ${sampleNote}`,
    actualPrice: 3999,
    discountedPrice: 2999,
    bestseller: true,
    subcategory: 'Backpacks',
    image: asset.laptopBackpack,
  },
  {
    id: 'bagProduct4',
    title: 'Leather Messenger Bag',
    description: `Messenger-style shoulder bag with a leather-look finish. ${sampleNote}`,
    actualPrice: 5800,
    discountedPrice: 4500,
    bestseller: false,
    subcategory: 'Messenger Bags',
    image: asset.leatherMessengerBag,
  },
  {
    id: 'bagProduct5',
    title: 'Roll-Top Backpack',
    description: `Roll-top backpack for carrying everyday belongings. ${sampleNote}`,
    actualPrice: 8500,
    discountedPrice: 6800,
    bestseller: false,
    subcategory: 'Backpacks',
    image: asset.rollTopBackpack,
  },
  {
    id: 'bagProduct6',
    title: 'Two-Tone Urban Laptop Backpack',
    description: `Modern two-tone commuter backpack with geometric slash front pocket, dual compartments, and padded laptop sleeve. ${sampleNote}`,
    actualPrice: 7600,
    discountedPrice: 6199,
    bestseller: true,
    subcategory: 'Backpacks',
    image: asset.twoToneUrbanLaptopBackpack,
  },
  {
    id: 'bagProduct7',
    title: 'Grey Heather Business Laptop Backpack',
    description: `Streamlined executive backpack in heather grey fabric with a quick-access vertical red zipper pocket and padded shoulder straps. ${sampleNote}`,
    actualPrice: 5600,
    discountedPrice: 4499,
    bestseller: false,
    subcategory: 'Backpacks',
    image: asset.greyHeatherLaptopBackpack,
  },
  {
    id: 'bagProduct8',
    title: 'Commuter USB Charging Laptop Backpack',
    description: `Ergonomic lightweight backpack featuring an integrated external USB charging port, breathable mesh back panel, and water-resistant finish. ${sampleNote}`,
    actualPrice: 6800,
    discountedPrice: 5499,
    bestseller: true,
    subcategory: 'Backpacks',
    image: asset.commuterUsbChargingBackpack,
  },
  {
    id: 'bagProduct9',
    title: 'Stealth All-Black Executive Backpack',
    description: `Minimalist all-black business backpack with ballistic nylon construction, external USB port pass-through, and dedicated device compartments. ${sampleNote}`,
    actualPrice: 5900,
    discountedPrice: 4799,
    bestseller: false,
    subcategory: 'Backpacks',
    image: asset.stealthExecutiveLaptopBackpack,
  },
]

export const bagsProducts = bags

export default bags
