import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly stats = [
    { value: '2018', label: 'Founded' },
    { value: '120+', label: 'Timeless pieces' },
    { value: '40k', label: 'Happy customers' },
    { value: '100%', label: 'Natural fibres' },
  ];

  protected readonly values = [
    {
      title: 'Honest fabrics',
      text: 'Cotton, linen and wool sourced from mills we know by name — chosen to soften with every wear.',
      icon: 'M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z',
    },
    {
      title: 'Timeless cuts',
      text: 'We design outside the trend cycle, so every piece still feels right five seasons from now.',
      icon: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    },
    {
      title: 'Made responsibly',
      text: 'Small batches, fair wages and packaging that is fully recyclable — no exceptions.',
      icon: 'M5 13l4 4L19 7',
    },
  ];
}
