# node-ts-express

This is a Node.js project that fetches sunrise/sunset times for 100 random lat/long points around the world using the sunrise-sunset.org API. The project finds the earliest sunrise time and lists the day length for this time.

## Technologies Used

- Node.js
- Express
- TypeScript

## Getting Started

1. Clone the repository to your local machine.
2. Install the dependencies using `npm install`.
3. Run the server using `npm start`.
4. Send a GET request to http://localhost:3000/api/earliest to fetch the earliest sunrise time and day length.

## API Endpoints

### `/api/earliest`

This endpoint fetches the earliest sunrise time and day length for 100 random lat/long points around the world.

**Query Parameters**

None

**Response example**

```
{
   "results":{
      "sunrise":"1970-01-01T00:00:00+00:00",
      "sunset":"1970-01-01T00:00:00+00:00",
      "solar_noon":"2023-02-28T12:05:27+00:00",
      "day_length":0,
      "civil_twilight_begin":"2023-02-28T07:44:08+00:00",
      "civil_twilight_end":"2023-02-28T16:26:45+00:00",
      "nautical_twilight_begin":"2023-02-28T02:02:12+00:00",
      "nautical_twilight_end":"2023-02-28T22:08:42+00:00",
      "astronomical_twilight_begin":"1970-01-01T00:00:01+00:00",
      "astronomical_twilight_end":"1970-01-01T00:00:01+00:00"
   },
   "status":"OK"
}
```

## Future Improvements

- Add unit tests
- Add github actions for tests
- Add .env file, at least for PORT
- Add a logger middleware
- Add authentication support (JWT)
- Optional: Add Docker
- Optional: Add a database to store the results
