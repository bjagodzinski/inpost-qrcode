import { Component } from '@angular/core';
import { QrCodeType } from '../shared/enums/qr-code.type.enum';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Observable, of, takeUntil, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DestroyComponent } from '../shared/components/destroy/destroy-component';
import { ActivatedRoute, Router } from '@angular/router';
import { QrCodeCollectResponse, QrCodeReturnResponse } from '../shared/models/qr-code.response.interface';

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
    if(this.selectedQrOption?.value === QrCodeType.COLLECT) {
      this.mockHttpRequestCollect()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.handleQrCodeGeneratedCollect(result);
          },
          error: (error) => {
            this.loading = false;
            this.qrCodeValidityError = error.msg;
          }
        });
    } else {
      this.mockHttpRequestReturn()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.handleQrCodeGeneratedReturn(result);
          },
          error: (error) => {
            this.loading = false;
            this.qrCodeValidityError = error.msg;
          }
        });
    }
  }

  // ------ for test purpose only

  handleQrCodeGeneratedCollect(result: QrCodeCollectResponse) {
    this.loading = false;
    this.value = result.qrCode;
    const state = {
      multicompartment: result.multicompartment,
      expirationDate: result.expirationDate,
      qrCode: result.qrCode
    }
    this.router.navigate(['./collect'], { relativeTo: this.route, state });
  }

  handleQrCodeGeneratedReturn(result: QrCodeReturnResponse) {
    this.loading = false;
    this.value = result.qrCode;
    const state = {
      size: result.size,
      expirationDate: result.expirationDate,
      qrCode: result.qrCode
    }
    this.router.navigate(['./return'], { relativeTo: this.route, state });
  }

  mockHttpRequestCollect(): Observable<QrCodeCollectResponse> {
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

  mockHttpRequestReturn(): Observable<QrCodeReturnResponse> {
    const randomValue = Math.random();
    if (randomValue >= 0.5) {
      return of({
        qrCode: 'mocked-qrcode',
        expirationDate: '2023-08-31 11:39',
        size: '2A'
      }).pipe(delay(2000));
    } else {
      return throwError({
        key: 'not-found',
        msg: 'Błędny kod odbioru',
      }).pipe(delay(2000));
    }
  }

}
