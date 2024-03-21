import * as geo from "./geo.js";
import { weatherApiKey } from "./weatherApiKey.js";

export async function getForecast() {
  const position = await geo.getCoordinates();

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const response = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${weatherApiKey}`
  );
  const json = await response.json();

  return {
    city: json.city_name,
    state: json.country_code,
    forecast: json.data.map((e) => ({
      weekday: new Date(e.datetime + "T00:00:00").toLocaleString("en-us", {
        weekday: "long",
      }),
      high: e.high_temp,
      low: e.low_temp,
      icon: e.weather.icon,
    })),
  };
}
