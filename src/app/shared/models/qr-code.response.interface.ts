interface QrCodeResponse {
  qrCode: string,
  expirationDate: string,
}

export interface QrCodeCollectResponse extends QrCodeResponse {
  multicompartment: boolean
}

export interface QrCodeReturnResponse  extends QrCodeResponse {
  size: string
}
