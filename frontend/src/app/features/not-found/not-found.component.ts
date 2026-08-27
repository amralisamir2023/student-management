import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideInbox } from '../../shared/icons';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LucideInbox],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {}
