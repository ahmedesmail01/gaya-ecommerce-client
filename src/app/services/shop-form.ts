import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}

@Service()
export class ShopForm {
  private readonly http = inject(HttpClient);
  private readonly countriesUrl = 'http://localhost:8081/api/countries';
  private readonly statesUrl = 'http://localhost:8081/api/states';

  getCountries(): Observable<Country[]> {
    return this.http
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.http
      .get<GetResponseStates>(`${this.statesUrl}/search/findByCountryCode`, {
        params: { code: countryCode },
      })
      .pipe(map((response) => response._embedded.states));
  }
}
