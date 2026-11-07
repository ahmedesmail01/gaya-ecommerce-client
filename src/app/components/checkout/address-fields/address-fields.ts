import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormField, type FieldTree } from '@angular/forms/signals';
import type { Address } from '../../../common/checkout-form';
import { COUNTRIES, findCountry } from '../../../common/country';
import { FieldErrors } from '../../field-errors/field-errors';

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

  protected readonly countries = COUNTRIES;

  protected readonly postalExample = computed(
    () => findCountry(this.address().country().value())?.postalExample,
  );
}
