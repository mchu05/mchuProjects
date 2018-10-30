import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../../services';
import { IWeatherData, IWeather, IForecast } from '../../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-description',
  templateUrl: './weather-description.component.html',
  styleUrls: ['./weather-description.component.scss']
})
export class WeatherDescriptionComponent implements OnInit, OnDestroy {
  public weatherData: IWeatherData;
  public forecastData: IForecast;
  private subscriptions: Subscription[] = [];

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.subscribeToLocationIdChanges();
  }

  private subscribeToLocationIdChanges(): void {
    const sub = this.weatherService.getSelectedLocationId().subscribe((id: number) => {
      if (id !== -1) {
        this.subscribeToLocationWeather(id);
        this.subscribeToLocationForecast(id);
        this.weatherService.fetchForecastDataByCityId(id);
      }
    });
    this.subscriptions.push(sub);
  }

  private subscribeToLocationWeather(id: number): void {
    const sub = this.weatherService.getWeatherData(id).subscribe((data: IWeatherData) => {
      if (data) {
        this.weatherData = data;
        this.setIconUrls(this.weatherData.weather);
      }
    });
    this.subscriptions.push(sub);
  }

  private subscribeToLocationForecast(id: number): void {
    const sub = this.weatherService.getForecastData(id).subscribe((data: IForecast) => {
      if (data) {
        this.forecastData = data;
        this.forecastData.list.forEach((weatherData: IWeatherData) => {
          this.setIconUrls(weatherData.weather);
        });
      }
    });
    this.subscriptions.push(sub);
  }

  private setIconUrls(weatherArray: IWeather[]): void {
    weatherArray.forEach((weather: IWeather) => {
      weather.iconUrl = this.weatherService.getIconUrl(weather.icon);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
