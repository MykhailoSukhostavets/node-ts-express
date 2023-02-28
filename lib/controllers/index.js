import fetch from 'node-fetch';
// Type guard to check response is valid
function isSunriseSunsetResponse(response) {
    return (typeof response?.results?.sunrise === 'string' &&
        typeof response.results?.sunset === 'string' &&
        typeof response?.results?.day_length === 'number');
}
// Define function to fetch sunrise/sunset times for a given latitude and longitude
async function fetchSunriseSunset(lat, lng) {
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
function getRandomLatLng(numberOfPoints) {
    return Array.from({ length: numberOfPoints }, () => ({
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
    }));
}
// Fetch sunrise/sunset times for all points, but never run more than MAX_CONCURRENCY in parallel
async function getSunriseSunsetTimes(points, MAX_CONCURRENCY = 5) {
    const results = [];
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
export default async function getEarliestSunrise() {
    // Generate 100 random latitude/longitude points
    const points = getRandomLatLng(100);
    // Fetch sunrise/sunset times for all points
    const results = await getSunriseSunsetTimes(points);
    // Find earliest sunrise and list the day length for this time
    const earliestSunrise = results.reduce((min, result) => result.results.sunrise < min.results.sunrise ? result : min, results[0]);
    return earliestSunrise;
}
//# sourceMappingURL=index.js.map