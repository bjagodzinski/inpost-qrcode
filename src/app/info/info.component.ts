import { Component, Input } from '@angular/core';
import { QrCodeType } from '../shared/enums/qr-code.type.enum';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent {

  @Input('qrOption')
  qrOption: QrCodeType;

  constructor() {

  }
}
