// constants/Data.ts

export const LISTINGS = [
  {
    id: 1,
    title: '101ha Agri-Residential Estate',
    type: 'Commercial',
    price: '₱659.3M',
    address: 'National Hwy, Brgy. Tambler, GenSan',
    lat: 6.0650,
    lng: 125.1300,
    // Converted to array for gallery
    images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600'
    ],
    details: '101.43 Hectares. Flat terrain front, rolling back overlooking sea. Near Fish ports and Resorts.',
    payToView: true,
    polygon: [
      { latitude: 6.0655, longitude: 125.1295 },
      { latitude: 6.0655, longitude: 125.1305 },
      { latitude: 6.0645, longitude: 125.1310 },
      { latitude: 6.0640, longitude: 125.1300 },
      { latitude: 6.0645, longitude: 125.1290 },
    ]
  },
  {
    id: 2,
    title: '60ha Prime Development Lot',
    type: 'Commercial',
    price: '₱1.2B',
    address: 'Brgy. San Isidro, GenSan',
    lat: 6.1350,
    lng: 125.1950,
    images: [
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1599809275372-b4036fa43633?auto=format&fit=crop&q=80&w=600'
    ],
    details: 'R2 Zoning. Along Brgy Road with 900m frontage. Near Dionisia Pacquiao subdivision.',
    payToView: true,
    polygon: [
      { latitude: 6.1355, longitude: 125.1945 },
      { latitude: 6.1355, longitude: 125.1955 },
      { latitude: 6.1345, longitude: 125.1960 },
      { latitude: 6.1340, longitude: 125.1950 },
      { latitude: 6.1345, longitude: 125.1940 },
    ]
  },
  {
    id: 3,
    title: 'Corner Lot near UST',
    type: 'Private',
    price: '₱4.5M',
    address: 'Baluan, General Santos City',
    lat: 6.1300,
    lng: 125.1600,
    images: [
        'https://images.unsplash.com/photo-1599809275372-b4036fa43633?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600'
    ],
    details: '250m from Highway. Corner lot along cemented road. Ideal for apartment or mini warehouse.',
    payToView: true,
    polygon: [
      { latitude: 6.1305, longitude: 125.1595 },
      { latitude: 6.1305, longitude: 125.1605 },
      { latitude: 6.1295, longitude: 125.1610 },
      { latitude: 6.1290, longitude: 125.1600 },
      { latitude: 6.1295, longitude: 125.1590 },
    ]
  },
  {
    id: 4,
    title: 'Semi-Commercial Lot',
    type: 'Private',
    price: '₱4M',
    address: 'Mabuhay, General Santos City',
    lat: 6.1600,
    lng: 125.1800,
    images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'
    ],
    details: '130m from Diversion Rd. 15 mins to UST. Best for office, warehouse, or simple subdivision.',
    payToView: true,
    polygon: [
      { latitude: 6.1605, longitude: 125.1795 },
      { latitude: 6.1605, longitude: 125.1805 },
      { latitude: 6.1595, longitude: 125.1810 },
      { latitude: 6.1590, longitude: 125.1800 },
      { latitude: 6.1595, longitude: 125.1790 },
    ]
  },
];

export const BARANGAYS = [
  'Apopong', 'Baluan', 'Batomelong', 'Buayan', 'Bula', 'Calumpang', 
  'City Heights', 'Conel', 'Dadiangas East', 'Dadiangas North', 
  'Dadiangas South', 'Dadiangas West', 'Fatima', 'Katangawan', 
  'Labangal', 'Lagao', 'Ligaya', 'Mabuhay', 'Mao-i', 'Olympog', 
  'San Isidro', 'San Jose', 'Siguel', 'Sinawal', 'Tambler', 'Tinagacan', 'Upper Labay'
];