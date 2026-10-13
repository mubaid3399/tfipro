import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const stands = [
  {
    id: 'standProduct1',
    title: 'Ergonomic Foldable Laptop Riser Stand',
    description: `Portable multi-angle aluminum laptop riser stand with anti-slip silicone cushions and foldable travel design. ${sampleNote}`,
    actualPrice: 3200,
    discountedPrice: 2299,
    bestseller: true,
    subcategory: 'Stands & Mounts',
    image: asset.foldableLaptopRiserStand,
  },
  {
    id: 'standProduct2',
    title: '360° Swivel Aluminum Phone & Tablet Stand',
    description: `Premium space gray CNC aluminum desktop stand featuring a 360-degree rotating swivel base and dual pivot tilt adjustment. ${sampleNote}`,
    actualPrice: 2800,
    discountedPrice: 1999,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.swivelAluminumDeskStand,
  },
  {
    id: 'standProduct3',
    title: 'Pro 360° Swivel Adjustable Mobile Stand',
    description: `Heavy-duty weighted base phone holder with 360-degree smooth rotation and ergonomic multi-angle viewing for mobile devices. ${sampleNote}`,
    actualPrice: 2900,
    discountedPrice: 2099,
    bestseller: true,
    subcategory: 'Stands & Mounts',
    image: asset.proSwivelMobileStand,
  },
  {
    id: 'standProduct4',
    title: 'Wireless Speaker & Desktop Phone Stand Dock',
    description: `Versatile 2-in-1 desktop smartphone dock with an integrated Bluetooth wireless speaker base and adjustable folding viewing cradle. ${sampleNote}`,
    actualPrice: 4200,
    discountedPrice: 3199,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.speakerPhoneStandDock,
  },
  {
    id: 'standProduct5',
    title: 'Telescopic Live Stream & Video Recording Phone Mount',
    description: `Overhead telescopic tripod phone mount with 360° rotational clamp designed for vlogging, video recording, live streaming, and video calls. ${sampleNote}`,
    actualPrice: 3500,
    discountedPrice: 2599,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.telescopicLiveStreamPhoneMount,
  },
]

export const standsProducts = stands

export default stands
