import { IWeatherData, ICoordinates } from './';

interface ICity {
  coord: ICoordinates;
  id: number;
  name: string;
  country: string;
}

export interface IForecast {
  list: IWeatherData[];
  city: ICity;
}
