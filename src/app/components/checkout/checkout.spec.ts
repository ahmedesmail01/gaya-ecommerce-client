import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart';
import { Checkout } from './checkout';

describe('Checkout', () => {
  let fixture: ComponentFixture<Checkout>;
  let el: HTMLElement;

  const query = <T extends HTMLElement>(selector: string) =>
    el.querySelector<T>(selector)!;

  function type(selector: string, value: string) {
    const input = query<HTMLInputElement | HTMLSelectElement>(selector);
    input.value = value;
    // a real browser fires both when a user picks or types a value
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
  }

  async function submit() {
    query<HTMLButtonElement>('button[type="submit"]').click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [provideRouter([])],
    }).compileComponents();

    TestBed.inject(CartService).addToCart(new CartItem(1, 'Linen shirt', 'shirt.jpg', 40));

    fixture = TestBed.createComponent(Checkout);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows the cart in the order summary', () => {
    expect(el.textContent).toContain('Linen shirt');
  });

  it('shows errors and focuses the first invalid field on an empty submit', async () => {
    await submit();

    expect(el.textContent).toContain('First name is required');
    expect(el.textContent).toContain('Street address is required');
    expect(document.activeElement?.id).toBe('first-name');
    expect(el.textContent).not.toContain('Thank you for your order');
  });

  it('places the order when every field is valid', async () => {
    type('#first-name', 'Ahmed');
    type('#last-name', 'Esmail');
    type('#email', 'ahmed@example.com');
    type('#shipping-country', 'EG');
    type('#shipping-street', '12 Nile St');
    type('#shipping-city', 'Cairo');
    type('#shipping-state', 'Cairo');
    type('#shipping-zip', '11511');
    await fixture.whenStable();

    await submit();

    expect(el.textContent).toContain('Thank you for your order');
  });

  it('only shows billing fields when billing differs from shipping', async () => {
    expect(el.querySelector('#billing-street')).toBeNull();

    query<HTMLInputElement>('input[type="checkbox"]').click();
    await fixture.whenStable();

    expect(el.querySelector('#billing-street')).not.toBeNull();
  });
});
