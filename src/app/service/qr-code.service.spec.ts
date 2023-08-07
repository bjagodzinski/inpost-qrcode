import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QrCodeService } from './qr-code.service';
import { QrCodeCollectResponse, QrCodeReturnResponse } from '../shared/models/qr-code.response.interface';
import { HttpErrorResponse } from '@angular/common/http';

describe('QrCodeService', () => {
  let service: QrCodeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QrCodeService]
    });

    service = TestBed.inject(QrCodeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to generate QR code', () => {
    const mockResponse: QrCodeCollectResponse = {
      qrCode: 'mocked-qrcode',
      expirationDate: '2023-08-31 11:39',
      multicompartment: true,
    };
    const mockCode = 'test-code';

    service.generateQrCodeForCollect(mockCode).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/collect`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ code: mockCode });

    req.flush(mockResponse);
  });

  it('should send a POST request to generate QR code for return', () => {
    const mockResponse: QrCodeReturnResponse = {
      qrCode: 'mocked-qrcode',
      expirationDate: '2023-08-31 11:39',
      size: '2A'
    };
    const mockCode = 'test-code';

    service.generateQrCodeForReturn(mockCode).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/return`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ code: mockCode });

    req.flush(mockResponse);
  });

  it('should handle HTTP error and return an error observable for collect', () => {
    const mockCode = 'test-code';

    service.generateQrCodeForCollect(mockCode).subscribe(
      () => fail('Expected an error, but got a response'),
      (error) => {
        expect(error).toBeTruthy();
        console.error(error);
        expect(error instanceof HttpErrorResponse).toBeTruthy();
        expect(error.message).toContain('Http failure response for /api/collect: 500 Server Error');
      }
    );

    const req = httpTestingController.expectOne(`${service['apiUrl']}/collect`);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

});
