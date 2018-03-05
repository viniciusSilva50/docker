import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClientService } from '../providers/http-client-service';

// Models
import { IUser, IUserUpdateRequest } from '../models/user-model';

@Injectable()
export class SystemUserService {

  constructor(private httpClient: HttpClientService) {

  }

  getUser(id: string)
  {
    return Observable.create(observer => {
      this.httpClient.get(`/api/systemuser/${id}`).subscribe((data: IUser)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  updateUser(userUpdateRequest: IUserUpdateRequest)
  {
    return Observable.create(observer => {
      this.httpClient.put('/api/systemuser', userUpdateRequest).subscribe((data: IUser)=>{
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
