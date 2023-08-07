import { Component } from '@angular/core';
import { QrCodeType } from '../shared/enums/qr-code.type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return-option',
  templateUrl: './return-option.component.html',
  styleUrls: ['./return-option.component.less']
})
export class ReturnOptionComponent {

  qrOption: QrCodeType = QrCodeType.RETURN;

  qrCode: string;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.qrCode = state['qrCode'];
    }
  }
}
