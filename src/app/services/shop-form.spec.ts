import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ShopForm } from './shop-form';

describe('ShopForm', () => {
  let service: ShopForm;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ShopForm);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('unwraps countries from the HAL response', () => {
    let result: unknown;
    service.getCountries().subscribe((countries) => (result = countries));

    const req = http.expectOne('http://localhost:8081/api/countries');
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { countries: [{ id: 2, code: 'CA', name: 'Canada' }] } });

    expect(result).toEqual([{ id: 2, code: 'CA', name: 'Canada' }]);
  });

  it('looks up states by country code', () => {
    let result: unknown;
    service.getStates('CA').subscribe((states) => (result = states));

    const req = http.expectOne(
      (r) => r.url === 'http://localhost:8081/api/states/search/findByCountryCode',
    );
    expect(req.request.params.get('code')).toBe('CA');
    req.flush({ _embedded: { states: [{ id: 28, name: 'Alberta' }] } });

    expect(result).toEqual([{ id: 28, name: 'Alberta' }]);
  });
});
