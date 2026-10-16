import { asset } from '../../assets/asset'

const sampleNote =
  'Sample catalog copy and pricing. Verify product specifications and prices before publishing.'

export const stands = [
  {
    id: 'standProduct1',
    title: 'Ergonomic Foldable Laptop Riser Stand',
    description: `Portable multi-angle aluminum laptop riser stand with anti-slip silicone cushions and foldable travel design. ${sampleNote}`,
    actualPrice: 3200,
    discountedPrice: 2499,
    bestseller: true,
    subcategory: 'Stands & Mounts',
    image: asset.foldableLaptopRiserStand,
  },
  {
    id: 'standProduct2',
    title: '360° Swivel Aluminum Phone & Tablet Stand',
    description: `Premium space gray CNC aluminum desktop stand featuring a 360-degree rotating swivel base and dual pivot tilt adjustment. ${sampleNote}`,
    actualPrice: 1600,
    discountedPrice: 1099,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.swivelAluminumDeskStand,
  },
  {
    id: 'standProduct3',
    title: 'Pro 360° Swivel Adjustable Mobile Stand',
    description: `Heavy-duty weighted base phone holder with 360-degree smooth rotation and ergonomic multi-angle viewing for mobile devices. ${sampleNote}`,
    actualPrice: 2200,
    discountedPrice: 1499,
    bestseller: true,
    subcategory: 'Stands & Mounts',
    image: asset.proSwivelMobileStand,
  },
  {
    id: 'standProduct4',
    title: 'Wireless Speaker & Desktop Phone Stand Dock',
    description: `Versatile 2-in-1 desktop smartphone dock with an integrated Bluetooth wireless speaker base and adjustable folding viewing cradle. ${sampleNote}`,
    actualPrice: 4500,
    discountedPrice: 3499,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.speakerPhoneStandDock,
  },
  {
    id: 'standProduct5',
    title: 'Telescopic Live Stream & Video Recording Phone Mount',
    description: `Overhead telescopic tripod phone mount with 360° rotational clamp designed for vlogging, video recording, live streaming, and video calls. ${sampleNote}`,
    actualPrice: 2400,
    discountedPrice: 1799,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.telescopicLiveStreamPhoneMount,
  },
  {
    id: 'standProduct6',
    title: '3.5ft Adjustable Tripod Stand for Mobile & Camera with Bag',
    description: `Lightweight aluminum 3.5ft adjustable tripod stand (Tripod 3110) with 3-way pan head, flip locks, smartphone holder clip, and portable carry bag. ${sampleNote}`,
    actualPrice: 4999,
    discountedPrice: 3999,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.adjustableTripodStand,
  },
  {
    id: 'standProduct7',
    title: 'R1S 360° Rotating Selfie Stick Tripod with Fill Light',
    description: `740mm extendable selfie stick and mini tripod stand in black ABS plastic with 360° rotation, built-in LED fill light, and wireless remote. ${sampleNote}`,
    actualPrice: 2600,
    discountedPrice: 1999,
    bestseller: true,
    subcategory: 'Stands & Mounts',
    image: asset.selfieStickTripod,
  },
  {
    id: 'standProduct8',
    title: 'Automatic Clamping Wireless Car Mount & Charger',
    description: `Smart sensor auto-clamping air vent car phone mount with Qi fast wireless charging, metallic chrome finish, and touch-sensitive release. ${sampleNote}`,
    actualPrice: 3500,
    discountedPrice: 2499,
    bestseller: false,
    subcategory: 'Stands & Mounts',
    image: asset.wirelessCarMountStand,
  },
  {
    id: 'standProduct9',
    title: 'M3 Smart Sensor Auto-Clamping Car Wireless Charger Mount',
    description: `Gunmetal black smart car mount featuring electric auto-clamping, dual infrared and touch sensors, Qi wireless & magnetic charging, and ambient LED light. ${sampleNote}`,
    actualPrice: 3800,
    discountedPrice: 2699,
    bestseller: true,
    subcategory: 'Stands & Mounts',
    image: asset.m3SmartCarMount,
  },
]

export const standsProducts = stands

export default stands
