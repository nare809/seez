/**
 * This file contains helper functions to use TheMovieDB API
 */
import { getCurrentLanguage } from "../utils/language";

const API_KEY = process.env.TMDB_API_KEY;
const baseImgUrl = "https://image.tmdb.org/t/p/";
const baseUrl = "https://api.themoviedb.org/3";

const API_ERROR_CODE = 7;
const RESOURCE_NOT_FOUND = 34;

// Get language parameter for API requests
const getLanguageParam = () => {
  const lang = getCurrentLanguage();
  console.log(`Using language for API call: ${lang}`);
  
  // For Telugu language, prioritize original Telugu content
  if (lang === 'te') {
    return `&language=${lang}&region=IN&with_original_language=te`;
  }
  
  // For other Indian languages, add region parameter
  if (['hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    return `&language=${lang}&region=IN&with_original_language=${lang}`;
  }
  
  return `&language=${lang}`;
};

/**
 * Takes the poster_path or backdrop_path value from the API and an optional
 * size parameter and returns the full image URL.
 * See https://api.themoviedb.org/3/configuration?api_key=YOURKEY for
 * examples of image sizes
 */

export const getFullImgPath = (imgPath, size = "original") =>
  `${baseImgUrl}${size}${imgPath}`;

/**
 * Takes a full date in the format YYYY-MM-DD and returns the year
 */
export const getYearFromDate = fullDate => fullDate.substring(0, 4);

/**
 * Properties are not the same on movies and TV shows, for
 * example, movies have "title" while TV has "name".
 * This function returns a copy of the movie with consistent properties.
 * Basically, this function ensures that the movie object always
 * has these fields: title, media_type, release_date, release_year
 *
 * @param {Object} movie
 */
export function normalizeMovie(movie) {
  /* eslint-disable camelcase */
  if (movie.isNormalized) return movie;

  const {
    title,
    name,
    release_date,
    first_air_date,
    media_type,
    poster_path,
    profile_path,
  } = movie;

  let determinedMediaType;
  if (media_type) {
    // if the media_type property already exists, no need to
    // manually determine the media type
    determinedMediaType = media_type;
  } else {
    // only movies have the "title" property
    // tv and persons have "name" instead
    determinedMediaType = title ? "movie" : "tv";
  }

  const releaseDate = release_date || first_air_date;

  return {
    ...movie,
    title: title || name,
    media_type: determinedMediaType,
    poster_path: poster_path || profile_path,
    release_date: releaseDate,
    release_year: releaseDate ? getYearFromDate(releaseDate) : "",
    isNormalized: true,
  };
}

/**
 * Takes a response from a fetch, verifies it, and returns the JSON
 * @param {Promise} res
 */
async function checkResponse(res) {
  console.log("API Response URL:", res.url);
  const json = await res.json();
  if (json.status_code === API_ERROR_CODE) throw new Error("Invalid API key");
  if (json.status_code === RESOURCE_NOT_FOUND)
    throw new Error("Couldn't find anything =(");

  // Log abbreviated response for debugging
  console.log("API Response (first result):", json.results?.[0]);
  
  return json;
}

export function getNowPlayingMovies() {
  const nowPlayingMovieUrl = `${baseUrl}/movie/now_playing?api_key=${API_KEY}${getLanguageParam()}&page=1`;
  return fetch(nowPlayingMovieUrl)
    .then(checkResponse)
    .then(json => json.results);
}

export function getNowScifiMovies() {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&with_genres=878`;
  
  // Add original language filter for Indian languages
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url += `&with_original_language=${lang}`;
  }
  
  return fetch(url)
    .then(checkResponse)
    .then(json => json.results);
}

export function getNowHorrorMovies() {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&with_genres=27`;
  
  // Add original language filter for Indian languages
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url += `&with_original_language=${lang}`;
  }
  
  return fetch(url)
    .then(checkResponse)
    .then(json => json.results);
}

export function getNowKidsMovies() {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&with_genres=16`;
  
  // Add original language filter for Indian languages
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url += `&with_original_language=${lang}`;
  }
  
  return fetch(url)
    .then(checkResponse)
    .then(json => json.results);
}

export function getNowThrillerMovies() {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&vote_average.gte=8&with_genres=53`;
  
  // Add original language filter for Indian languages
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url += `&with_original_language=${lang}`;
  }
  
  return fetch(url)
    .then(checkResponse)
    .then(json => json.results);
}

export function getNowAiringTVShows() {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/tv/on_the_air?api_key=${API_KEY}${getLanguageParam()}&page=1`;
  
  // For Indian languages, use discover instead to filter by original language
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url = `${baseUrl}/discover/tv?api_key=${API_KEY}${getLanguageParam()}&with_original_language=${lang}&sort_by=popularity.desc`;
  }
  
  return fetch(url)
    .then(checkResponse)
    .then(json => json.results);
}

// homepage documentaries shows!
export function getNowDocumentaryShows() {
  const nowDocumentaryShowsUrl = `${baseUrl}/discover/tv?api_key=${API_KEY}${getLanguageParam()}&with_genres=99`;
  return fetch(nowDocumentaryShowsUrl)
    .then(checkResponse)
    .then(json => json.results);
}

export function getMovieInfo(id) {
  const currentMovieUrl = `${baseUrl}/movie/${id}?api_key=${API_KEY}${getLanguageParam()}&append_to_response=videos,credits,recommendations`;
  return fetch(currentMovieUrl).then(checkResponse);
}

export async function getTVInfo(id) {
  const url = `${baseUrl}/tv/${id}?api_key=${API_KEY}${getLanguageParam()}&append_to_response=videos,credits,external_ids,recommendations`;
  const res = await fetch(url);
  return checkResponse(res);
}

export function getMovieGenres() {
  const genreUrl = `${baseUrl}/genre/movie/list?api_key=${API_KEY}${getLanguageParam()}`;
  return fetch(genreUrl)
    .then(checkResponse)
    .then(json => json.genres);
}

export function getShowGenres() {
  const genreUrl = `${baseUrl}/genre/tv/list?api_key=${API_KEY}${getLanguageParam()}`;
  return fetch(genreUrl)
    .then(checkResponse)
    .then(json => json.genres);
}

export function getGenreMovies(genre, page = 1) {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genre}`;
  
  // Add original language filter for Indian languages
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url += `&with_original_language=${lang}`;
  }
  
  return fetch(url).then(checkResponse);
}

export function getGenreShows(genre, page = 1) {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/discover/tv?api_key=${API_KEY}${getLanguageParam()}&sort_by=popularity.desc&page=${page}&with_genres=${genre}`;
  
  // Add original language filter for Indian languages
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    url += `&with_original_language=${lang}`;
  }
  
  return fetch(url).then(checkResponse);
}

export function getMoviesFromType(type, page = 1) {
  const lang = getCurrentLanguage();
  
  // For Indian languages, use discover with original language filter
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    const url = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`;
    return fetch(url).then(checkResponse);
  }
  
  // Default approach for other languages
  const url = `${baseUrl}/movie/${type}?api_key=${API_KEY}${getLanguageParam()}&page=${page}`;
  return fetch(url).then(checkResponse);
}

export function getShowsFromType(type, page = 1) {
  const lang = getCurrentLanguage();
  
  // For Indian languages, use discover with original language filter
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    const url = `${baseUrl}/discover/tv?api_key=${API_KEY}${getLanguageParam()}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`;
    return fetch(url).then(checkResponse);
  }
  
  // Default approach for other languages
  const url = `${baseUrl}/tv/${type}?api_key=${API_KEY}${getLanguageParam()}&page=${page}`;
  return fetch(url).then(checkResponse);
}

export function getMoviesFromYear(year, page = 1) {
  const moviesUrl = `${baseUrl}/discover/movie?api_key=${API_KEY}${getLanguageParam()}&sort_by=popularity.desc&page=${page}&primary_release_year=${year}`;
  return fetch(moviesUrl).then(checkResponse);
}

export function getShowsFromYear(year, page = 1) {
  const moviesUrl = `${baseUrl}/discover/tv?api_key=${API_KEY}${getLanguageParam()}&sort_by=popularity.desc&page=${page}&first_air_date_year=${year}`;
  return fetch(moviesUrl).then(checkResponse);
}

export function getSeasonFromId(id, season) {
  const episodesUrl = `${baseUrl}/tv/${id}/season/${season}?api_key=${API_KEY}${getLanguageParam()}`;
  return fetch(episodesUrl)
    .then(checkResponse)
    .then(json => json.episodes);
}

export async function multiSearch(query, page = 1) {
  const lang = getCurrentLanguage();
  let url = `${baseUrl}/search/multi?api_key=${API_KEY}${getLanguageParam()}&query=${query}&page=${page}`;
  
  // For Telugu, prioritize Telugu content in search results
  if (lang === 'te') {
    // Search twice - once with original language filter and once without
    const teResponse = await fetch(`${url}&with_original_language=te`).then(checkResponse);
    
    // If Telugu search has results, return those
    if (teResponse.results && teResponse.results.length > 0) {
      return teResponse;
    }
    
    // Otherwise fall back to regular search
    console.log("Falling back to regular search (no Telugu results found)");
  }
  
  const res = await fetch(url);
  return checkResponse(res);
}

export function getPersonDetails(id) {
  const personURL = `${baseUrl}/person/${id}?api_key=${API_KEY}${getLanguageParam()}&append_to_response=combined_credits,images,external_ids`;
  return fetch(personURL).then(checkResponse);
}

/**
 * Get Telugu movies (based on original language)
 * @param {number} page Page number
 * @returns {Promise} Promise with Telugu movies
 */
export function getTeluguMovies(page = 1) {
  const url = `${baseUrl}/discover/movie?api_key=${API_KEY}&with_original_language=te&sort_by=popularity.desc&page=${page}&region=IN${getLanguageParam()}`;
  console.log("Fetching Telugu movies:", url);
  return fetch(url).then(checkResponse);
}

/**
 * Get movies in the user's selected language
 * @param {number} page Page number
 * @returns {Promise} Promise with movies in user's language
 */
export function getMoviesInUserLanguage(page = 1) {
  const lang = getCurrentLanguage();
  // For certain languages, use the with_original_language parameter
  if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(lang)) {
    const url = `${baseUrl}/discover/movie?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}&region=IN${getLanguageParam()}`;
    console.log("Fetching movies in user language:", url);
    return fetch(url).then(checkResponse);
  }
  
  // For other languages, just use the popular endpoint with language parameter
  return getMoviesFromType('popular', page);
}

export const fetchNetworks = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/network/list?api_key=${API_KEY}`
    );
    const data = await response.json();
    
    // Filter for major streaming networks
    const streamingNetworks = data.results.filter(network => 
      network.name.toLowerCase().includes('netflix') ||
      network.name.toLowerCase().includes('amazon') ||
      network.name.toLowerCase().includes('prime') ||
      network.name.toLowerCase().includes('hulu') ||
      network.name.toLowerCase().includes('disney') ||
      network.name.toLowerCase().includes('hbo') ||
      network.name.toLowerCase().includes('starz') ||
      network.name.toLowerCase().includes('showtime')
    );

    return streamingNetworks;
  } catch (error) {
    console.error('Error fetching networks:', error);
    return [];
  }
};
