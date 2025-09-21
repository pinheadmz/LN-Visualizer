import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PilotFlags } from '../reducer';

@Injectable({
    providedIn: 'root',
})
export class PilotFlagApiService {
    constructor(private http: HttpClient) {}

    public getApiConfig(): Observable<PilotFlags> {
        const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
        return this.http.get<PilotFlags>(`${baseHref}assets/pilots.json`);
    }
}
