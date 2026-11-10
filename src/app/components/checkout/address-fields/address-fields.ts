import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, type FieldTree } from '@angular/forms/signals';
import type { Address } from '../../../common/checkout-form';
// import { findCountry } from '../../../common/country';
import { FieldErrors } from '../../field-errors/field-errors';
import { ShopForm } from '../../../services/shop-form';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';

/** Country / street / city / state / postal code, used for shipping and billing. */
@Component({
  selector: 'app-address-fields',
  imports: [FormField, FieldErrors],
  templateUrl: './address-fields.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // custom elements are inline by default; the grid inside needs a full-width block
  host: { class: 'block' },
})
export class AddressFields {
  readonly address = input.required<FieldTree<Address>>();
  /** Keeps element ids unique and drives the browser's autofill section. */
  readonly section = input.required<'shipping' | 'billing'>();

  private readonly shopForm = inject(ShopForm);

  selectedCountryCode = signal('');

  protected readonly countries = toSignal(this.shopForm.getCountries(), { initialValue: [] });
  protected readonly states = toSignal(
    toObservable(this.selectedCountryCode).pipe(
      filter(code => code !== ''),
      switchMap(code => this.shopForm.getStates(code)),
    ),
    {initialValue: []}
  )

  // protected readonly states = toSignal(
  //   this.shopForm.getStates(this.selectedCountryCode()),
  //   { initialValue: [] },
  // );

  // protected readonly country = computed(() =>
  //   findCountry(this.address().country().value()),
  // ); 

  // protected readonly postalExample = computed(
  //   () => findCountry(this.address().country().value())?.postalExample,
  // );
}
