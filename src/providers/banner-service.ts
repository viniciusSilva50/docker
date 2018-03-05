import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClientService } from '../providers/http-client-service';

// Models
import { IBanner, IBannerCreateRequest, IBannerUpdateRequest } from '../models/banner-model';

@Injectable()
export class BannerService {

  constructor(private httpClient: HttpClientService) {

  }

  getBanners()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/banner/all').subscribe((data: IBanner[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  getScheduledBanners()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/banner/scheduled').subscribe((data: IBanner[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  getInactivesBanners()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/banner/inactives').subscribe((data: IBanner[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  createBanner(bannerCreateRequest: IBannerCreateRequest)
  {
    return Observable.create(observer => {
      this.httpClient.post('/api/banner', bannerCreateRequest).subscribe((data: IBanner)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  updateBanner(bannerUpdateRequest: IBannerUpdateRequest)
  {
    return Observable.create(observer => {
      this.httpClient.put('/api/banner', bannerUpdateRequest).subscribe((data: IBanner)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

}
