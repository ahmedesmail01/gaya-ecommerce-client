import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly perks = [
    'Free shipping over $100',
    'Easy 30-day returns',
    'Thoughtfully made',
  ];
}
