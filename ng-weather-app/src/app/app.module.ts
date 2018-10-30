import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialComponentsModule } from './material-components.module';

import { environment } from '../environments/environment';
import { GeolocationService ,
  TransportService,
  WeatherService,
  CitiesService,
  ModalService
} from './services';

import { AppComponent } from './app.component';
import {
  MainComponent,
  ModalComponent,
  CitySelectorComponent,
  CityInfoComponent,
  CitiesListComponent,
  WeatherDescriptionComponent,
  WeatherItemComponent,
  ForecastDescriptionComponent
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ModalComponent,
    CitySelectorComponent,
    CityInfoComponent,
    CitiesListComponent,
    WeatherDescriptionComponent,
    WeatherItemComponent,
    ForecastDescriptionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialComponentsModule
  ],
  providers: [
    GeolocationService,
    TransportService,
    WeatherService,
    CitiesService,
    ModalService
  ],
  entryComponents: [
    ModalComponent,
    CitySelectorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
