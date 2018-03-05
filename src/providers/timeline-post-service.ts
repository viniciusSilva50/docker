import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClientService } from '../providers/http-client-service';

// Models
import { ITimelinePost, ITimelinePostCreateRequest, ITimelinePostUpdateRequest, IConsultantTimelinePostRequest } from '../models/timeline-post-model';
import { IConsultantDataRequest } from '../models/consultant-model';

@Injectable()
export class TimelinePostService {

  constructor(private httpClient: HttpClientService) {

  }

  getTimelinePosts()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/timelinepost/all').subscribe((data: ITimelinePost[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  getScheduledTimelinePosts()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/timelinepost/scheduled').subscribe((data: ITimelinePost[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  getTimelinePostsByConsultant(consultantDataRequest: IConsultantDataRequest)
  {
    return Observable.create(observer => {
      this.httpClient.post('/api/timelinepost/consultant', consultantDataRequest).subscribe((data: ITimelinePost[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  getInactivesTimelinePosts()
  {
    return Observable.create(observer => {
      this.httpClient.get('/api/timelinepost/inactives').subscribe((data: ITimelinePost[])=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  createTimelinePost(timelinePostCreateRequest: ITimelinePostCreateRequest) {

    // Check if it's an embedded post.
    if (timelinePostCreateRequest.postType === 'EMBEDDED' && timelinePostCreateRequest.embeddedCode) {

      // Extract embedded attributes from iframe code.
      let embeddedPostAttributes = this.getEmbeddedPostAttributes(timelinePostCreateRequest.embeddedCode);
      if (embeddedPostAttributes) {
        timelinePostCreateRequest.embeddedUrl = embeddedPostAttributes.embeddedUrl;
        timelinePostCreateRequest.embeddedPostWidth = embeddedPostAttributes.width;
        timelinePostCreateRequest.embeddedPostHeight = embeddedPostAttributes.height;
      } else {
        timelinePostCreateRequest.embeddedUrl = null;
        timelinePostCreateRequest.embeddedPostWidth = null;
        timelinePostCreateRequest.embeddedPostHeight = null;
      }
    }

    return Observable.create(observer => {
      this.httpClient.post('/api/timelinepost', timelinePostCreateRequest).subscribe((data: string)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  updateTimelinePost(timelinePostUpdateRequest: ITimelinePostUpdateRequest) {

    // Check if it's an embedded post.
    if (timelinePostUpdateRequest.embeddedCode) {
      // Extract embedded attributes from iframe code.
      let embeddedPostAttributes = this.getEmbeddedPostAttributes(timelinePostUpdateRequest.embeddedCode);
      if (embeddedPostAttributes) {
        timelinePostUpdateRequest.embeddedUrl = embeddedPostAttributes.embeddedUrl;
        timelinePostUpdateRequest.embeddedPostWidth = embeddedPostAttributes.width;
        timelinePostUpdateRequest.embeddedPostHeight = embeddedPostAttributes.height;
      } else {
        timelinePostUpdateRequest.embeddedUrl = null;
        timelinePostUpdateRequest.embeddedPostWidth = null;
        timelinePostUpdateRequest.embeddedPostHeight = null;
      }
    }
          
    return Observable.create(observer => {
      this.httpClient.put('/api/timelinepost', timelinePostUpdateRequest).subscribe((data: string)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  favoriteTimelinePost(consultantTimelinePostRequest: IConsultantTimelinePostRequest)
  {
    return Observable.create(observer => {
      this.httpClient.post('/api/timelinepost/favorite', consultantTimelinePostRequest).subscribe((data: string)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  likeTimelinePost(consultantTimelinePostRequest: IConsultantTimelinePostRequest)
  {
    return Observable.create(observer => {
      this.httpClient.post('/api/timelinepost/like', consultantTimelinePostRequest).subscribe((data: string)=>{
        observer.next(data);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
        observer.complete();
      });
    });
  }

  getEmbeddedPostAttributes(embeddedCode: string): { embeddedUrl: string, width?: number, height?: number } {
    console.log('timeline-post-service/getEmbeddedPostAttributes()', 'embeddedCode', embeddedCode);

    let embeddedPostAttributes = {
      embeddedUrl: null,
      width: 0,
      height: 0
    };

    try {

      if (embeddedCode.includes('instagram-media')) {
        // Find src attribute inside iframe.
        let hrefAttributeRegExp = / href="([^"]*)"/;
        let hrefAttributeMatch = hrefAttributeRegExp.exec(embeddedCode);
        console.log('timeline-post-service/getEmbeddedPostAttributes()', 'hrefAttributeMatch', hrefAttributeMatch);

        if (hrefAttributeMatch != null) {
          let hrefAttributeResult = hrefAttributeMatch[1].trim();
          console.log('timeline-post-service/getEmbeddedPostAttributes()', 'hrefAttributeResult', hrefAttributeResult);
          embeddedPostAttributes.embeddedUrl = hrefAttributeResult;
        } else {
          throw new Error('Could not find href attribute inside embedded post');
        }
      } else {
        // Find src attribute inside iframe.
        let srcAttributeRegExp = / src="([^"]*)"/;
        let srcAttributeMatch = srcAttributeRegExp.exec(embeddedCode);
        console.log('timeline-post-service/getEmbeddedPostAttributes()', 'srcAttributeMatch', srcAttributeMatch);

        if (srcAttributeMatch != null) {
          let srcAttributeResult = srcAttributeMatch[1].trim();
          console.log('timeline-post-service/getEmbeddedPostAttributes()', 'srcAttributeResult', srcAttributeResult);
          embeddedPostAttributes.embeddedUrl = srcAttributeResult;
        } else {
          throw new Error('Could not find src attribute inside embedded post');
        }
        
        // Find width attribute inside iframe.
        let widthAttributeRegExp = / width="([^"]*)"/;
        let widthAttributeMatch = widthAttributeRegExp.exec(embeddedCode);
        console.log('timeline-post-service/getEmbeddedPostAttributes()', 'widthAttributeMatch', widthAttributeMatch);

        if (widthAttributeMatch != null) {
          let widthAttributeResult = widthAttributeMatch[1].trim();
          console.log('timeline-post-service/getEmbeddedPostAttributes()', 'widthAttributeResult', widthAttributeResult);
          embeddedPostAttributes.width = +widthAttributeResult;
        } else {
          throw new Error('Could not find width attribute inside embedded post');
        }

        // Find height attribute inside iframe.
        let heightAttributeRegExp = / height="([^"]*)"/;
        let heightAttributeMatch = heightAttributeRegExp.exec(embeddedCode);
        console.log('timeline-post-service/getEmbeddedPostAttributes()', 'heightAttributeMatch', heightAttributeMatch);

        if (heightAttributeMatch != null) {
          let heightAttributeResult = heightAttributeMatch[1].trim();
          console.log('timeline-post-service/getEmbeddedPostAttributes()', 'heightAttributeResult', heightAttributeResult);

          embeddedPostAttributes.height = +heightAttributeResult;

        } else {
          throw new Error('Could not find height attribute inside embedded post');
        }
      }
    } catch (err) {
      console.error('timeline-post-service', 'getEmbeddedPostAttributes()', 'Could not process an embedded post. ' + err + '. embeddedCode: ' + embeddedCode, false);
      embeddedPostAttributes = null;
    }

    console.log('timeline-post-service/getEmbeddedPostAttributes()', 'embeddedPostAttributes', embeddedPostAttributes);
    return embeddedPostAttributes;
  }

}
