import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { IWeatherData, ICoordinates } from '../../interfaces';
import { Subscription } from 'rxjs';
import { CitiesService, GeolocationService } from '../../services';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit, OnDestroy  {
  @Output() public citySelected: EventEmitter<IWeatherData>;
  @Output() public currentCoordinatesSelected: EventEmitter<ICoordinates>;
  public citiesData: IWeatherData[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private citiesService: CitiesService,
    private geolocationService: GeolocationService) {
      this.citySelected = new EventEmitter<IWeatherData>();
      this.currentCoordinatesSelected = new EventEmitter<ICoordinates>();
  }

  ngOnInit() {
    this.subscribeToSavedCities();
    this.subscribeToGeolocation();
  }

  currentClickHandler(): void {
    this.geolocationService.fetchCurrentCoordinates();
    this.currentCoordinatesSelected.emit(undefined);
  }

  cityDeletedHandler(cityId: number): void {
    this.citiesService.deleteCity(cityId);
  }

  citySelectedHandler(cityData: IWeatherData): void {
    this.citySelected.emit(cityData);
  }

  private subscribeToGeolocation(): void {
    const sub = this.geolocationService.getCurrentCoordinates().subscribe((coordinates: ICoordinates) => {
      this.currentCoordinatesSelected.emit(coordinates);
    });
    this.subscriptions.push(sub);
  }

  private subscribeToSavedCities(): void {
    const sub = this.citiesService.getSavedCities().subscribe((citiesData: IWeatherData[]) => {
      this.citiesData = citiesData;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
