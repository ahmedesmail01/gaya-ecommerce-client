import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ReadonlyFieldState } from '@angular/forms/signals';

/** Shows a field's first error once the user has touched it (or tried to submit). */
@Component({
  selector: 'app-field-errors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message(); as text) {
      <p [id]="id()" class="mt-1.5 text-xs text-red-700" role="alert">{{ text }}</p>
    }
  `,
})
export class FieldErrors {
  readonly state = input.required<ReadonlyFieldState<unknown>>();
  /** Referenced by the input's aria-describedby. */
  readonly id = input.required<string>();

  protected readonly message = computed(() => {
    const field = this.state();
    if (!field.touched() || field.valid()) return null;
    return field.errors()[0]?.message ?? 'This field is invalid';
  });
}
