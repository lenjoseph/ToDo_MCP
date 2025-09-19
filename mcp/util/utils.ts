import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export const getCurrentWeather = async (location: string) => {
  const url = "https://api.weatherapi.com/v1/current.json";

  const headers = {
    "Content-Type": "application/json",
  };

  const api_key = process.env.WEATHER_API_KEY;

  const params = {
    key: api_key,
    q: location,
  };

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers,
        params,
      }
    );
    const data = response.data as { current: { condition: { text: string } } };

    return data.current.condition.text;
  } catch (error) {
    throw new Error(error);
  }
};
