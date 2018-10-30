import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { constants } from '../constants/constants';
import { IWeatherData } from '../interfaces';
import { TransportService } from './transport.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private citiesWeather: BehaviorSubject<IWeatherData[]>;
  private savedCities: BehaviorSubject<IWeatherData[]>;

  constructor(private transportService: TransportService) {
    this.citiesWeather = new BehaviorSubject<IWeatherData[]>([]);
    this.savedCities = new BehaviorSubject<IWeatherData[]>([]);
  }

  public getSavedCities(): Observable<IWeatherData[]> {
    return this.savedCities.asObservable().pipe(
      map((data: IWeatherData[]) => data.filter((item: IWeatherData) => item.name && item.weather))
    );
  }

  public getCitiesWeather(): Observable<IWeatherData[]> {
    return this.citiesWeather.asObservable();
  }

  public fetchCitiesWeatherByQuery(query: string): void {
    const config = {
      url: this.getCityApiUrl(query)
    };

    this.transportService.get(config).pipe(
      filter((res: HttpResponse<any>) => !!res.body),
      map((res: HttpResponse<any>) => <IWeatherData[]> res.body.list)
    )
    .subscribe((data: IWeatherData[]) => this.citiesWeather.next(data));
  }

  public addCity(weatherData: IWeatherData): void {
    let savedCities = this.getLocalSavedCities();
    const cityItem = savedCities.find((city: IWeatherData) => city.id === weatherData.id);

    if (cityItem) {
      savedCities = savedCities.map((city: IWeatherData) => {
        return city.id === weatherData.id ? weatherData : city;
      });
    } else {
      savedCities.push(weatherData);
    }

    this.saveCitiesToLocal(savedCities);
    this.savedCities.next(savedCities);
  }

  public deleteCity(cityId: number): void {
    let savedCities = this.getLocalSavedCities();
    savedCities = savedCities.filter((city: IWeatherData) => city.id !== cityId);

    this.saveCitiesToLocal(savedCities);
    this.savedCities.next(savedCities);
  }

  public getLocalSavedCities(): IWeatherData[] {
    const data = localStorage.getItem('local saved cities');
    return data ? <IWeatherData[]> JSON.parse(data) : [];
  }

  private saveCitiesToLocal(cities: IWeatherData[]): void {
    localStorage.setItem('local saved cities', JSON.stringify(cities));
  }

  private getCityApiUrl(query: string): string {
    const { citiesUrl } = environment;
    const { appid } = constants;
    return `${citiesUrl}?q=${query}&appid=${appid}`;
  }
}
