import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var CryptoJS: any;

@Injectable()
export class CryptoService {

  private passKey: string;
  private initVector: string;

  constructor() {

    //PassKey and Initial Vector must be the same
    this.passKey = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");
    this.initVector = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");

  }

  encryptMessage(message: string) : string
  {
    if (message.constructor === [].constructor || message.constructor === {}.constructor)
    {
        message = JSON.stringify(message);
    }

    let encryptedMessage = CryptoJS.AES.encrypt(message, this.passKey, {
        iv: this.initVector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encryptedMessage.toString();
  }

  decryptMessage(encryptedMessage: any)
  {
    if(encryptedMessage == null) return null;

    let message = CryptoJS.AES.decrypt(encryptedMessage, this.passKey, {
        iv: this.initVector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    message = message.toString(CryptoJS.enc.Utf8);

    if (message.startsWith("[") || message.startsWith("{"))
    {
        message = JSON.parse(message);
    }
    return message;
  }

}
