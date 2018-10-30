import { Injectable } from '@angular/core';
import { ICoordinates } from '../interfaces/coordinates.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentCoordinates: BehaviorSubject<ICoordinates>;

  constructor() {
    const savedCoordinates = this.getFromLocalStorage();
    this.currentCoordinates = new BehaviorSubject<ICoordinates>(savedCoordinates);
  }

  public getCurrentCoordinates(): Observable<ICoordinates> {
    return this.currentCoordinates.asObservable();
  }

  public fetchCurrentCoordinates(): void {
    const savedCoordinates = this.getFromLocalStorage();
    this.currentCoordinates.next(savedCoordinates);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lon: longitude };
        this.currentCoordinates.next(<ICoordinates> coords);
        this.saveToLocalStorage(<ICoordinates> coords);
      }, (e) => { console.log(e); });
    }
  }

  private saveToLocalStorage(coords: ICoordinates): void {
    localStorage.setItem('local saved coordrinates', JSON.stringify(coords));
  }

  private getFromLocalStorage(): ICoordinates {
    const data = localStorage.getItem('local saved coordrinates');
    return data ? <ICoordinates> JSON.parse(data) : undefined;
  }
}

