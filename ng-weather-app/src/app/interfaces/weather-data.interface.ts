import { ICoordinates, IWeather, IMain, IWind } from '.';

interface IClouds {
  all: number;
}

interface ISys {
  type: number;
  country: string;
  id: number;
  sunrise: number;
  sunset: number;
  message: number;
}

export interface IWeatherData {
  base?: string;
  id?: number;
  name?: string;
  cod: number;
  coord?: ICoordinates;
  weather: IWeather[];
  main: IMain;
  wind: IWind;
  clouds: IClouds;
  sys: ISys;
  rain?: any;
  snow?: any;
  dt: number;
  dt_txt?: string;
}

