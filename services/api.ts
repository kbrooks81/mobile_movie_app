// Prefer theatrical first, then other common release channels
const PREFERRED_TYPES = [3, 2, 4, 6, 5, 1];
// 1 = Premiere, 2 = Theatrical (limited), 3 = Theatrical, 4 = Digital, 5 = Physical, 6 = TV

export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }

}

export const fetchPopularMovies = async ({ query }: { query: string }) => {
    const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/movie/top_rated?language=en-US&page=1`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if(!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch movies', response.statusText);
    }

    const data = await response.json();
    return data.results;
}

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => { 
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if(!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        
        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
 } 

 export const fetchMovieReleaseInfo = async (movieId: string): Promise<MovieReleaseInfo> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}/release_dates?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if(!response.ok) {
            throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
 }

 export function extractUSCertification(
  data: MovieReleaseInfo,
  country = 'US'
): string | null {
  const region = data?.results?.find(r => r.iso_3166_1 === country);
  if (!region) return null;

  // Prefer a non-empty certification by type order
  for (const t of PREFERRED_TYPES) {
    const match = region.release_dates?.find(
      rd => rd.type === t && rd.certification?.trim()
    );
    if (match) return match.certification.trim();
  }

  // Fallback: any non-empty certification in the region
  const any = region.release_dates?.find(rd => rd.certification?.trim());
  return any?.certification?.trim() || null;
}