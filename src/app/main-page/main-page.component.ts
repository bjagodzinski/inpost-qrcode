import { Component } from '@angular/core';
import { QrCodeType } from '../shared/enums/qr-code.type.enum';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Observable, of, takeUntil, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DestroyComponent } from '../shared/components/destroy/destroy-component';
import { ActivatedRoute, Router } from '@angular/router';
import { QrCodeResponse } from '../shared/models/qr-code.response.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent extends DestroyComponent {

  qrOptions: QrCodeType[];
  form: FormGroup;
  elementType: NgxQrcodeElementTypes;
  level: NgxQrcodeErrorCorrectionLevels;

  value = 'www.inpost.pl';
  qrCodeValidityError: string;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.qrOptions = [QrCodeType.COLLECT, QrCodeType.RETURN];
    this.form = this.formBuilder.group({
      qrCodeValue: [null, [Validators.required]],
      selectedQrOption: [QrCodeType.COLLECT, [Validators.required]],
    });
    this.elementType = NgxQrcodeElementTypes.URL;
    this.level = NgxQrcodeErrorCorrectionLevels.LOW;
  }

  get qrCodeValue(): AbstractControl | null {
    return this.form.get('qrCodeValue');
  }
  get selectedQrOption(): AbstractControl | null {
    return this.form.get('selectedQrOption');
  }

  onGenerateQrCode() {
    this.loading = true;
    this.qrCodeValidityError = '';
    this.mockHttpRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.handleQrCodeGenerated(result);
        },
        error: (error) => {
          this.loading = false;
          this.qrCodeValidityError = error.msg;
        }
      });
  }

  handleQrCodeGenerated(result: QrCodeResponse) {
    this.loading = false;
    this.value = result.qrCode;
    let url = '';
    let state = {};
    switch (this.selectedQrOption?.value) {
      case QrCodeType.COLLECT:
        url = './collect';
        state = {
          multicompartment: result.multicompartment,
          expirationDate: result.expirationDate,
          qrCode: result.qrCode
        };
        break;
      case QrCodeType.RETURN:
        url = './return';
        state = {
          qrCode: result.qrCode
        };
        break;
    }
    this.router.navigate([url], { relativeTo: this.route, state });
  }

// just to mock the request
  mockHttpRequest(): Observable<QrCodeResponse> {
    const randomValue = Math.random();
    if (randomValue >= 0.5) {
      return of({
        qrCode: 'mocked-qrcode',
        expirationDate: '2023-08-31 11:39',
        multicompartment: true,
      }).pipe(delay(2000));
    } else {
      return throwError({
        key: 'not-found',
        msg: 'Błędny kod odbioru',
      }).pipe(delay(2000));
    }
  }

}
