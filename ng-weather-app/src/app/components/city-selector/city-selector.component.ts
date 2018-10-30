import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IWeatherData } from '../../interfaces';
import { ModalService, CitiesService } from '../../services';

@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss']
})
export class CitySelectorComponent implements OnInit, OnDestroy {
  public text: string;
  public citiesWeather: IWeatherData[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private citiesService: CitiesService,
              private modalService: ModalService) { }

  ngOnInit() {
    const sub = this.citiesService.getCitiesWeather().subscribe((data: IWeatherData[]) => {
      this.citiesWeather = data;
    });
    this.subscriptions.push(sub);
  }

  public textChangeHandler(): void {
    if (this.text && this.text.length >= 3) {
      this.citiesService.fetchCitiesWeatherByQuery(this.text);
    } else {
      this.citiesWeather = [];
    }
  }

  public citySelectedHandler(cityWeather: IWeatherData): void {
    this.modalService.setResult(cityWeather);
    this.modalService.hideModal();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
