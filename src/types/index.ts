export type EntityCategory = 'planet' | 'moon' | 'astronaut' | 'rocket' | 'agency' | 'mission' | 'news';

export interface BaseEntity {
  id: string;
  name: string;
  category: EntityCategory;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Planet extends BaseEntity {
  mass: string;
  radius: string;
  distanceFromSun: string;
  gravity: string;
  orbitalPeriod: string;
  temperature: string;
  moons: string[]; // Moon names or IDs
  atmosphere: { [gas: string]: string };
  funFact: string;
  explorationHistory: string[];
}

export interface Moon extends BaseEntity {
  planet: string; // Planet ID
  mass: string;
  radius: string;
  gravity: string;
  orbitalPeriod: string;
  temperature: string;
  funFact: string;
  explorationHistory: string[];
}

export interface Astronaut extends BaseEntity {
  status: 'Active' | 'Retired' | 'Deceased';
  birthDate: string;
  deathDate?: string;
  flightTime: string;
  spacewalks: number;
  spacewalkTime: string;
  missions: string[]; // Mission IDs or names
  agency: string; // Agency ID
  nationality: string;
  biography: string;
  achievements: string[];
}

export interface Rocket extends BaseEntity {
  manufacturer: string;
  height: string;
  diameter: string;
  mass: string;
  stages: number;
  payloadLeo: string;
  payloadGto: string;
  status: 'Active' | 'Retired' | 'In Development';
  firstLaunch: string;
  launches: number;
  successRate: string;
  costPerLaunch: string;
  propulsion: string;
}

export interface Agency extends BaseEntity {
  abbreviation: string;
  headquarters: string;
  founded: number;
  administrator: string;
  budget: string;
  activeMissions: string[]; // Mission IDs or names
  notableAchievements: string[];
  history: string;
}

export interface MissionMilestone {
  date: string;
  title: string;
  description: string;
}

export interface Mission extends BaseEntity {
  status: 'Success' | 'Failure' | 'Ongoing' | 'Upcoming';
  launchDate: string;
  landingDate?: string;
  launchVehicle: string;
  duration: string;
  objective: string;
  crew: string[]; // Astronaut IDs or names
  agency: string; // Agency ID or name
  milestones: MissionMilestone[];
  scienceResults: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedDate: string;
  source: string;
  category: string;
  image: string;
  readTime: string;
}

export type SpaceEntity = Planet | Moon | Astronaut | Rocket | Agency | Mission;
