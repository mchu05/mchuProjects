import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IWeatherData } from '../../interfaces';

@Component({
  selector: 'app-city-info',
  templateUrl: './city-info.component.html',
  styleUrls: ['./city-info.component.scss']
})
export class CityInfoComponent {
  @Input() public weatherData: IWeatherData;
  @Input() public deleteButtonVisible: boolean;
  @Output() public citySelected: EventEmitter<IWeatherData> = new EventEmitter<IWeatherData>();
  @Output() public cityDeleted: EventEmitter<number> = new EventEmitter<number>();

  citySelectedHandler(): void {
    this.citySelected.emit(this.weatherData);
  }

  cityDeletedHandler(): void {
    this.cityDeleted.emit(this.weatherData.id);
  }
}
