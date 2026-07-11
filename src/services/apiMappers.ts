import type { Planet, Moon, Astronaut, Rocket, Agency, Mission, NewsItem } from '../types';
import { planets as mockPlanets, moons as mockMoons, astronauts as mockAstronauts, rockets as mockRockets, agencies as mockAgencies, missions as mockMissions } from './mockData';

// Utility: Format ISO dates into "Month DD, YYYY"
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

// Utility: Estimate news read time
export const calculateReadTime = (text: string): string => {
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// Utility: Formats ISO Duration like "P8DT14H" or similar to hours/days
export const formatDuration = (durationStr: string | null | undefined): string => {
  if (!durationStr) return 'N/A';
  // Standard LLD2 astronaut time format is cumulative duration (e.g. days/hours)
  // Often returned in ISO 8601 duration format, e.g. "P12DT1H30M"
  try {
    const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = durationStr.match(regex);
    if (!matches) return durationStr;
    const days = matches[1] ? parseInt(matches[1]) : 0;
    const hours = matches[2] ? parseInt(matches[2]) : 0;
    if (days > 0) {
      return `${days} days, ${hours} hours`;
    }
    return `${hours} hours`;
  } catch {
    return durationStr;
  }
};

// Planet Mapper
export const mapApiPlanet = (apiBody: any): Planet => {
  const id = apiBody.id.toLowerCase();
  const englishName = apiBody.englishName || apiBody.name;
  
  // Find editorial mock details for fun fact / history overlay
  const mockMatch = mockPlanets.find(p => p.id === id || p.name.toLowerCase() === englishName.toLowerCase());

  // Calculate mass description
  let massStr = 'N/A';
  if (apiBody.mass) {
    const val = apiBody.mass.massValue;
    const exp = apiBody.mass.massExponent;
    massStr = `${val} × 10²⁴ kg`; // Default exponent scale representation
    if (exp !== 24) {
      massStr = `${val} × 10²${exp} kg`;
    }
  }

  // Calculate temperature description
  const tempK = apiBody.avgTemp || 288;
  const tempC = Math.round(tempK - 273.15);

  // Map moons
  const moonList = apiBody.moons ? apiBody.moons.map((m: any) => m.moon) : [];

  return {
    id: id,
    name: englishName,
    category: 'planet',
    description: mockMatch?.description || `${englishName} is a planetary body in our solar system.`,
    image: mockMatch?.image || `https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80`,
    featured: mockMatch?.featured || false,
    mass: massStr,
    radius: apiBody.meanRadius ? `${Math.round(apiBody.meanRadius).toLocaleString()} km` : 'N/A',
    distanceFromSun: apiBody.semimajoraxis 
      ? `${(apiBody.semimajoraxis / 1000000).toFixed(1)} Million km (${(apiBody.semimajoraxis / 149597870.7).toFixed(2)} AU)`
      : mockMatch?.distanceFromSun || 'N/A',
    gravity: apiBody.gravity ? `${apiBody.gravity} m/s²` : 'N/A',
    orbitalPeriod: apiBody.sideralOrbit ? `${Math.round(apiBody.sideralOrbit)} Days` : 'N/A',
    temperature: mockMatch?.temperature || `${tempC}°C`,
    moons: moonList,
    atmosphere: mockMatch?.atmosphere || {
      'Unknown': '100%'
    },
    funFact: mockMatch?.funFact || `The semi-major orbit path is approximately ${(apiBody.semimajoraxis || 0).toLocaleString()} km.`,
    explorationHistory: mockMatch?.explorationHistory || [
      'Prehistory: Observed by early astronomers in antiquity.',
      'Modern Era: Explored using telescopes and robotic probes.'
    ]
  };
};

// Moon Mapper
export const mapApiMoon = (apiBody: any): Moon => {
  const id = apiBody.id.toLowerCase();
  const englishName = apiBody.englishName || apiBody.name;

  const mockMatch = mockMoons.find(m => m.id === id || m.name.toLowerCase() === englishName.toLowerCase());

  let massStr = 'N/A';
  if (apiBody.mass) {
    const val = apiBody.mass.massValue;
    const exp = apiBody.mass.massExponent;
    massStr = `${val} × 10²² kg`;
    if (exp !== 22) {
      massStr = `${val} × 10²${exp} kg`;
    }
  }

  const parentPlanetId = apiBody.aroundPlanet ? apiBody.aroundPlanet.planet.toLowerCase() : 'N/A';

  return {
    id: id,
    name: englishName,
    category: 'moon',
    description: mockMatch?.description || `${englishName} is a natural satellite orbiting the planet ${parentPlanetId}.`,
    image: mockMatch?.image || `https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80`,
    featured: mockMatch?.featured || false,
    planet: parentPlanetId,
    mass: massStr,
    radius: apiBody.meanRadius ? `${Math.round(apiBody.meanRadius).toLocaleString()} km` : 'N/A',
    gravity: apiBody.gravity ? `${apiBody.gravity} m/s²` : 'N/A',
    orbitalPeriod: apiBody.sideralOrbit ? `${apiBody.sideralOrbit.toFixed(2)} Days` : 'N/A',
    temperature: mockMatch?.temperature || 'N/A',
    funFact: mockMatch?.funFact || 'This natural satellite displays complex tidal locks.',
    explorationHistory: mockMatch?.explorationHistory || [
      'First flyby: Recorded during telescope grids.',
      'Modern exploration: Surveyed by flyby planetary probes.'
    ]
  };
};

// Astronaut Mapper
export const mapApiAstronaut = (apiAstronaut: any): Astronaut => {
  const id = String(apiAstronaut.id);
  const mockMatch = mockAstronauts.find(a => a.id === id || a.name.toLowerCase() === apiAstronaut.name.toLowerCase());

  let statusVal: 'Active' | 'Retired' | 'Deceased' = 'Retired';
  if (apiAstronaut.status?.name === 'Active') statusVal = 'Active';
  else if (apiAstronaut.status?.name === 'Deceased') statusVal = 'Deceased';

  const flightCount = apiAstronaut.flights_count || 0;
  const evaCount = apiAstronaut.eva_count || 0;

  return {
    id,
    name: apiAstronaut.name,
    category: 'astronaut',
    description: apiAstronaut.bio ? apiAstronaut.bio.split('.')[0] + '.' : 'Aerospace spaceflight traveler.',
    image: apiAstronaut.profile_image || mockMatch?.image || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`,
    featured: mockMatch?.featured || false,
    status: statusVal,
    birthDate: formatDate(apiAstronaut.date_of_birth),
    deathDate: apiAstronaut.date_of_death ? formatDate(apiAstronaut.date_of_death) : undefined,
    flightTime: apiAstronaut.time_in_space ? formatDuration(apiAstronaut.time_in_space) : (mockMatch?.flightTime || `${flightCount} flights`),
    spacewalks: evaCount,
    spacewalkTime: mockMatch?.spacewalkTime || `${evaCount * 6} hours`,
    missions: mockMatch?.missions || (apiAstronaut.flights ? apiAstronaut.flights.map((f: any) => f.name) : []),
    agency: apiAstronaut.agency?.abbreviation?.toLowerCase() || mockMatch?.agency || 'nasa',
    nationality: apiAstronaut.nationality || 'American',
    biography: apiAstronaut.bio || mockMatch?.biography || 'Biography details are classified.',
    achievements: mockMatch?.achievements || [
      `Flew in space ${flightCount} times.`,
      `Completed ${evaCount} spacewalking operations.`
    ]
  };
};

// Rocket Mapper
export const mapApiRocket = (apiRocket: any): Rocket => {
  const id = String(apiRocket.id);
  const mockMatch = mockRockets.find(r => r.id === id || r.name.toLowerCase() === apiRocket.name.toLowerCase());

  return {
    id,
    name: apiRocket.name,
    category: 'rocket',
    description: apiRocket.description || mockMatch?.description || 'Orbital class heavy propulsion vehicle.',
    image: apiRocket.image_url || mockMatch?.image || `https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80`,
    featured: mockMatch?.featured || false,
    manufacturer: apiRocket.manufacturer?.name || mockMatch?.manufacturer || 'Unknown Manufacturer',
    height: apiRocket.length ? `${apiRocket.length} m` : (mockMatch?.height || 'N/A'),
    diameter: apiRocket.diameter ? `${apiRocket.diameter} m` : (mockMatch?.diameter || 'N/A'),
    mass: apiRocket.launch_mass ? `${Math.round(apiRocket.launch_mass).toLocaleString()} kg` : (mockMatch?.mass || 'N/A'),
    stages: mockMatch?.stages || 2,
    payloadLeo: apiRocket.leo_capacity ? `${Math.round(apiRocket.leo_capacity).toLocaleString()} kg` : (mockMatch?.payloadLeo || 'N/A'),
    payloadGto: apiRocket.gto_capacity ? `${Math.round(apiRocket.gto_capacity).toLocaleString()} kg` : (mockMatch?.payloadGto || 'N/A'),
    status: apiRocket.active ? 'Active' : 'Retired',
    firstLaunch: formatDate(apiRocket.maiden_flight) || mockMatch?.firstLaunch || 'N/A',
    launches: apiRocket.total_launch_count || mockMatch?.launches || 0,
    successRate: apiRocket.consecutive_successful_launches ? '99%' : (mockMatch?.successRate || 'N/A'),
    costPerLaunch: mockMatch?.costPerLaunch || 'N/A',
    propulsion: apiRocket.info_url ? `Specs profile URL: ${apiRocket.info_url}` : (mockMatch?.propulsion || 'Liquid propellant core configuration.')
  };
};

// Agency Mapper
export const mapApiAgency = (apiAgency: any): Agency => {
  const id = String(apiAgency.id);
  const mockMatch = mockAgencies.find(a => a.id === id || a.name.toLowerCase() === apiAgency.name.toLowerCase());

  return {
    id,
    name: apiAgency.name,
    category: 'agency',
    description: apiAgency.description || mockMatch?.description || 'Cosmos aerospace agency.',
    image: apiAgency.image_url || mockMatch?.image || `https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80`,
    featured: mockMatch?.featured || false,
    abbreviation: apiAgency.abbreviation || mockMatch?.abbreviation || apiAgency.name,
    headquarters: apiAgency.headquarters || mockMatch?.headquarters || 'N/A',
    founded: parseInt(apiAgency.founding_year) || mockMatch?.founded || 1958,
    administrator: apiAgency.administrator || mockMatch?.administrator || 'N/A',
    budget: mockMatch?.budget || 'N/A',
    activeMissions: mockMatch?.activeMissions || [],
    notableAchievements: mockMatch?.notableAchievements || [
      `Completed a launch record of ${apiAgency.total_launch_count || 0} orbital missions.`
    ],
    history: apiAgency.description || mockMatch?.history || 'History documentation is ongoing.'
  };
};

// Mission Mapper
export const mapApiMission = (apiMission: any): Mission => {
  const id = String(apiMission.id);
  const mockMatch = mockMissions.find(m => m.id === id || m.name.toLowerCase() === apiMission.name.toLowerCase());

  return {
    id,
    name: apiMission.name,
    category: 'mission',
    description: apiMission.description || mockMatch?.description || 'Science research mission.',
    image: mockMatch?.image || `https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80`,
    featured: mockMatch?.featured || false,
    status: apiMission.status?.name === 'Success' ? 'Success' : 'Ongoing',
    launchDate: mockMatch?.launchDate || 'N/A',
    launchVehicle: mockMatch?.launchVehicle || 'N/A',
    duration: mockMatch?.duration || 'N/A',
    objective: apiMission.description || mockMatch?.objective || 'Scientific objective classification.',
    crew: mockMatch?.crew || [],
    agency: mockMatch?.agency || 'nasa',
    milestones: mockMatch?.milestones || [
      { date: 'InitialNET', title: 'Target netting launch', description: apiMission.description }
    ],
    scienceResults: mockMatch?.scienceResults || [
      'Data mapping calibrations ongoing.'
    ]
  };
};

// News Mapper
export const mapApiNews = (apiArticle: any): NewsItem => {
  const desc = apiArticle.summary || apiArticle.title;
  
  return {
    id: String(apiArticle.id),
    title: apiArticle.title,
    summary: desc.length > 180 ? desc.slice(0, 180) + '...' : desc,
    content: apiArticle.summary || '',
    publishedDate: formatDate(apiArticle.published_at),
    source: apiArticle.news_site || 'Space Dispatch',
    category: apiArticle.title.toLowerCase().includes('mars') ? 'Science' 
            : apiArticle.title.toLowerCase().includes('launch') ? 'Technology' 
            : apiArticle.title.toLowerCase().includes('artemis') ? 'Missions' 
            : 'Astrophysics',
    image: apiArticle.image_url || `https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80`,
    readTime: calculateReadTime(apiArticle.summary || apiArticle.title),
  };
};
