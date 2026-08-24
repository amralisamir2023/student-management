import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()">
      <div class="modal-box" style="max-width:420px" (click)="$event.stopPropagation()">
        <div style="padding:22px 24px;display:flex;gap:15px;align-items:flex-start">
          <div style="width:40px;height:40px;flex:none;border-radius:12px;background:var(--danger-bg);display:flex;align-items:center;justify-content:center;color:var(--danger);font-size:18px">!</div>
          <div>
            <div style="font-size:15.5px;font-weight:800">Delete {{ title }}?</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:6px;line-height:1.6">
              This can't be undone. {{ subtitle }}
            </div>
          </div>
        </div>
        <div style="padding:17px 24px;border-top:1px solid var(--border-soft);display:flex;justify-content:flex-end;gap:10px;background:#fbfbfe;border-radius:0 0 18px 18px">
          <button class="btn btn-outline" (click)="cancel.emit()">Cancel</button>
          <button class="btn btn-danger" (click)="confirm.emit()">Delete</button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  @Input() title = 'this item';
  @Input() subtitle = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
