import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClientService } from '../providers/http-client-service';

// Models
import { IAmazonUploadResponse } from '../models/fileupload-model'

@Injectable()
export class FileUploadService {

  constructor(private httpClient: HttpClientService) {
  }

  uploadAppBanner(file: File)
  {
    return Observable.create(observer => {
      this.httpClient.postFile('/api/fileupload/amazon/appbanner', file).subscribe((data: IAmazonUploadResponse)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  uploadAppLandingImage(file: File)
  {
    return Observable.create(observer => {
      this.httpClient.postFile('/api/fileupload/amazon/landingimage', file).subscribe((data: IAmazonUploadResponse)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  uploadAppTimelinePost(file: File)
  {
    return Observable.create(observer => {
      this.httpClient.postFile('/api/fileupload/amazon/timelinepostimage', file).subscribe((data: IAmazonUploadResponse)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  uploadVideo(file: File)
  {
    return Observable.create(observer => {
      this.httpClient.postFile('/api/fileupload/amazon/timelinepostvideo', file).subscribe((data: IAmazonUploadResponse)=>{
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
