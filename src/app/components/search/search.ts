import {
  Component,
  output,
  signal,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-search',
  styleUrl: './search.css',
  templateUrl: './search.html',
})
export class Search {
  protected readonly query = signal('');
  readonly searchChange = output<string>();

  protected onSubmit(event: Event) {
    event.preventDefault();
    this.searchChange.emit(this.query().trim());
  }

  protected clear() {
    this.query.set('');
    this.searchChange.emit('');
  }
}
