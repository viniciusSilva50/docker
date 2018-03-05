import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClientService } from '../providers/http-client-service';

// Models
import { ILandingImage, ILandingImageCreateRequest } from '../models/landing-image-model';

@Injectable()
export class LandingImageService {

  constructor(private httpClient: HttpClientService) {

  }

  getLandingImages()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/landingimage/all').subscribe((data: ILandingImage[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  createLandingImage(landingImageCreateRequest: ILandingImageCreateRequest)
  {
    return Observable.create(observer => {
      this.httpClient.post('/api/landingimage', landingImageCreateRequest).subscribe((data: ILandingImage)=>{
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
