import fetch from 'node-fetch';
import type PointInterface from 'src/interfaces/point.interface';
import type SunriseSunsetResponse from 'src/interfaces/sunriseSunset.interface';

// Type guard to check response is valid
// "any" here used as common practice in type guards
function isSunriseSunsetResponse(
  response: any
): response is SunriseSunsetResponse {
  return (
    typeof response?.results?.sunrise === 'string' &&
    typeof response.results?.sunset === 'string' &&
    typeof response?.results?.day_length === 'number'
  );
}

// Define function to fetch sunrise/sunset times for a given latitude and longitude
async function fetchSunriseSunset(
  lat: number,
  lng: number
): Promise<SunriseSunsetResponse> {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !isSunriseSunsetResponse(data)) {
    console.log(data);
    throw new Error(`Failed to fetch sunrise/sunset times for ${lat}, ${lng}`);
  }

  return data;
}

// Generate random latitude/longitude points
function getRandomLatLng(numberOfPoints: number) {
  return Array.from({ length: numberOfPoints }, () => ({
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180,
  }));
}

// Fetch sunrise/sunset times for all points, but never run more than MAX_CONCURRENCY in parallel
async function getSunriseSunsetTimes(
  points: PointInterface[],
  MAX_CONCURRENCY = 5
) {
  const results: SunriseSunsetResponse[] = [];

  for (let i = 0; i < points.length; i += MAX_CONCURRENCY) {
    const chunk = points.slice(i, i + MAX_CONCURRENCY);

    const chunkPromises = chunk.map((point) => {
      return fetchSunriseSunset(point.lat, point.lng);
    });

    const chunkResults = await Promise.all(chunkPromises);
    // Unnecessary logging, just to see progress in the console
    console.log(`Fetched ${i + chunk.length} of ${points.length} points`);
    console.log(chunkResults);
    results.push(...chunkResults);
  }

  return results;
}

export default async function getEarliestSunrise(): Promise<SunriseSunsetResponse> {
  // Generate 100 random latitude/longitude points
  const points = getRandomLatLng(100);

  // Fetch sunrise/sunset times for all points
  const results = await getSunriseSunsetTimes(points);

  // Find earliest sunrise and list the day length for this time
  const earliestSunrise = results.reduce((min, result) => {
    // Rarely the day length is 0, so we can ignore these results
    // This is a bug in the API, when sunrise and sunset == "1970-01-01T00:00:01+00:00"

    return result.results.day_length != 0 &&
      result.results.sunrise < min.results.sunrise
      ? result
      : min;
  }, results[0]);

  return earliestSunrise;
}
