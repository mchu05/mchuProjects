import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CitySelectorComponent } from '../city-selector/city-selector.component';
import { CitiesService, ModalService, WeatherService} from '../../services';
import { IWeatherData, ICoordinates } from '../../interfaces';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private weatherSubscription: Subscription;

  constructor(private modalService: ModalService,
    private citiesService: CitiesService,
    private weatherService: WeatherService) { }

  ngOnInit() {
    this.listenModalResults();
  }

  public showCitySelector(): void {
    this.modalService.showModal(CitySelectorComponent);
  }

  public onCitySelected(cityData: IWeatherData): void {
    this.weatherService.fetchWeatherDataByCityId(cityData.id);
  }

  public onCurrentCoordinatesSelected(coordinates: ICoordinates): void {
    this.weatherService.fetchWeatherDataByCoordinates(coordinates);
  }

  private listenModalResults(): void {
    this.modalService.getResult().subscribe((res: any) => {
      if (res) {
        try {
          this.citiesService.addCity(<IWeatherData> res);
        } catch (e) {}
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
