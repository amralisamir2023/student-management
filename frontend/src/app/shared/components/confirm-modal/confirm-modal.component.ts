import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAlertTriangle } from '../../icons';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [LucideAlertTriangle],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  @Input() title = 'this item';
  @Input() subtitle = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
