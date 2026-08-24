import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-wrap">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class.toast-success]="t.kind === 'success'" [class.toast-error]="t.kind === 'error'">
          <span>{{ t.kind === 'success' ? '✓' : '⚠' }}</span>
          <span style="flex:1">{{ t.message }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  toast = inject(ToastService);
}
