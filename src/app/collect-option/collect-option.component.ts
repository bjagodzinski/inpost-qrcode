import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QrCodeType } from '../shared/enums/qr-code.type.enum';

@Component({
  selector: 'app-collect-option',
  templateUrl: './collect-option.component.html',
  styleUrls: ['./collect-option.component.less']
})
export class CollectOptionComponent {

  qrOption: QrCodeType = QrCodeType.COLLECT;

  multicompartment: boolean = false;
  qrCode: string;
  expirationDate: string;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.multicompartment = state['multicompartment'];
      this.expirationDate = state['expirationDate'];
      this.qrCode = state['qrCode'];
    }
  }

}
