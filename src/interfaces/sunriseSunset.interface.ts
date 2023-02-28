export default interface SunriseSunsetResponse {
  results: {
    sunrise: string;
    sunset: string;
    day_length: number;
  };
}
