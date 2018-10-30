import { Component, OnInit, Input } from '@angular/core';
import { IWeatherData } from '../../interfaces';

@Component({
  selector: 'app-weather-item',
  templateUrl: './weather-item.component.html',
  styleUrls: ['./weather-item.component.scss']
})
export class WeatherItemComponent implements OnInit {
  @Input() public weatherData: IWeatherData;

  constructor() { }

  ngOnInit() {
  }

}
