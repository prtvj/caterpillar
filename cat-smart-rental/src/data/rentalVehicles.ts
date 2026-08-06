export interface RentalVehicle {
  id: string;
  type: string;
  model: string;
  category: string;
  image: string;
  usageDescription: string;
  weeklyPrice: number;
  monthlyPrice: number;
  currency: string;
  specs: {
    operatingWeight: string;
    enginePower: string;
    capacity: string;
    keyFeature: string;
  };
  applications: string[];
}

export const RENTAL_VEHICLES: RentalVehicle[] = [
  {
    id: 'cat-excavator',
    type: 'Excavator',
    model: 'Cat 320 Next Gen',
    category: 'Heavy Excavation',
    image: '/images/excavator.png',
    usageDescription: 'Heavy-duty hydraulic excavator designed for deep trenching, foundation digging, mass earthmoving, demolition, and heavy pipeline installation on industrial sites.',
    weeklyPrice: 35000,
    monthlyPrice: 125000,
    currency: '₹',
    specs: {
      operatingWeight: '22,500 kg',
      enginePower: '174 HP (129 kW)',
      capacity: '1.19 m³ Heavy Duty Bucket',
      keyFeature: '360° Hydraulic Rotation & Cat Grade 2D System'
    },
    applications: [
      'Foundation & Trench Excavation',
      'Site Demolition & Debris Clearing',
      'Pipeline & Utility Installation',
      'Quarrying & Mining Operations'
    ]
  },
  {
    id: 'cat-crane',
    type: 'Crane',
    model: 'Cat 50T Mobile Crane',
    category: 'Lifting & Rigging',
    image: '/images/crane.png',
    usageDescription: 'High-capacity mobile hydraulic crane engineered for lifting structural steel beams, pre-cast concrete panels, heavy generators, and HVAC equipment safely at heights.',
    weeklyPrice: 45000,
    monthlyPrice: 160000,
    currency: '₹',
    specs: {
      operatingWeight: '38,000 kg',
      enginePower: '280 HP (206 kW)',
      capacity: '50 Ton Max Lift Capacity',
      keyFeature: '4-Section Telescopic Boom (40m Reach)'
    },
    applications: [
      'Structural Steel Erection',
      'Bridge & Infrastructure Construction',
      'Heavy Machinery Placement',
      'Pre-cast Panel Installation'
    ]
  },
  {
    id: 'cat-bulldozer',
    type: 'Bulldozer',
    model: 'Cat D6 Track Tractor',
    category: 'Earthmoving & Dozing',
    image: '/images/bulldozer.png',
    usageDescription: 'Powerful crawler bulldozer built for site clearing, land levelling, heavy earth pushing, rough grading, and ripping compacted rocky terrain prior to construction.',
    weeklyPrice: 38000,
    monthlyPrice: 135000,
    currency: '₹',
    specs: {
      operatingWeight: '22,900 kg',
      enginePower: '215 HP (160 kW)',
      capacity: '5.1 m³ Semi-U Blade',
      keyFeature: 'Heavy-Duty Undercarriage & Rear Ripper'
    },
    applications: [
      'Site Clearing & Land Levelling',
      'Embankment Construction',
      'Mining Overburden Pushing',
      'Rock & Soil Ripping'
    ]
  },
  {
    id: 'cat-grader',
    type: 'Grader',
    model: 'Cat 140 Motor Grader',
    category: 'Precision Grading',
    image: '/images/grader.png',
    usageDescription: 'Precision motor grader designed for fine finish grading, road sub-base preparation, slope cutting, ditch creation, and uniform spreading of gravel for highway projects.',
    weeklyPrice: 32000,
    monthlyPrice: 115000,
    currency: '₹',
    specs: {
      operatingWeight: '19,100 kg',
      enginePower: '179 HP (133 kW)',
      capacity: '3.7 m Moldboard Width',
      keyFeature: 'Joystick Control & Cross-Slope Auto System'
    },
    applications: [
      'Highway & Road Sub-base Finishing',
      'Precision Slope & Ditch Cutting',
      'Airport Runway Base Levelling',
      'Snow & Gravel Spreading'
    ]
  },
  {
    id: 'cat-loader',
    type: 'Loader',
    model: 'Cat 950 Wheel Loader',
    category: 'Material Handling',
    image: '/images/loader.png',
    usageDescription: 'High-speed wheel loader optimized for loading tipper trucks, stockpiling aggregates, moving sand & crushed rock, quarry loading, and batching plant operations.',
    weeklyPrice: 30000,
    monthlyPrice: 110000,
    currency: '₹',
    specs: {
      operatingWeight: '19,200 kg',
      enginePower: '249 HP (186 kW)',
      capacity: '3.3 m³ General Purpose Bucket',
      keyFeature: 'Z-bar Linkage & Payload Weighing System'
    },
    applications: [
      'Truck & Hopper Loading',
      'Aggregate & Quarry Stockpiling',
      'Concrete Batching Plant Supply',
      'Bulk Material Transfer'
    ]
  },
  {
    id: 'cat-roller',
    type: 'Roller',
    model: 'Cat CS56B Soil Compactor',
    category: 'Compaction',
    image: '/images/roller.png',
    usageDescription: 'Heavy vibratory drum compactor essential for compacting sub-grade soil, crushed rock, clay, and gravel sub-bases for roads, dams, and structural foundations.',
    weeklyPrice: 24000,
    monthlyPrice: 85000,
    currency: '₹',
    specs: {
      operatingWeight: '11,500 kg',
      enginePower: '157 HP (117 kW)',
      capacity: '2,134 mm Vibratory Drum',
      keyFeature: 'Dual Frequency Vibration & Machine Drive'
    },
    applications: [
      'Roadway Sub-base Soil Compaction',
      'Building Foundation Prep',
      'Embankment & Dam Compaction',
      'Asphalt Sub-layer Consolidation'
    ]
  }
];
