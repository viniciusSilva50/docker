import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClientService } from '../providers/http-client-service';

// Models
import { ISystemSetting } from '../models/system-setting-model';

@Injectable()
export class SystemSettingService {

  constructor(private httpClient: HttpClientService) {

  }

  getSystemSettings()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/systemsetting/all').subscribe((data: ISystemSetting[])=>{
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
