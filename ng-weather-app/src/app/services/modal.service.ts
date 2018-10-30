import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private result: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private component: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  public visibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  getResult(): Observable<any> {
    return this.result.asObservable();
  }

  getVisibility(): Observable<boolean> {
    return this.visibility.asObservable();
  }

  getComponent(): Observable<any> {
    return this.component.asObservable();
  }

  setResult(result: any): void {
    this.result.next(result);
  }

  showModal(component): void {
    this.visibility.next(true);
    this.component.next(component);
  }

  hideModal(): void {
    this.visibility.next(false);
    this.component.next(undefined);
  }
}
