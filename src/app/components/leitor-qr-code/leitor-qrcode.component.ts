import { Component, EventEmitter, Output } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-leitor-qrcode',
  template: `
    <zxing-scanner
      [formats]="['QR_CODE']"
      (scanSuccess)="onCodeResult($event)"
      [torch]="true"
      [tryHarder]="true"
    ></zxing-scanner>
  `,
  standalone: true,
  imports: [],
})
export class LeitorQrCodeComponent {
  @Output() qrCodeLido = new EventEmitter<string>();

  onCodeResult(result: string) {
    this.qrCodeLido.emit(result);
  }
}
