import {Injectable} from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { CryptoService } from '../providers/crypto-service';

@Injectable()
export class ContextService {

    public static SystemSettingsKeys: {
        WebBaseAddress: string,
        MaxCampaignFormItems: string,
        MaxFormOptionAnswers: string,
        MediaDonationPorcentage: string,
        MediaViewAmount: string,
        MarketingFeePerView: string
    } = {
        WebBaseAddress: 'WEB_BASE_ADDRESS',
        MaxCampaignFormItems: 'MAX_CAMPAIGN_FORM_ITEMS',
        MaxFormOptionAnswers: 'MAX_FORM_OPTION_ANSWERS',
        MediaDonationPorcentage: 'MEDIA_DONATION_PERCENTAGE',
        MediaViewAmount: 'MEDIA_VIEW_AMOUNT',
        MarketingFeePerView: 'MARKETING_FEE_PER_VIEW'
    };

    public static UserToken: string = "user_token";
    public static ServerUrl: string = "server_url";
    public static Sitemap: string = "sitemap";

    constructor(private localStorageService: LocalStorageService, private cryptoService: CryptoService) {
        this.createDefaultKeys();
    }

    private createDefaultKeys()
    {
        // this.localStorageService.set(ContextService.ServerUrl, this.cryptoService.encryptMessage('http://localhost:50698'));
        // this.localStorageService.set(ContextService.ServerUrl, this.cryptoService.encryptMessage('http://54.94.213.150:81'));
        this.localStorageService.set(ContextService.ServerUrl, this.cryptoService.encryptMessage('http://apimarykay.digitale.com.br'));
    }

    public get(key: string) : any {
        let encryptedValue: any = this.localStorageService.get(key);
        let value: string = this.cryptoService.decryptMessage(encryptedValue);
        return value;
    }

    public set(key: string, value: any) : boolean {
        let encryptedValue = this.cryptoService.encryptMessage(value);
        return this.localStorageService.set(key, encryptedValue);
    }

    public remove(key: string)
    {
        this.localStorageService.remove(key);
    }

    public getHttpContext()
    {
        var httpContext =
        {
            serverUrl: null,
            userToken: null
        };

        return Observable.create(observer => {

            httpContext.serverUrl = this.get(ContextService.ServerUrl);
            httpContext.userToken = this.get(ContextService.UserToken);

            observer.next(httpContext);
            observer.complete();
        });
    }
}
