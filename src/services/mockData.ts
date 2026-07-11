import type { Planet, Moon, Astronaut, Rocket, Agency, Mission, NewsItem, SpaceEntity, EntityCategory } from '../types';

export const planets: Planet[] = [
  {
    id: 'earth',
    name: 'Earth',
    category: 'planet',
    description: 'Our home planet, Earth, is the third planet from the Sun and the only place we know of so far that’s inhabited by living things. It is the only planet in our solar system with liquid water on the surface.',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    mass: '5.972 × 10²⁴ kg',
    radius: '6,371 km',
    distanceFromSun: '149.6 Million km (1.0 AU)',
    gravity: '9.807 m/s²',
    orbitalPeriod: '365.25 Days',
    temperature: '-89°C to 58°C (Mean: 15°C)',
    moons: ['Moon'],
    atmosphere: {
      Nitrogen: '78.08%',
      Oxygen: '20.95%',
      Argon: '0.93%',
      'Carbon Dioxide': '0.04%',
      WaterCode: 'Vapor (varies)'
    },
    funFact: 'Earth is not a perfect sphere. Its rotation causes it to bulge at the equator and be slightly squashed at the poles.',
    explorationHistory: [
      'Prehistory: Discovered by early humans observing their surroundings.',
      '1957: Sputnik 1 launches, beginning the era of Earth observation from space.',
      '1968: Apollo 8 astronauts capture the famous "Earthrise" photo from lunar orbit.',
      '1972: Apollo 17 crew captures the iconic "Blue Marble" photograph.'
    ],
    escapeVelocity: '11.19 km/s',
    density: '5.51 g/cm³'
  },
  {
    id: 'mars',
    name: 'Mars',
    category: 'planet',
    description: 'Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. There is strong evidence that Mars was – billions of years ago – wetter and warmer, with a thicker atmosphere.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    mass: '6.39 × 10²³ kg',
    radius: '3,389.5 km',
    distanceFromSun: '227.9 Million km (1.52 AU)',
    gravity: '3.711 m/s²',
    orbitalPeriod: '687 Days',
    temperature: '-153°C to 20°C (Mean: -62°C)',
    moons: ['Phobos', 'Deimos'],
    atmosphere: {
      'Carbon Dioxide': '95.32%',
      Nitrogen: '2.7%',
      Argon: '1.6%',
      Oxygen: '0.13%',
      'Carbon Monoxide': '0.08%'
    },
    funFact: 'Mars is home to Olympus Mons, the tallest volcano in the solar system. It is about three times the height of Mount Everest.',
    explorationHistory: [
      '1965: Mariner 4 completes the first successful flyby, sending back close-up photos.',
      '1976: Viking 1 and Viking 2 land on the surface, performing tests for organic biology.',
      '1997: Pathfinder and Sojourner land, introducing the first successful robotic rover.',
      '2012: Curiosity Rover lands in Gale Crater, confirming liquid water once pooled on Mars.',
      '2021: Perseverance Rover and Ingenuity Helicopter land to search for ancient biosignatures.'
    ],
    escapeVelocity: '5.03 km/s',
    density: '3.93 g/cm³'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'planet',
    description: 'Jupiter is more than twice as massive than the other planets of our solar system combined. The giant planet\'s Great Red Spot is a century-old storm larger than Earth.',
    image: 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    mass: '1.898 × 10²⁷ kg',
    radius: '69,911 km',
    distanceFromSun: '778.5 Million km (5.2 AU)',
    gravity: '24.79 m/s²',
    orbitalPeriod: '12 Years',
    temperature: 'Mean: -108°C',
    moons: ['Ganymede', 'Callisto', 'Io', 'Europa'],
    atmosphere: {
      Hydrogen: '89.8%',
      Helium: '10.2%',
      Methane: '0.3%',
      Ammonia: '0.02%',
      'Hydrogen Deuteride': '0.003%'
    },
    funFact: 'Jupiter has the shortest day in the solar system, taking only 10 hours to rotate once.',
    explorationHistory: [
      '1973: Pioneer 10 obtains the first close-up images of Jupiter\'s turbulent atmosphere.',
      '1979: Voyager 1 and Voyager 2 discover Jupiter\'s ring system and active volcanoes on Io.',
      '1995: Galileo spacecraft becomes the first to orbit Jupiter, dropping a probe into its atmosphere.',
      '2016: Juno spacecraft enters polar orbit to examine its internal structure and magnetic field.'
    ],
    escapeVelocity: '59.50 km/s',
    density: '1.33 g/cm³'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    category: 'planet',
    description: 'Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular or as complex as Saturn\'s.',
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    mass: '5.683 × 10²⁶ kg',
    radius: '58,232 km',
    distanceFromSun: '1.434 Billion km (9.58 AU)',
    gravity: '10.44 m/s²',
    orbitalPeriod: '29 Years',
    temperature: 'Mean: -139°C',
    moons: ['Titan', 'Rhea', 'Iapetus', 'Dione', 'Tethys', 'Enceladus'],
    atmosphere: {
      Hydrogen: '96.3%',
      Helium: '3.2%',
      Methane: '0.4%',
      Ammonia: '0.01%',
      'Hydrogen Deuteride': '0.01%'
    },
    funFact: 'Saturn is the least dense planet in our solar system; if you could find a bathtub big enough, Saturn would float in it.',
    explorationHistory: [
      '1979: Pioneer 11 flies within 21,000 km of Saturn\'s cloud tops, detecting its magnetic field.',
      '1980: Voyager 1 takes high-res photographs revealing details of its rings and its moon Titan.',
      '2004: Cassini-Huygens becomes the first spacecraft to orbit Saturn, landing a probe on Titan in 2005.'
    ],
    escapeVelocity: '35.50 km/s',
    density: '0.69 g/cm³'
  }
];

export const moons: Moon[] = [
  {
    id: 'moon',
    name: 'Moon',
    category: 'moon',
    description: 'The Earth\'s Moon is the only place beyond Earth where humans have set foot. It is the fifth largest moon in the Solar System and is tidally locked to Earth, meaning it always shows the same face.',
    image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    planet: 'earth',
    mass: '7.342 × 10²² kg',
    radius: '1,737.4 km',
    gravity: '1.62 m/s² (16.6% of Earth)',
    orbitalPeriod: '27.3 Days',
    temperature: '-130°C to 120°C',
    funFact: 'The Moon is slowly drifting away from Earth at a rate of about 3.8 centimeters (1.5 inches) per year.',
    explorationHistory: [
      '1959: Soviet Luna 2 becomes the first spacecraft to impact the lunar surface.',
      '1969: Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon during Apollo 11.',
      '1972: Gene Cernan becomes the last human to walk on the Moon during Apollo 17.',
      '2019: China\'s Chang\'e 4 completes the first soft landing on the far side of the Moon.'
    ],
    discoveryYear: 'Prehistoric'
  },
  {
    id: 'europa',
    name: 'Europa',
    category: 'moon',
    description: 'Europa is one of Jupiter\'s Galilean moons. Beneath its icy crust lies a global ocean that could contain more than twice the liquid water of all Earth\'s oceans combined, making it a primary target for astrobiology.',
    image: 'https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    planet: 'jupiter',
    mass: '4.8 × 10²² kg',
    radius: '1,560.8 km',
    gravity: '1.315 m/s²',
    orbitalPeriod: '3.55 Days',
    temperature: '-220°C to -160°C',
    funFact: 'Europa is one of the smoothest objects in the solar system, with very few craters, indicating a young and active surface.',
    explorationHistory: [
      '1610: Galileo Galilei discovers Europa using a homemade telescope.',
      '1979: Voyager 1 and Voyager 2 send back detailed images of the intersecting cracks in its ice.',
      '1995-2003: Galileo spacecraft collects magnetic data indicating a subsurface salty ocean.',
      'Planned: NASA\'s Europa Clipper mission launches to perform multiple close flybys.'
    ],
    discoveryYear: '1610'
  },
  {
    id: 'io',
    name: 'Io',
    category: 'moon',
    description: 'Io is the innermost of the four Galilean moons of Jupiter. It is the most geologically active body in the Solar System, with over 400 active volcanoes spewing sulfur and silicate lava.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    planet: 'jupiter',
    mass: '8.93 × 10²² kg',
    radius: '1,821.6 km',
    gravity: '1.796 m/s²',
    orbitalPeriod: '1.77 Days',
    temperature: '-180°C to -130°C',
    funFact: 'Io\'s volcanic activity is powered by tidal heating, caused by the gravitational friction of orbiting close to Jupiter and being pulled by neighboring moons.',
    explorationHistory: [
      '1610: Galileo Galilei discovers Io.',
      '1979: Voyager 1 captures volcanic plumes rising 300 km above the surface.',
      '1996-2001: Galileo spacecraft performs close flybys, mapping hot spots.'
    ],
    discoveryYear: '1610'
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    category: 'moon',
    description: 'Ganymede is the largest moon in the Solar System. It is even larger than the planet Mercury and the dwarf planet Pluto. It is the only moon known to possess its own magnetic field.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    planet: 'jupiter',
    mass: '1.481 × 10²³ kg',
    radius: '2,634.1 km',
    gravity: '1.428 m/s²',
    orbitalPeriod: '7.15 Days',
    temperature: '-203°C to -121°C',
    funFact: 'Ganymede contains a subsurface saltwater ocean that is believed to contain more water than all of Earth\'s oceans combined.',
    explorationHistory: [
      '1610: Galileo Galilei discovers Ganymede.',
      '1979: Pioneer and Voyager probes capture its grooved ice terrain.',
      '1996: Galileo spacecraft confirms its intrinsic magnetic field.'
    ],
    discoveryYear: '1610'
  },
  {
    id: 'callisto',
    name: 'Callisto',
    category: 'moon',
    description: 'Callisto is the second-largest moon of Jupiter. It is the most heavily cratered object in the Solar System, with an ancient, battered surface of ice and rock.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    planet: 'jupiter',
    mass: '1.076 × 10²³ kg',
    radius: '2,410.3 km',
    gravity: '1.236 m/s²',
    orbitalPeriod: '16.69 Days',
    temperature: '-193°C to -108°C',
    funFact: 'Because of its low radiation environment and ancient surface, Callisto is considered the most suitable site for a future human base in the Jovian system.',
    explorationHistory: [
      '1610: Galileo Galilei discovers Callisto.',
      '1979: Voyager flybys map its massive Valhalla crater impact structure.',
      '1997: Galileo spacecraft details its ice-covered surface.'
    ],
    discoveryYear: '1610'
  },
  {
    id: 'titan',
    name: 'Titan',
    category: 'moon',
    description: 'Saturn\'s largest moon, Titan, is the only moon in the solar system with a dense atmosphere and liquid lakes on its surface. However, those lakes are made of liquid methane and ethane rather than water.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    planet: 'saturn',
    mass: '1.345 × 10²³ kg',
    radius: '2,574.7 km',
    gravity: '1.352 m/s²',
    orbitalPeriod: '15.95 Days',
    temperature: '-179.5°C',
    funFact: 'Titan\'s atmosphere is so thick and its gravity is so low that a human could fly through the air by strapping artificial wings to their arms.',
    explorationHistory: [
      '1655: Christiaan Huygens discovers Titan.',
      '1980: Voyager 1 flies by, but its cameras cannot pierce the thick orange atmospheric haze.',
      '2005: ESA\'s Huygens probe successfully lands on Titan\'s surface, transmitting photos of icy round pebbles and drainage channels.'
    ],
    discoveryYear: '1655'
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    category: 'moon',
    description: 'Enceladus is Saturn\'s sixth-largest moon. It is covered by clean, fresh ice, making it one of the most reflective bodies in the solar system. Geysers at its south pole spray water vapor and organic molecules into space.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    planet: 'saturn',
    mass: '1.08 × 10²⁰ kg',
    radius: '252.1 km',
    gravity: '0.113 m/s²',
    orbitalPeriod: '1.37 Days',
    temperature: '-240°C to -128°C',
    funFact: 'The spray from Enceladus\'s geysers creates Saturn\'s outer E ring, wrapping the planet in icy particles.',
    explorationHistory: [
      '1789: William Herschel discovers Enceladus.',
      '2005: Cassini spacecraft starts close flybys, detecting massive plumes of water vapor and sodium.',
      '2015: Cassini flies directly through the plumes, confirming hydrothermal activity on the ocean floor.'
    ],
    discoveryYear: '1789'
  }
];

export const astronauts: Astronaut[] = [
  {
    id: 'neil-armstrong',
    name: 'Neil Armstrong',
    category: 'astronaut',
    description: 'Neil Armstrong was an American astronaut and aeronautical engineer, and the first person to walk on the Moon. He was also a naval aviator, test pilot, and university professor.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    featured: true,
    status: 'Deceased',
    birthDate: 'August 5, 1930',
    deathDate: 'August 25, 2012',
    flightTime: '8 days, 14 hours',
    spacewalks: 1,
    spacewalkTime: '2 hours, 31 minutes',
    missions: ['Gemini 8', 'Apollo 11'],
    agency: 'nasa',
    nationality: 'American',
    biography: 'Born in Wapakoneta, Ohio, Armstrong developed a passion for flying early in life. He served in the Korean War before joining NACA (later NASA) as a test pilot. In 1962, he was selected as an astronaut. On July 20, 1969, as commander of Apollo 11, he spoke the legendary words: "That\'s one small step for [a] man, one giant leap for mankind."',
    achievements: [
      'First human to walk on the Moon (July 21, 1969).',
      'Performed the first successful docking of two spacecraft in orbit (Gemini 8).',
      'Awarded the Presidential Medal of Freedom and Congressional Space Medal of Honor.'
    ],
    awards: ['Congressional Space Medal of Honor', 'Presidential Medal of Freedom', 'NASA Distinguished Service Medal'],
    careerTimeline: [
      { year: '1947', title: 'US Navy Aviator', description: 'Selected for Navy flight training, flew active combat missions in the Korean War.' },
      { year: '1955', title: 'NACA Test Pilot', description: 'Joined the National Advisory Committee for Aeronautics, flying the supersonic X-15 rocket jet.' },
      { year: '1962', title: 'Selected by NASA', description: 'Chosen in the second class of NASA Astronauts ("The Next Nine").' },
      { year: '1966', title: 'Gemini 8 Commander', description: 'Commanded Gemini 8, performing the first successful docking of two spacecraft in orbit.' },
      { year: '1969', title: 'Apollo 11 & First Lunar Steps', description: 'Commanded Apollo 11 and became the first human to walk on the lunar surface.' }
    ]
  },
  {
    id: 'buzz-aldrin',
    name: 'Buzz Aldrin',
    category: 'astronaut',
    description: 'Buzz Aldrin is an American former astronaut, engineer, and fighter pilot. As Lunar Module Pilot on Apollo 11, he and commander Neil Armstrong were the first two humans to land on the Moon.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    featured: true,
    status: 'Retired',
    birthDate: 'January 20, 1930',
    flightTime: '12 days, 1 hour',
    spacewalks: 4,
    spacewalkTime: '7 hours, 52 minutes',
    missions: ['Gemini 12', 'Apollo 11'],
    agency: 'nasa',
    nationality: 'American',
    biography: 'Aldrin was born in Glen Ridge, New Jersey. He graduated third in his class from West Point and flew combat missions during the Korean War. He went on to earn a doctorate in astronautics from MIT, writing a thesis on orbital rendezvous, earning him the nickname "Dr. Rendezvous." He joined NASA in 1963.',
    achievements: [
      'Second human to walk on the Moon.',
      'Developed underwater training techniques to prepare astronauts for EVA.',
      'Completed a historic 5.5-hour spacewalk during Gemini 12, proving humans can work comfortably in open space.'
    ],
    awards: ['Congressional Gold Medal', 'Presidential Medal of Freedom', 'NASA Distinguished Service Medal'],
    careerTimeline: [
      { year: '1951', title: 'US Air Force Fighter Pilot', description: 'Flew 66 combat missions in the Korean War, shooting down two MiG-15s.' },
      { year: '1963', title: 'Doctorate at MIT & NASA', description: 'Earned a Sc.D. in Astronautics from MIT and was selected as a NASA Astronaut.' },
      { year: '1966', title: 'Gemini 12 Flight', description: 'Completed a historic 5.5-hour EVA spacewalk, establishing manual space work standards.' },
      { year: '1969', title: 'Apollo 11 Moonwalk', description: 'Stepped onto the Moon as Lunar Module Pilot, the second person to do so.' }
    ]
  },
  {
    id: 'sally-ride',
    name: 'Sally Ride',
    category: 'astronaut',
    description: 'Sally Ride was an American astronaut and physicist. In 1983, she became the first American woman and the third woman overall to fly in space, following Soviet cosmonauts Valentina Tereshkova and Svetlana Savitskaya.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    featured: false,
    status: 'Deceased',
    birthDate: 'May 26, 1951',
    deathDate: 'July 23, 2012',
    flightTime: '14 days, 7 hours',
    spacewalks: 0,
    spacewalkTime: '0 hours',
    missions: ['STS-7', 'STS-41-G'],
    agency: 'nasa',
    nationality: 'American',
    biography: 'Ride was born in Los Angeles. She attended Stanford University, earning a PhD in physics. In 1978, she was selected in NASA\'s first astronaut class that included women. After her spaceflight career, she became a professor of physics at UC San Diego and founded "Sally Ride Science" to inspire girls in STEM.',
    achievements: [
      'First American woman in space (STS-7, June 18, 1983).',
      'Helped develop the Space Shuttle\'s robotic arm (Canadarm).',
      'Served on the presidential commissions investigating the Challenger and Columbia disasters.'
    ],
    awards: ['NASA Space Flight Medal', 'NASA Distinguished Service Medal', 'National Women\'s Hall of Fame'],
    careerTimeline: [
      { year: '1978', title: 'NASA Selection', description: 'Selected in NASA\'s first astronaut group to recruit women ("The Thirty-Five New Guys").' },
      { year: '1981', title: 'Space Shuttle Robotic Arm', description: 'Helped develop the Canadarm shuttle manipulator system as Capcom.' },
      { year: '1983', title: 'STS-7 Launch', description: 'Flew aboard Space Shuttle Challenger, becoming the first American woman in space.' },
      { year: '1984', title: 'STS-41-G Flight', description: 'Completed her second space flight, logging over 343 cumulative hours in orbit.' }
    ]
  },
  {
    id: 'yuri-gagarin',
    name: 'Yuri Gagarin',
    category: 'astronaut',
    description: 'Yuri Gagarin was a Soviet pilot and cosmonaut who became the first human to journey into outer space, achieving a major milestone in the Space Race.',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80',
    featured: false,
    status: 'Deceased',
    birthDate: 'March 9, 1934',
    deathDate: 'March 27, 1968',
    flightTime: '1 hour, 48 minutes (1 orbit)',
    spacewalks: 0,
    spacewalkTime: '0 hours',
    missions: ['Vostok 1'],
    agency: 'esa', // Stored under generic Russian space agency placeholder or associated
    nationality: 'Soviet / Russian',
    biography: 'Born in the village of Klushino, Gagarin became a military pilot before being chosen as one of the top 20 candidates for the Soviet space program. On April 12, 1961, he launched aboard Vostok 1, orbiting Earth once. He became an international celebrity, touring the world to promote the Soviet achievement.',
    achievements: [
      'First human in space (Vostok 1, April 12, 1961).',
      'Completed a single orbit of the Earth in 108 minutes.',
      'Awarded Hero of the Soviet Union (the nation\'s highest honor).'
    ],
    awards: ['Hero of the Soviet Union', 'Order of Lenin', 'Gold Space Medal (FAI)'],
    careerTimeline: [
      { year: '1955', title: 'Soviet Air Force Cadet', description: 'Entered the military flight academy, qualifying as a MiG-15 fighter pilot.' },
      { year: '1960', title: 'Selected as Cosmonaut', description: 'Chosen in the first group of Soviet cosmonauts ("The Sochi Six").' },
      { year: '1961', title: 'Vostok 1 Flight', description: 'Achieved first orbital human flight around the Earth in 108 minutes.' },
      { year: '1963', title: 'Cosmonaut Training Director', description: 'Appointed Deputy Training Director of the Star City cosmonaut center.' }
    ]
  },
  {
    id: 'peggy-whitson',
    name: 'Peggy Whitson',
    category: 'astronaut',
    description: 'Peggy Whitson is an American biochemistry researcher and retired NASA astronaut. She is one of the most decorated space travelers in history, holding records for cumulative days in space.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true,
    status: 'Retired',
    birthDate: 'February 9, 1960',
    flightTime: '675 days, 3 hours',
    spacewalks: 10,
    spacewalkTime: '60 hours, 21 minutes',
    missions: ['Expedition 5', 'Expedition 16', 'Expedition 50/51/52', 'Axiom Mission 2'],
    agency: 'nasa',
    nationality: 'American',
    biography: 'Whitson grew up on a farm in Iowa, earning her PhD in biochemistry from Rice University. She worked as a research biochemist at NASA before selection as an astronaut in 1996. She became NASA\'s Chief Astronaut from 2009 to 2012, being the first woman to hold the position. In 2023, she commanded Ax-2, a private space mission.',
    achievements: [
      'Holds the record for cumulative time in space by any American astronaut (675 days).',
      'First female commander of the International Space Station (Expedition 16).',
      'Most spacewalks (10) and most spacewalking time (60h 21m) of any woman.'
    ]
  }
];

export const rockets: Rocket[] = [
  {
    id: 'saturn-v',
    name: 'Saturn V',
    category: 'rocket',
    description: 'The Saturn V was an American human-rated super heavy-lift launch vehicle used by NASA\'s Apollo and Skylab programs. It remains the tallest, heaviest, and most powerful rocket ever brought to operational status.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    manufacturer: 'Boeing, North American Aviation, Douglas Aircraft',
    height: '110.6 m',
    diameter: '10.1 m',
    mass: '2,970,000 kg',
    stages: 3,
    payloadLeo: '140,000 kg',
    payloadGto: '48,600 kg (to Lunar Orbit)',
    status: 'Retired',
    firstLaunch: 'November 9, 1967',
    launches: 13,
    successRate: '100%',
    costPerLaunch: '$1.2 Billion (inflation-adjusted)',
    propulsion: 'Stage 1: 5 F-1 engines (RP-1/LOX); Stage 2: 5 J-2 engines (LH2/LOX); Stage 3: 1 J-2 engine.',
    engines: '5 F-1 (Stage 1), 5 J-2 (Stage 2), 1 J-2 (Stage 3)',
    fuel: 'RP-1 / Liquid Oxygen (Stage 1), Liquid Hydrogen / Liquid Oxygen (Stages 2 & 3)',
    timeline: [
      { date: '1961', title: 'Program Initiation', description: 'NASA announces the Saturn V program to support the Apollo crewed lunar landing goal.' },
      { date: 'Nov 9, 1967', title: 'Maiden Flight (Apollo 4)', description: 'First uncrewed test flight of the Saturn V launches successfully.' },
      { date: 'Dec 1968', title: 'Apollo 8 Lunar Orbit', description: 'Saturn V launches the first crewed spacecraft to escape Earth orbit and circle the Moon.' },
      { date: 'Jul 16, 1969', title: 'Apollo 11 Launch', description: 'Launches Neil Armstrong, Buzz Aldrin, and Michael Collins to the first lunar landing.' },
      { date: 'May 14, 1973', title: 'Final Launch (Skylab)', description: 'Launches the Skylab space station into low Earth orbit, concluding the launcher series.' }
    ]
  },
  {
    id: 'falcon-9',
    name: 'Falcon 9',
    category: 'rocket',
    description: 'Falcon 9 is a reusable, two-stage rocket designed and manufactured by SpaceX for the reliable and safe transport of people and payloads into Earth orbit and beyond. It is the first orbital-class reusable rocket.',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    manufacturer: 'SpaceX',
    height: '70 m',
    diameter: '3.7 m',
    mass: '549,054 kg',
    stages: 2,
    payloadLeo: '22,800 kg (expendable)',
    payloadGto: '8,300 kg (expendable)',
    status: 'Active',
    firstLaunch: 'June 4, 2010',
    launches: 330, // Approx
    successRate: '99.4%',
    costPerLaunch: '$67 Million',
    propulsion: 'Stage 1: 9 Merlin 1D engines (RP-1/LOX); Stage 2: 1 Merlin Vacuum engine.',
    engines: '9 Merlin 1D (Stage 1), 1 Merlin 1D Vacuum (Stage 2)',
    fuel: 'RP-1 / Liquid Oxygen (Rocket Propellant 1 and LOX)',
    timeline: [
      { date: 'Jun 4, 2010', title: 'Maiden Flight (v1.0)', description: 'First Falcon 9 test flight launches successfully from Cape Canaveral.' },
      { date: 'Dec 21, 2015', title: 'First Orbital Landing', description: 'Falcon 9 Full Thrust lands its first-stage booster back at LZ-1, a historic milestone.' },
      { date: 'Mar 30, 2017', title: 'First Reflight Booster', description: 'SpaceX successfully relaunches and lands a previously flown first-stage booster.' },
      { date: 'May 30, 2020', title: 'Demo-2 Crewed Launch', description: 'Launches astronauts Bob Behnken and Doug Hurley to the ISS, restoring US orbital flights.' }
    ]
  },
  {
    id: 'falcon-heavy',
    name: 'Falcon Heavy',
    category: 'rocket',
    description: 'Falcon Heavy is the most powerful operational rocket in the world by a factor of two. With the ability to lift into orbit nearly 64 metric tons, it can lift more than twice the payload of the next closest operational vehicle.',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    manufacturer: 'SpaceX',
    height: '70 m',
    diameter: '12.2 m (width)',
    mass: '1,420,788 kg',
    stages: 2,
    payloadLeo: '63,800 kg',
    payloadGto: '26,700 kg',
    status: 'Active',
    firstLaunch: 'February 6, 2018',
    launches: 9,
    successRate: '100%',
    costPerLaunch: '$97 Million to $150 Million',
    propulsion: '27 Merlin 1D engines across three core stages generating 5 million pounds of thrust at launch.',
    engines: '27 Merlin 1D (across 3 strapped-on core boosters), 1 Merlin 1D Vacuum (Stage 2)',
    fuel: 'RP-1 / Liquid Oxygen (LOX)',
    timeline: [
      { date: 'Feb 6, 2018', title: 'Maiden Flight', description: 'Launches Elon Musk\'s Tesla Roadster into a heliocentric orbit with double booster landing.' },
      { date: 'Apr 11, 2019', title: 'First Commercial Flight', description: 'Launches Arabsat-6A and successfully lands all three booster cores.' },
      { date: 'Nov 1, 2022', title: 'USSF-44 Military Mission', description: 'First classified national security flight for the US Space Force.' }
    ]
  },
  {
    id: 'starship',
    name: 'Starship',
    category: 'rocket',
    description: 'SpaceX\'s Starship spacecraft and Super Heavy rocket – collectively referred to as Starship – represent a fully reusable transportation system designed to carry both crew and cargo to Earth orbit, the Moon, Mars, and beyond.',
    image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    manufacturer: 'SpaceX',
    height: '121 m',
    diameter: '9 m',
    mass: '5,000,000 kg (fully fueled)',
    stages: 2,
    payloadLeo: '150,000 kg (fully reusable), 250,000 kg (expendable)',
    payloadGto: '100,000+ kg (with orbital refueling)',
    status: 'In Development',
    firstLaunch: 'April 20, 2023 (Integrated flight test)',
    launches: 4, // Integration tests
    successRate: 'Ongoing testing',
    costPerLaunch: '$10 Million (target projection)',
    propulsion: 'Super Heavy: 33 Raptor engines (Liquid Methane/LOX); Starship: 6 Raptor engines (3 sea-level, 3 vacuum).',
    engines: '33 Raptor 2 (Super Heavy Booster), 6 Raptor 2 (Starship Second Stage)',
    fuel: 'Subcooled Liquid Methane (CH4) / Liquid Oxygen (LOX)',
    timeline: [
      { date: 'Aug 2020', title: 'Starhopper & Early Hops', description: 'Early single-engine Raptor prototypes complete 150m vertical flight hops in Boca Chica.' },
      { date: 'May 5, 2021', title: 'SN15 Flight & Soft Landing', description: 'Starship prototype SN15 launches to 10km altitude and lands successfully.' },
      { date: 'Apr 20, 2023', title: 'Integrated Flight Test 1', description: 'First orbital test flight of Starship on top of Super Heavy booster.' },
      { date: 'Jun 6, 2024', title: 'Integrated Flight Test 4', description: 'First successful soft landing of both booster in Gulf of Mexico and ship in Indian Ocean.' }
    ]
  },
  {
    id: 'sls',
    name: 'Space Launch System (SLS)',
    category: 'rocket',
    description: 'The Space Launch System (SLS) is an American super heavy-lift expendable launch vehicle, which has been under development by NASA since 2011. It forms the primary launch vehicle of the Artemis Moon program.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    manufacturer: 'Boeing, Aerojet Rocketdyne, Northrop Grumman',
    height: '98.1 m (Block 1)',
    diameter: '8.4 m',
    mass: '2,600,000 kg',
    stages: 2,
    payloadLeo: '95,000 kg',
    payloadGto: '27,000+ kg (to Trans-Lunar Injection)',
    status: 'Active',
    firstLaunch: 'November 16, 2022',
    launches: 1,
    successRate: '100%',
    costPerLaunch: '$2 Billion',
    propulsion: 'Core Stage: 4 RS-25 engines (LH2/LOX); Boosters: 2 5-segment Solid Rocket Boosters; Upper Stage: RL10 engine.'
  }
];

export const agencies: Agency[] = [
  {
    id: 'nasa',
    name: 'National Aeronautics and Space Administration',
    category: 'agency',
    description: 'NASA is an independent agency of the US federal government responsible for the civil space program, aeronautics research, and space research. Established in 1958, succeeding NACA.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    abbreviation: 'NASA',
    headquarters: 'Washington, D.C., USA',
    founded: 1958,
    administrator: 'Bill Nelson',
    budget: '$25.4 Billion (2023)',
    activeMissions: ['Artemis Program', 'Perseverance Rover', 'James Webb Space Telescope', 'Hubble Space Telescope', 'Juno'],
    notableAchievements: [
      'Apollo Moon Landings (first humans on Moon in 1969).',
      'Space Shuttle Program (first reusable spacecraft fleet).',
      'Launched Voyager 1 & 2 (first spacecraft to enter interstellar space).',
      'Landed five robotic rovers successfully on the surface of Mars.'
    ],
    history: 'NASA was created in response to the Soviet Union\'s launch of Sputnik 1 in 1957. President Dwight D. Eisenhower signed the National Aeronautics and Space Act, establishing a civilian agency to focus on peaceful applications in space science. Over six decades, NASA has driven human spaceflight, satellite engineering, and cosmic exploration.'
  },
  {
    id: 'esa',
    name: 'European Space Agency',
    category: 'agency',
    description: 'ESA is an intergovernmental organization of 22 member states dedicated to the exploration of space. Established in 1975, headquartered in Paris, France.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    abbreviation: 'ESA',
    headquarters: 'Paris, France',
    founded: 1975,
    administrator: 'Josef Aschbacher',
    budget: '€7.08 Billion (2023)',
    activeMissions: ['Juice (Jupiter Icy Moons Explorer)', 'Euclid', 'BepiColombo (with JAXA)', 'Gaia', 'Solar Orbiter'],
    notableAchievements: [
      'Rosetta Mission: First soft landing on a comet (67P) with the Philae lander in 2014.',
      'Huygens Probe: First successful landing on Titan (outer solar system moon) in 2005.',
      'Developed Ariane rocket series, securing independent European satellite launch access.',
      'Integral space telescope detecting gamma-ray bursts.'
    ],
    history: 'After World War II, European scientists recognized the need to join forces to compete with the US and USSR. In 1975, the European Space Research Organisation merged with the European Launcher Development Organisation to form ESA, prioritizing scientific satellites, orbital observation, and telecommunications.'
  },
  {
    id: 'spacex',
    name: 'Space Exploration Technologies Corp.',
    category: 'agency',
    description: 'SpaceX is an American aerospace manufacturer and space transportation services company founded by Elon Musk in 2002. It is famous for initiating orbital reusable launch vehicles.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    abbreviation: 'SpaceX',
    headquarters: 'Hawthorne, California, USA',
    founded: 2002,
    administrator: 'Elon Musk (CEO), Gwynne Shotwell (President)',
    budget: 'Private (Estimated revenues $8-9B in 2023)',
    activeMissions: ['Starlink Constellation', 'Crew Dragon ISS Flights', 'Starship Development', 'Artemis Human Landing System (HLS)'],
    notableAchievements: [
      'First privately funded liquid-propellant rocket to reach orbit (Falcon 1 in 2008).',
      'First private company to successfully launch, orbit, and recover a spacecraft (Dragon in 2010).',
      'First landing and reuse of an orbital-class booster stage (Falcon 9 in 2015).',
      'First private entity to send astronauts to the ISS (Demo-2 in 2020).'
    ],
    history: 'Elon Musk founded SpaceX with the long-term goal of reducing space transportation costs to enable the colonization of Mars. Through rapid prototyping and a vertical-integration model, SpaceX disrupted the global launch market, developing Falcon 9, Falcon Heavy, and the Starlink satellite network.'
  },
  {
    id: 'isro',
    name: 'Indian Space Research Organisation',
    category: 'agency',
    description: 'ISRO is the national space agency of India. Operating under the Department of Space, it is one of the world\'s most cost-efficient and active civil space agencies.',
    image: 'https://images.unsplash.com/photo-1608178398319-48f814d0750c?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    abbreviation: 'ISRO',
    headquarters: 'Bengaluru, India',
    founded: 1969,
    administrator: 'S. Somanath',
    budget: '$1.5 Billion (2023)',
    activeMissions: ['Chandrayaan-3', 'Aditya-L1', 'Gaganyaan (Crewed testing)', 'Mangalyaan-2 (Planning)'],
    notableAchievements: [
      'Chandrayaan-3: First agency to land a spacecraft near the lunar south pole (2023).',
      'Mars Orbiter Mission (Mangalyaan): Reached Mars orbit on first attempt in 2014, with a record low budget.',
      'Launched 104 satellites on a single rocket (PSLV-C37) in 2017.',
      'Developed domestic launch capabilities: PSLV, GSLV, and LVM3.'
    ],
    history: 'India\'s space research was initiated in 1962 under the leadership of Dr. Vikram Sarabhai. ISRO was formally established in 1969, replacing the previous national committee. Starting with the Aryabhata satellite in 1975, ISRO focused on telecommunications, weather forecasting, and agricultural mapping before launching deep-space scientific missions.'
  }
];

export const missions: Mission[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    category: 'mission',
    description: 'Apollo 11 was the American spaceflight that first landed humans on the Moon. Commander Neil Armstrong and Lunar Module Pilot Buzz Aldrin landed the Apollo Lunar Module Eagle on July 20, 1969.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Success',
    launchDate: 'July 16, 1969',
    landingDate: 'July 24, 1969',
    launchVehicle: 'Saturn V',
    duration: '8 days, 3 hours, 18 minutes',
    objective: 'Perform a crewed lunar landing and return safely to Earth, fulfilling President John F. Kennedy\'s goal set in 1961.',
    crew: ['Neil Armstrong (Commander)', 'Buzz Aldrin (Lunar Module Pilot)', 'Michael Collins (Command Module Pilot)'],
    agency: 'nasa',
    milestones: [
      { date: 'July 16, 1969', title: 'Launch', description: 'Liftoff from Launch Pad 39A at Kennedy Space Center.' },
      { date: 'July 19, 1969', title: 'Lunar Orbit Insertion', description: 'Spacecraft enters orbit around the Moon after firing main engine.' },
      { date: 'July 20, 1969', title: 'Moon Landing', description: 'The Eagle lands at the Sea of Tranquility with 25 seconds of fuel remaining.' },
      { date: 'July 21, 1969', title: 'First Moonwalk', description: 'Neil Armstrong steps onto the lunar soil, followed by Buzz Aldrin.' },
      { date: 'July 24, 1969', title: 'Splashdown', description: 'Command Module splashes down safely in the Pacific Ocean.' }
    ],
    scienceResults: [
      'Collected 21.5 kg of lunar material, including basalt rocks and breccia.',
      'Deployed the Early Apollo Scientific Experiments Package (EASEP).',
      'Installed a laser ranging retroreflector (still in use today to measure Earth-Moon distance).'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Apollo_11_Restore.svg',
    videoUrl: 'https://www.youtube.com/embed/RMIN3xD4550',
    objectives: [
      'Perform crewed landing on the Moon surface.',
      'Gather lunar geological samples.',
      'Establish visual contact/retransmission to Earth.',
      'Deploy scientific equipment (EASEP).'
    ],
    stats: {
      'Lunar Surface Stay': '21 hours, 36 minutes',
      'Total Samples': '21.5 kg',
      'Max Speed': '39,897 km/h',
      'Orbits Completed': '30 orbits'
    }
  },
  {
    id: 'apollo-13',
    name: 'Apollo 13',
    category: 'mission',
    description: 'Apollo 13 was the seventh crewed mission in the Apollo space program, and the third intended to land on the Moon. The landing was aborted after an oxygen tank exploded in the Service Module.',
    image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Failure',
    launchDate: 'April 11, 1970',
    landingDate: 'April 17, 1970',
    launchVehicle: 'Saturn V',
    duration: '5 days, 22 hours, 54 minutes',
    objective: 'Perform a crewed landing in the Fra Mauro highlands, conduct geology surveys, and deploy lunar surface experiments.',
    crew: ['Jim Lovell (Commander)', 'Fred Haise (Lunar Module Pilot)', 'Jack Swigert (Command Module Pilot)'],
    agency: 'nasa',
    milestones: [
      { date: 'April 11, 1970', title: 'Launch', description: 'Liftoff from Kennedy Space Center Pad 39A.' },
      { date: 'April 13, 1970', title: 'Oxygen Tank Explosion', description: 'An explosion in Service Module oxygen tank 2 forces the mission abort.' },
      { date: 'April 14, 1970', title: 'Lunar Flyby', description: 'Using the Lunar Module lifeboat, the crew loops around the Moon for a free-return trajectory.' },
      { date: 'April 17, 1970', title: 'Safe Splashdown', description: 'The crew returns safely to Earth, splashing down in the South Pacific Ocean.' }
    ],
    scienceResults: [
      'Provided critical operational insights on emergency spacecraft resource pooling.',
      'Tested ground-control contingency algorithms under life-threatening conditions.'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Apollo_13_Restore.svg',
    videoUrl: 'https://www.youtube.com/embed/nEl0NsYnJH4',
    objectives: [
      'Perform crewed landing in the Fra Mauro Highlands.',
      'Deploy the ALSEP experiment packages.',
      'Safely abort and return the crew after oxygen systems rupture.',
      'Maintain thermal limits in frozen lunar module.'
    ],
    stats: {
      'Distance from Earth': '400,171 km',
      'Flight Duration': '142.9 Hours',
      'Cabin Temp (Emergency)': '3°C',
      'Lunar Orbit Speed': 'Free Return Loop'
    }
  },
  {
    id: 'iss',
    name: 'International Space Station',
    category: 'mission',
    description: 'The International Space Station (ISS) is a microgravity and space environment research laboratory in low Earth orbit. It is a collaborative project between NASA, Roscosmos, ESA, JAXA, and CSA.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Ongoing',
    launchDate: 'November 20, 1998 (First module)',
    launchVehicle: 'Proton-K (Zarya), Space Shuttle Endeavour (Unity)',
    duration: '27+ Years (Continuous habitation since Nov 2000)',
    objective: 'Provide a long-term research platform in microgravity, conducting studies in astrobiology, physics, materials, and human physiology.',
    crew: ['Rotational crews of 7 astronauts (typically from partner countries)'],
    agency: 'nasa',
    milestones: [
      { date: 'Nov 20, 1998', title: 'First Module Launched', description: 'The Russian Zarya module is launched, starting orbital assembly.' },
      { date: 'Nov 2, 2000', title: 'Expedition 1 Arrives', description: 'Bill Shepherd, Yuri Gidzenko, and Sergei Krikalev become the first permanent crew.' },
      { date: 'Jul 7, 2011', title: 'Assembly Complete', description: 'Space Shuttle Atlantis delivers the final major US module.' },
      { date: 'May 31, 2020', title: 'SpaceX Demo-2 Docking', description: 'Commercial Crew program begins transporting astronauts to ISS.' }
    ],
    scienceResults: [
      'Conducted over 3,000 scientific investigations from 100+ countries.',
      'Studied muscle and bone loss in space, contributing to osteoporosis treatments on Earth.',
      'Tested critical life-support loop technologies for long-duration Mars transits.'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/International_Space_Station_patch.svg',
    videoUrl: 'https://www.youtube.com/embed/SGP6Y0Pnpe4',
    objectives: [
      'Maintain continuous human presence in low Earth orbit.',
      'Perform microgravity scientific experiments.',
      'Develop space technologies for future solar exploration.',
      'Provide international cooperation in spaceflight.'
    ],
    stats: {
      'Speed': '27,600 km/h',
      'Altitude': '408 km',
      'Orbital Period': '92 minutes',
      'Total Habitable Volume': '388 cubic meters'
    }
  },
  {
    id: 'james-webb',
    name: 'James Webb Space Telescope (JWST)',
    category: 'mission',
    description: 'The James Webb Space Telescope is a space observatory designed primarily to conduct infrared astronomy. As the largest optical space telescope, it resolves targets in high-definition infrared.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Ongoing',
    launchDate: 'December 25, 2021',
    launchVehicle: 'Ariane 5',
    duration: '4+ Years (Designed for 10-20 years)',
    objective: 'Observe the universe\'s first galaxies, analyze exoplanet atmospheres for habitability, and examine star formation in dense dust clouds.',
    crew: ['Uncrewed (Orbiting Earth-Sun Lagrange Point L2)'],
    agency: 'nasa',
    milestones: [
      { date: 'Dec 25, 2021', title: 'Launch', description: 'Launched from Guiana Space Centre aboard Ariane flight VA256.' },
      { date: 'Jan 2022', title: 'Deployment', description: 'Successfully unfurls its 5-layer sunshield and 6.5m hexagonal gold mirror.' },
      { date: 'Jan 24, 2022', title: 'L2 Arrival', description: 'Enters halo orbit around the second Lagrange point, 1.5 million km from Earth.' },
      { date: 'Jul 12, 2022', title: 'First Deep Field Released', description: 'NASA releases the sharpest infrared image of the distant universe to date.' }
    ],
    scienceResults: [
      'Detected carbon dioxide, water vapor, and methane in exoplanet atmospheres (e.g. WASP-96b).',
      'Photographed galaxies forming just 320 million years after the Big Bang (JADES-GS-z14-0).',
      'Captured details of stellar nurseries inside the Carina Nebula.'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/JWST_Patch.svg',
    videoUrl: 'https://www.youtube.com/embed/1C_xu17nPh0',
    objectives: [
      'Search for the first galaxies formed after the Big Bang.',
      'Determine how galaxies evolved from their formation to now.',
      'Observe the stages of the physical origin of planetary systems.',
      'Measure chemical properties of distant planetary atmospheres.'
    ],
    stats: {
      'Primary Mirror Size': '6.5 meters',
      'Distance from Earth': '1.5 Million km',
      'Sunshield Dimensions': '21.2m x 14.2m',
      'Operational Temp': '-233°C (37 Kelvin)'
    }
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    category: 'mission',
    description: 'Voyager 1 is a space probe launched by NASA in 1977. Part of the Voyager program to study the outer Solar System, it became the first spacecraft to cross the heliopause and enter interstellar space.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Ongoing',
    launchDate: 'September 5, 1977',
    launchVehicle: 'Titan IIIE-Centaur',
    duration: '48+ Years (Active communication)',
    objective: 'Perform flybys of Jupiter and Saturn, studying their atmospheric compositions, ring systems, and magnetic structures.',
    crew: ['Uncrewed'],
    agency: 'nasa',
    milestones: [
      { date: 'Mar 5, 1979', title: 'Jupiter Flyby', description: 'Discovers active volcanoes on Io and rings around Jupiter.' },
      { date: 'Nov 12, 1980', title: 'Saturn Flyby', description: 'Passes close to Titan, concluding planetary science phases.' },
      { date: 'Feb 14, 1990', title: 'Pale Blue Dot', description: 'Turns cameras back to capture the solar system family portrait.' },
      { date: 'Aug 25, 2012', title: 'Interstellar Boundary', description: 'Enters interstellar space, detecting a drop in solar plasma.' }
    ],
    scienceResults: [
      'Discovered Jupiter\'s ring system and multiple outer-planet moons.',
      'Identified cosmic-ray fluctuations in interstellar space.',
      'Confirmed the size of Saturn\'s ring subdivisions.'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Voyager_1_patch.png',
    videoUrl: 'https://www.youtube.com/embed/n42n6lT6QxI',
    objectives: [
      'Analyze outer planetary environments.',
      'Investigate magnetic fields and plasma waves.',
      'Enter interstellar space and exit solar boundary.',
      'Carry the Golden Record messages to extraterrestrials.'
    ],
    stats: {
      'Distance from Sun': '24.4 Billion km',
      'Speed Relative to Sun': '61,146 km/h',
      'Telemetry Send Time': '22.5 Hours',
      'Active Instruments': '4 scientific packages'
    }
  },
  {
    id: 'perseverance',
    name: 'Perseverance Rover',
    category: 'mission',
    description: 'Perseverance is a car-sized robotic rover designed to explore the Jezero crater on Mars. It seeks signs of ancient microbial habitability, caching physical soil cores for return voyages.',
    image: 'https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Ongoing',
    launchDate: 'July 30, 2020',
    landingDate: 'February 18, 2021',
    launchVehicle: 'Atlas V 541',
    duration: '5+ Years (Active)',
    objective: 'Seek signs of ancient microbial life and collect samples of rock and regolith for possible return to Earth.',
    crew: ['Uncrewed (Robotic Rover + Ingenuity Helicopter)'],
    agency: 'nasa',
    milestones: [
      { date: 'Jul 30, 2020', title: 'Launch', description: 'Launched from Cape Canaveral Space Force Station.' },
      { date: 'Feb 18, 2021', title: 'Martian Landing', description: 'Touchdown in Jezero Crater using the sky crane landing system.' },
      { date: 'Apr 19, 2021', title: 'Ingenuity Flight', description: 'The Ingenuity helicopter makes the first powered flight on another planet.' },
      { date: 'Sep 2021', title: 'First Core Sample', description: 'Successfully cores and stores a rock sample from Jezero Crater.' }
    ],
    scienceResults: [
      'Discovered signs of ancient organic compounds in Jezero Crater lake bed.',
      'Proved powered aviation is possible in thin atmospheres using Ingenuity (72 flights total).',
      'Tested MOXIE instrument, producing oxygen directly from Martian CO2.'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Mars_2020_patch.svg',
    videoUrl: 'https://www.youtube.com/embed/4czjS9h4Fpg',
    objectives: [
      'Detect signs of past microbial habitability.',
      'Collect and cache core rock/soil samples.',
      'Extract breathable oxygen from carbon dioxide.',
      'Operate first robotic atmospheric drone.'
    ],
    stats: {
      'Samples Collected': '24 tubes',
      'Ingenuity Flights': '72 flights',
      'Distance Traversed': '28.1 km',
      'Primary Systems': '7 science instruments'
    }
  },
  {
    id: 'artemis',
    name: 'Artemis Program',
    category: 'mission',
    description: 'The Artemis program is a NASA-led spaceflight program to land the first woman and next man on the Moon. It aims to establish a permanent sustainable lunar research base.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Upcoming',
    launchDate: 'November 16, 2022 (Artemis I)',
    landingDate: 'Late 2026 (Artemis III Target)',
    launchVehicle: 'Space Launch System (SLS)',
    duration: 'Active Program',
    objective: 'Land humans on the Moon, explore the lunar south pole, and establish a permanent presence before Mars voyages.',
    crew: ['Reid Wiseman (Artemis II)', 'Victor Glover (Artemis II)', 'Christina Koch (Artemis II)', 'Jeremy Hansen (Artemis II)'],
    agency: 'nasa',
    milestones: [
      { date: 'Nov 16, 2022', title: 'Artemis I Launch', description: 'Uncrewed test flight of SLS and Orion capsule orbits the Moon.' },
      { date: 'Dec 11, 2022', title: 'Artemis I Splashdown', description: 'Orion splashdown in Pacific Ocean after 25 days in space.' },
      { date: 'Late 2026', title: 'Artemis II (Crewed)', description: 'Crewed test flight in lunar orbit trajectory.' },
      { date: '2028', title: 'Artemis III (Lunar Landing)', description: 'Target landing mission at the lunar South Pole.' }
    ],
    scienceResults: [
      'Qualified the SLS heavy launcher and the Orion heat shield in lunar reentry speeds.',
      'Mapped radiation doses in deep space using dummy mannequins.'
    ],
    patchUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Artemis_program_patch.svg',
    videoUrl: 'https://www.youtube.com/embed/dOl63sP8cjg',
    objectives: [
      'Land the first woman and person of color on the Moon.',
      'Explore resources at the lunar South Pole.',
      'Deploy the Gateway lunar space station.',
      'Test deep-space spacesuits and modules.'
    ],
    stats: {
      'SLS Thrust': '8.8 Million lbs',
      'Orion Speed': '39,400 km/h',
      'Member Nations': 'NASA, ESA, JAXA, CSA',
      'Target Zone': 'Shackleton Crater'
    }
  }
];

export const news: NewsItem[] = [
  {
    id: 'artemis-ii-update',
    title: 'Artemis II Astronaut Crew Prepares for Lunar Flyby Rehearsals',
    summary: 'NASA astronauts completed a series of launch pad exit simulations at Kennedy Space Center, preparing for the historic crewed lunar orbit flight in late 2026.',
    content: 'NASA’s Artemis II crew, comprising Reid Wiseman, Victor Glover, Christina Koch, and Jeremy Hansen, completed complex egress training simulations. The crew practiced escaping the Orion spacecraft and boarding recovery craft in ocean simulations. Artemis II will be the first crewed spacecraft to fly around the Moon since Apollo 17 in 1972, carrying astronauts in a high-elliptical free-return trajectory. The mission aims to qualify life-support hardware and navigation architectures before attempting a lunar landing on Artemis III.',
    publishedDate: 'July 10, 2026',
    source: 'NASA Spaceflight',
    category: 'Missions',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read'
  },
  {
    id: 'europa-clipper-water',
    title: 'Europa Clipper Spacecraft Detects High-Probability Saltwater Plumes',
    summary: 'Preliminary scans from the approaching probe suggest active geothermal vents at the bottom of Europa’s subsurface oceans, prompting excitement among astrobiologists.',
    content: 'Approaching the Jovian system, NASA’s Europa Clipper telescope arrays conducted initial spectroscopic scans of Europa’s atmospheric boundaries. The data displays highly localized plumes containing ionized sodium and carbon dioxide molecules, indicating deep hydrothermal activity similar to Earth\'s mid-ocean vents. Scientists theorize this salinity could sustain thermophilic bacterial life. Ground crews are modifying upcoming orbital paths to pass through the plume corridors for direct sample captures.',
    publishedDate: 'July 8, 2026',
    source: 'Nature Astronomy',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read'
  },
  {
    id: 'starship-mars-refueling',
    title: 'SpaceX Achieves First Cryogenic Propellant Transfer In Orbit',
    summary: 'A critical milestone for Mars missions was achieved as two Starship vehicles successfully transferred thousands of liters of liquid oxygen in low Earth orbit.',
    content: 'SpaceX completed its most complex orbital flight test to date, successfully docking two Starship spacecraft in low Earth orbit. Over the course of a three-hour window, ground engineers commanded automated systems to transfer cryogenic liquid oxygen between the tanks of a target tanker and a receiver vessel. Orbital propellant transfer is the cornerstone of SpaceX\'s architecture, allowing heavy vehicles to refuel before departing on lunar or Martian trajectories.',
    publishedDate: 'July 5, 2026',
    source: 'SpaceX Press',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read'
  },
  {
    id: 'jwst-first-stars',
    title: 'James Webb Captures Light from the Universe\'s First Stellar Nurseries',
    summary: 'Deep-field images from the observatory reveal highly dense hydrogen columns hosting active star formation just 200 million years after the Big Bang.',
    content: 'The James Webb Space Telescope’s Near-Infrared Camera (NIRCam) peered through dense dust lanes in galaxy JADES-GS-z14-0 to photograph massive cosmic columns of primordial hydrogen. The data shows pockets of heavy elements (like oxygen and iron) forming within stellar cores much earlier than cosmological models previously projected. Astronomers suggest these early stars were extremely massive, burning hot and fast, and triggering supermassive black hole seedlings.',
    publishedDate: 'June 28, 2026',
    source: 'ESA Science Portal',
    category: 'Astrophysics',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read'
  }
];

export const allEntities: SpaceEntity[] = [
  ...planets,
  ...moons,
  ...astronauts,
  ...rockets,
  ...agencies,
  ...missions
];

// Query Methods
export const getFeaturedEntities = (): SpaceEntity[] => {
  return allEntities.filter(entity => entity.featured);
};

export const searchEntities = (query: string): SpaceEntity[] => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];
  return allEntities.filter(
    entity =>
      entity.name.toLowerCase().includes(cleanQuery) ||
      entity.description.toLowerCase().includes(cleanQuery) ||
      entity.category.toLowerCase().includes(cleanQuery)
  );
};

export const getEntityById = (category: EntityCategory, id: string): SpaceEntity | undefined => {
  return allEntities.find(
    entity => entity.category === category && entity.id === id
  );
};

export const getEntitiesByCategory = (category: EntityCategory): SpaceEntity[] => {
  return allEntities.filter(entity => entity.category === category);
};

export const getNews = (): NewsItem[] => {
  return news;
};

export const getNewsById = (id: string): NewsItem | undefined => {
  return news.find(item => item.id === id);
};
