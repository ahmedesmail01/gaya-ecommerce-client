import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly menuItems = [
    {
      label: 'My orders',
      icon: 'M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0',
    },
    {
      label: 'Wishlist',
      icon: 'M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z',
    },
    {
      label: 'Account settings',
      icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
    },
  ];
}
