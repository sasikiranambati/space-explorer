import type { Planet, Moon, NewsItem, SpaceEntity, EntityCategory } from '../types';
import * as mappers from './apiMappers';
import * as mock from './mockData';

// API Configuration URLs
const SOLAR_SYSTEM_API = 'https://api.le-systeme-solaire.net/rest/bodies';
const LLD2_API = 'https://lldev.thespacedevs.com/v2.2.0';
const NEWS_API = 'https://api.spaceflightnewsapi.net/v4/articles';

// Fetch helper with timeout
async function fetchWithTimeout(url: string, options = {}, timeout = 6000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// 1. Fetch Planets
export async function getPlanets(): Promise<Planet[]> {
  try {
    const res = await fetchWithTimeout(`${SOLAR_SYSTEM_API}?filter[]=isPlanet,eq,true`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.bodies && data.bodies.length > 0) {
      return data.bodies.map(mappers.mapApiPlanet);
    }
    return mock.planets;
  } catch (err) {
    console.warn('Planets API fetch failed, falling back to mock database:', err);
    return mock.planets;
  }
}

// 2. Fetch Moons
export async function getMoons(): Promise<Moon[]> {
  try {
    // The solar system API has hundreds of moons; we filter to find the major ones matching our database
    const res = await fetchWithTimeout(`${SOLAR_SYSTEM_API}?filter[]=isPlanet,eq,false`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.bodies && data.bodies.length > 0) {
      // Keep only major moons to avoid polluting lists, or filter by mock bodies
      const majorMoonIds = mock.moons.map(m => m.id);
      const apiMoons = data.bodies
        .map(mappers.mapApiMoon)
        .filter((m: Moon) => majorMoonIds.includes(m.id) || m.radius !== 'N/A');
      return apiMoons.length > 0 ? apiMoons : mock.moons;
    }
    return mock.moons;
  } catch (err) {
    console.warn('Moons API fetch failed, falling back to mock database:', err);
    return mock.moons;
  }
}

// 3. Fetch Entity Details by Category + ID
export async function getEntityDetail(category: EntityCategory, id: string): Promise<SpaceEntity> {
  const fallback = mock.allEntities.find(item => item.category === category && item.id === id);

  try {
    switch (category) {
      case 'planet': {
        const res = await fetchWithTimeout(`${SOLAR_SYSTEM_API}/${id}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return mappers.mapApiPlanet(data);
      }
      case 'moon': {
        const res = await fetchWithTimeout(`${SOLAR_SYSTEM_API}/${id}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return mappers.mapApiMoon(data);
      }
      case 'astronaut': {
        const res = await fetchWithTimeout(`${LLD2_API}/astronaut/${id}/`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return mappers.mapApiAstronaut(data);
      }
      case 'rocket': {
        const res = await fetchWithTimeout(`${LLD2_API}/config/launcher/${id}/`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return mappers.mapApiRocket(data);
      }
      case 'agency': {
        const res = await fetchWithTimeout(`${LLD2_API}/agencies/${id}/`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return mappers.mapApiAgency(data);
      }
      case 'mission': {
        const res = await fetchWithTimeout(`${LLD2_API}/mission/${id}/`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return mappers.mapApiMission(data);
      }
      default:
        if (fallback) return fallback;
        throw new Error('Unknown category');
    }
  } catch (err) {
    console.warn(`API detail fetch failed for ${category}/${id}. Falling back to mock data:`, err);
    if (fallback) return fallback;
    throw err;
  }
}

// 4. Fetch Spaceflight News Articles
export async function getNewsArticles(category?: string): Promise<NewsItem[]> {
  try {
    let url = `${NEWS_API}/?limit=12`;
    if (category && category !== 'All') {
      // Spaceflight News API v4 doesn't support direct category filters in simple query format,
      // but we can query by search query keywords, e.g. ?search=missions
      url += `&search=${category}`;
    }
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map(mappers.mapApiNews);
    }
    return mock.news;
  } catch (err) {
    console.warn('News articles API fetch failed, falling back to mock database:', err);
    return mock.news;
  }
}

// 5. Global Search / Autocomplete Suggestions
export async function querySpaceEntities(query: string, categoryFilter?: string): Promise<SpaceEntity[]> {
  const cleanQuery = query.toLowerCase().trim();
  
  // Return early if query is blank
  if (!cleanQuery) return [];

  // Local fallback results search (fast baseline)
  const localResults = mock.allEntities.filter(entity => {
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || entity.category === categoryFilter;
    const matchesQuery = entity.name.toLowerCase().includes(cleanQuery) ||
                         entity.description.toLowerCase().includes(cleanQuery);
    return matchesCategory && matchesQuery;
  });

  // If query is short or LLD2 has rate limits, we search local + Solar System (no key / high limit)
  try {
    const promises: Promise<SpaceEntity[]>[] = [];

    // Category routing
    const targetCat = categoryFilter || 'all';

    // A. Query Solar System bodies (Planets & Moons)
    if (targetCat === 'all' || targetCat === 'planet' || targetCat === 'moon') {
      const p = fetchWithTimeout(`${SOLAR_SYSTEM_API}?filter[]=englishName,ico,${cleanQuery}`)
        .then(async res => {
          if (!res.ok) return [];
          const data = await res.json();
          if (!data.bodies) return [];
          return data.bodies.map((body: any) => 
            body.isPlanet ? mappers.mapApiPlanet(body) : mappers.mapApiMoon(body)
          ).filter((e: SpaceEntity) => targetCat === 'all' || e.category === targetCat);
        })
        .catch(() => []);
      promises.push(p);
    }

    // B. Query Launch Library 2 for Astronauts
    if ((targetCat === 'all' || targetCat === 'astronaut') && cleanQuery.length > 2) {
      const p = fetchWithTimeout(`${LLD2_API}/astronaut/?search=${cleanQuery}&limit=5`)
        .then(async res => {
          if (!res.ok) return [];
          const data = await res.json();
          if (!data.results) return [];
          return data.results.map(mappers.mapApiAstronaut);
        })
        .catch(() => []);
      promises.push(p);
    }

    // C. Query Launch Library 2 for Rockets
    if ((targetCat === 'all' || targetCat === 'rocket') && cleanQuery.length > 2) {
      const p = fetchWithTimeout(`${LLD2_API}/config/launcher/?search=${cleanQuery}&limit=5`)
        .then(async res => {
          if (!res.ok) return [];
          const data = await res.json();
          if (!data.results) return [];
          return data.results.map(mappers.mapApiRocket);
        })
        .catch(() => []);
      promises.push(p);
    }

    // D. Query Launch Library 2 for Agencies
    if ((targetCat === 'all' || targetCat === 'agency') && cleanQuery.length > 2) {
      const p = fetchWithTimeout(`${LLD2_API}/agencies/?search=${cleanQuery}&limit=5`)
        .then(async res => {
          if (!res.ok) return [];
          const data = await res.json();
          if (!data.results) return [];
          return data.results.map(mappers.mapApiAgency);
        })
        .catch(() => []);
      promises.push(p);
    }

    // E. Query Launch Library 2 for Missions
    if ((targetCat === 'all' || targetCat === 'mission') && cleanQuery.length > 2) {
      const p = fetchWithTimeout(`${LLD2_API}/mission/?search=${cleanQuery}&limit=5`)
        .then(async res => {
          if (!res.ok) return [];
          const data = await res.json();
          if (!data.results) return [];
          return data.results.map(mappers.mapApiMission);
        })
        .catch(() => []);
      promises.push(p);
    }

    // Await all resolves (if API takes too long or fails, we catch it)
    const apiResultsArrays = await Promise.all(promises);
    const apiResults = apiResultsArrays.flat();

    // Merge API results and Local results, removing duplicates based on category + id matching
    const merged = [...apiResults, ...localResults];
    const uniqueMap = new Map<string, SpaceEntity>();
    merged.forEach(item => {
      uniqueMap.set(`${item.category}-${item.id}`, item);
    });

    return Array.from(uniqueMap.values());
  } catch (err) {
    console.warn('API global search queries failed, using mock database search:', err);
    return localResults;
  }
}

// 6. Fetch NASA Planet Images Gallery with Curated Fallbacks
const PLANET_FALLBACK_IMAGES: Record<string, string[]> = {
  earth: [
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  ],
  mars: [
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1614314107204-b7ce53fb46e1?auto=format&fit=crop&w=800&q=80'
  ],
  jupiter: [
    'https://images.unsplash.com/photo-1630839437035-dac17da580d0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1639843885527-43b098a9661a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
  ],
  saturn: [
    'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80'
  ]
};

export async function getNasaPlanetImages(planetName: string): Promise<string[]> {
  const normName = planetName.toLowerCase().trim();
  const fallback = PLANET_FALLBACK_IMAGES[normName] || [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
  ];

  try {
    const query = encodeURIComponent(`${normName} space planet`);
    const res = await fetchWithTimeout(`https://images-api.nasa.gov/search?q=${query}&media_type=image`, {}, 5000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.collection?.items && data.collection.items.length > 0) {
      const urls: string[] = [];
      for (const item of data.collection.items) {
        if (item.links && item.links.length > 0) {
          const href = item.links[0].href;
          // Filter out preview sizes and duplicate links
          if (href && !urls.includes(href)) {
            urls.push(href);
          }
        }
        if (urls.length >= 8) break;
      }
      if (urls.length > 0) return urls;
    }
  } catch (err) {
    console.warn(`NASA Image Search API failed for ${planetName}. Utilizing curated fallbacks.`, err);
  }

  return fallback;
}

export interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  mediaType: string;
  date: string;
}

export async function getNasaApod(): Promise<ApodData> {
  const apiKey = 'NJcmwGH6hTXm39CZXMWzxmMLgE1YcRp5IOagezfL';
  try {
    const res = await fetchWithTimeout(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      title: data.title || 'Astronomy Picture of the Day',
      explanation: data.explanation || 'Every day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.',
      url: data.url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      hdurl: data.hdurl,
      mediaType: data.media_type || 'image',
      date: data.date || ''
    };
  } catch (err) {
    console.warn('NASA APOD API fetch failed, using fallback:', err);
    return {
      title: 'Galactic Core and Cosmic Dust',
      explanation: 'Vibrant nebulas and dense cosmic dust clouds weave across the active starburst zones of the galactic core. Captured with wide-field astronomical observation, this image reveals thousands of developing star seeds nestled inside ionized hydrogen filaments.',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      mediaType: 'image',
      date: '2026-07-11'
    };
  }
}
