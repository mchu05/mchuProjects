import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { IWeatherData, ICoordinates, IForecast } from '../interfaces';
import { TransportService } from './transport.service';
import { map, filter } from 'rxjs/operators';
import { constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherData: BehaviorSubject<IWeatherData[]>;
  private forecastData: BehaviorSubject<IForecast[]>;
  private selectedLocationId: BehaviorSubject<number>;
  private currentCoordinatesLocationId: number;

  constructor(private transportService: TransportService) {
    const savedWeatherData = this.getWeatherDataFromLocalStorage();
    this.weatherData = new BehaviorSubject<IWeatherData[]>(savedWeatherData);
    const savedForecastData = this.getForecastDataFromLocalStorage();
    this.forecastData = new BehaviorSubject<IForecast[]>(savedForecastData);
    this.selectedLocationId = new BehaviorSubject<number>(-1);
    this.currentCoordinatesLocationId = -1;
  }

  public getSelectedLocationId(): Observable<number> {
    return this.selectedLocationId.asObservable();
  }

  public getWeatherData(id: number): Observable<IWeatherData> {
    return this.weatherData.asObservable()
    .pipe(
      map((data: IWeatherData[]) => data.find((weatherData: IWeatherData) => weatherData.id === id))
    );
  }

  public getForecastData(id: number): Observable<IForecast> {
    return this.forecastData.asObservable()
    .pipe(
      map((data: IForecast[]) => data.find((item: IForecast) => item.city.id === id))
    );
  }

  public fetchWeatherDataByCoordinates(coordinates: ICoordinates): void {
    this.selectedLocationId.next(this.currentCoordinatesLocationId);
    if (coordinates) {
      const config = {
        url: this.getWeatherApiUrlByCoordinates(coordinates),
        byCoordinates: true
      };

      this.getWeatherDataByUrl(config);
    }
  }

  public fetchWeatherDataByCityId(cityId: number): void {
    const config = {
      url: this.getWeatherApiUrlByCityId(cityId),
      byCoordinates: false
    };

    this.selectedLocationId.next(cityId);
    this.getWeatherDataByUrl(config);
  }

  public fetchForecastDataByCityId(cityId: number): void {
    const config = {
      url: this.getForecastApiUrlByCityId(cityId),
      byCoordinates: false
    };

    this.getForecastDataByUrl(config);
  }

  private getForecastDataByUrl(config: any): void {
    this.transportService.get(config)
    .pipe(
      filter((res: HttpResponse<any>) => !!res.body),
      map((res: HttpResponse<any>) => <IForecast> res.body)
    )
    .subscribe((forecast: IForecast) => {
      this.patchCurrentForecastData(forecast);
    });
  }

  private getWeatherDataByUrl(config: any): void {
    this.transportService.get(config)
    .pipe(
      filter((res: HttpResponse<any>) => !!res.body),
      map((res: HttpResponse<any>) => <IWeatherData> res.body)
    )
    .subscribe((weatherData: IWeatherData) => {
      if (config.byCoordinates) {
        if (this.currentCoordinatesLocationId === -1) {
          this.selectedLocationId.next(weatherData.id);
        }
        this.currentCoordinatesLocationId = weatherData.id;
      }
      this.patchCurrentWeatherData(weatherData);
    });
  }

  private patchCurrentWeatherData(weatherData: IWeatherData): void {
    let data = this.weatherData.getValue();
    const dataItem = data.find((item: IWeatherData) => item.id === weatherData.id);

    if (dataItem) {
      data = data.map((item: IWeatherData) => {
        return item.id === weatherData.id ? weatherData : item;
      });
    } else {
      data.push(weatherData);
    }

    this.weatherData.next(data);
    this.saveWeatherDataToLocalStorage(data);
  }

  private patchCurrentForecastData(forecast: IForecast): void {
    let data = this.forecastData.getValue();
    const dataItem = data.find((item: IForecast) => item.city.id === forecast.city.id);

    if (dataItem) {
      data = data.map((item: IForecast) => {
        return item.city.id === forecast.city.id ? forecast : item;
      });
    } else {
      data.push(forecast);
    }

    this.forecastData.next(data);
    this.saveForecastDataToLocalStorage(data);
  }

  private saveWeatherDataToLocalStorage(weatherDataArray: IWeatherData[]): void {
    const data = JSON.stringify(weatherDataArray);
    localStorage.setItem('local saved weather data', data);
  }

  private getWeatherDataFromLocalStorage(): IWeatherData[] {
    const data = localStorage.getItem('local saved weather data');
    return data ? <IWeatherData[]> JSON.parse(data) : [];
  }

  private saveForecastDataToLocalStorage(forecastDataArray: IForecast[]): void {
    const data = JSON.stringify(forecastDataArray);
    localStorage.setItem('local saved forecast data', data);
  }

  private getForecastDataFromLocalStorage(): IForecast[] {
    const data = localStorage.getItem('local saved forecast data');
    return data ? <IForecast[]> JSON.parse(data) : [];
  }

  public getIconUrl(iconName: string): string {
    const { iconUrl } = environment;
    return `${iconUrl}/${iconName}.png`;
  }

  private getWeatherApiUrlByCityId(cityId: number): string {
    const { weatherUrl } = environment;
    const { appid } = constants;
    return `${weatherUrl}?id=${cityId}&appid=${appid}`;
  }

  private getForecastApiUrlByCityId(cityId: number): string {
    const { forecastUrl } = environment;
    const { appid } = constants;
    return `${forecastUrl}?id=${cityId}&appid=${appid}`;
  }

  private getWeatherApiUrlByCoordinates(coordinates: ICoordinates): string {
    const { lat, lon } = coordinates;
    const { weatherUrl } = environment;
    const { appid } = constants;
    return `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${appid}`;
  }
}
