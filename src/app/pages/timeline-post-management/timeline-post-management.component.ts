import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';

// Models
import { ITimelinePost, ITimelinePostUpdateRequest} from '../../../models/timeline-post-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { TimelinePostService } from '../../../providers/timeline-post-service';
import { UtilsService } from '../../../providers/utils-service';

@Component({
  selector: 'app-timeline-post-management',
  templateUrl: './timeline-post-management.component.html',
  styleUrls: ['./timeline-post-management.component.css'],
  providers: [ TimelinePostService, ConfirmationService]
})
export class TimelinePostManagementComponent implements OnInit {
  
  timelinePosts: ITimelinePost[] = null;
  isShowingInactives: boolean = false;

  constructor(
    private router: Router,
    private messageService: ApplicationMessageService,
    private loadingService: ApplicationLoadingService,
    private timelinePostService: TimelinePostService,
    private confirmationService: ConfirmationService,
    private utilsService: UtilsService
  ) {
    this.getActiveTimelinePosts().subscribe(() => {
      console.log('timeline-post-management/constructor()/getActiveTimelinePosts()', 'ok');
    });
  }

  getActiveTimelinePosts(): Observable<void> {
    console.log('timeline-post-management/getActiveTimelinePosts()', 'ok');

    return Observable.create(observer => {

      this.loadingService.showLoading();
      let result: ITimelinePost[] = null;

      // Get active timelineposts.
      this.timelinePostService.getTimelinePosts().subscribe((timelinePosts: ITimelinePost[]) => {
        console.log('timeline-post-management/getActiveTimelinePosts()/getTimelinePosts()', 'timelinePosts', timelinePosts);

        result = timelinePosts;

        // Get scheduled timeline posts.
        this.timelinePostService.getScheduledTimelinePosts().subscribe((scheduledTimelinePosts: ITimelinePost[]) => {
          console.log('timeline-post-management/getActiveTimelinePosts()/getTimelinePosts()', 'scheduledTimelinePosts', scheduledTimelinePosts);

          scheduledTimelinePosts.forEach(element => {
            element.isScheduled = true;
            result.push(element);
          });

          // Set and sort timeline posts.
          this.updateAndSortTimelinePostList(result);
          observer.next();
          observer.complete();
        },
        error => {
          this.messageService.showErrorMessage('Server error', 'There was an error trying to get the scheduled timelinePosts');
          observer.error();
          observer.complete();
        });
      },
      error => {
        this.messageService.showErrorMessage('Server error', 'There was an error trying to get the timelinePosts');
        observer.error();
        observer.complete();
      },
      () => {
        this.loadingService.hideLoading();
      });
    });
  }

  getInactiveTimelinePosts(): Observable<void> {
    console.log('timeline-post-management/getInactiveTimelinePosts()', 'ok');

    return Observable.create(observer => {

      this.loadingService.showLoading();

      // Get inactive timelineposts.
      this.timelinePostService.getInactivesTimelinePosts().subscribe((inactiveTimelinePosts: ITimelinePost[]) => {
        console.log('timeline-post-management/getInactiveTimelinePosts()/getInactivesTimelinePosts()', 'inactiveTimelinePosts', inactiveTimelinePosts);

        // Set and sort timeline posts.
        this.updateAndSortTimelinePostList(inactiveTimelinePosts);
        observer.next();
        observer.complete();
      },
      error => {
        this.messageService.showErrorMessage('Server error', 'There was an error trying to get the inactive timelinePosts');
        observer.error();
        observer.complete();
      },
      () => {
        this.loadingService.hideLoading();
      });
    });
  }

  toogleTimelinePostTable() {
    console.log('timeline-post-management/toogleTimelinePostTable()', 'ok');
    this.isShowingInactives = !this.isShowingInactives;

    if(this.isShowingInactives)
    {
      this.getInactiveTimelinePosts().subscribe(() => {
        console.log('timeline-post-management/toggleTimelinePostTable()/getInactiveTimelinePosts()', 'ok');
      });
    }
    else
    {
      this.getActiveTimelinePosts().subscribe(() => {
        console.log('timeline-post-management/toggleTimelinePostTable()/getActiveTimelinePosts()', 'ok');
      });
    }
  }

  updateAndSortTimelinePostList(timelinePosts: ITimelinePost[]) {
    console.log('home/updateAndSortTimelinePostList()', 'will sort timelinePosts...', timelinePosts);

    // Filter list by start publish date in descending order.
    timelinePosts = timelinePosts.sort((a,b) : number => {
      if (a.startPublishDate > b.startPublishDate) return -1
      if (a.startPublishDate < b.startPublishDate) return 1
      // return 0
    });
    this.timelinePosts = timelinePosts;
    console.log('timeline-post-management/updateAndSortTimelinePostList()', 'timelinePosts', this.timelinePosts);
  }

  createTimelinePost(){
    this.router.navigate(['createTimelinePost']);
  }

  editTimelinePost(selectedTimelinePost: ITimelinePost){
    this.utilsService.setRoutingData('timelinePost', selectedTimelinePost);
    this.router.navigate(['/editTimelinePost']);
  }

  finishTimelinePost(timelinePost: ITimelinePost){

    this.confirmationService.confirm({
        header: 'Finilizar post',
        message: 'Você tem certeza que deseja finalizar o post?',
        accept: () => {
          this.deactiveTimelinePost(timelinePost);
        }
    });
  }

  deactiveTimelinePost(timelinePost: ITimelinePost){

    this.loadingService.showLoading();

    let timelinePostUpdateRequest: ITimelinePostUpdateRequest = new ITimelinePostUpdateRequest();
    timelinePostUpdateRequest.timelinePostId = timelinePost.timelinePostId;
    timelinePostUpdateRequest.title = timelinePost.title;
    timelinePostUpdateRequest.subTitle = timelinePost.subTitle;
    timelinePostUpdateRequest.body = timelinePost.body;
    timelinePostUpdateRequest.actionUrl = timelinePost.actionUrl;
    timelinePostUpdateRequest.isExternalUrl = timelinePost.isExternalUrl;
    timelinePostUpdateRequest.embeddedCode = timelinePost.embeddedCode;
    timelinePostUpdateRequest.embeddedUrl = timelinePost.embeddedUrl;
    timelinePostUpdateRequest.embeddedPostWidth = timelinePost.embeddedPostWidth;
    timelinePostUpdateRequest.embeddedPostHeight = timelinePost.embeddedPostHeight;
    timelinePostUpdateRequest.shareableUrl = timelinePost.shareableUrl;
    timelinePostUpdateRequest.consultantLevelFilter = timelinePost.consultantLevelFilter;
    timelinePostUpdateRequest.consultantStatusFilter = timelinePost.consultantStatusFilter;
    timelinePostUpdateRequest.startPublishDate = timelinePost.startPublishDate;
    timelinePostUpdateRequest.endPublishDate = timelinePost.endPublishDate;
    timelinePostUpdateRequest.isActive = false;

    console.log('manage-timelinePost/deactiveTimelinePost() - timelinePostUpdateRequest', timelinePostUpdateRequest);

    this.timelinePostService.updateTimelinePost(timelinePostUpdateRequest).subscribe((response)=>{
      if(this.isShowingInactives)
      {
        this.getInactiveTimelinePosts().subscribe(() => {
          console.log('timeline-post-management/deactiveTimelinePost()/getInactiveTimelinePosts()', 'ok');
        });
      }
      else
      {
        this.getActiveTimelinePosts().subscribe(() => {
          console.log('timeline-post-management/deactiveTimelinePost()/getActiveTimelinePosts()', 'ok');
        });
      }
    },
    error=>{
      this.messageService.showErrorMessage('Houve um erro ao tentar finalizar a campanha', error);
      this.loadingService.hideLoading();
    },
    ()=>{
      this.loadingService.hideLoading();
    });
  }

  ngOnInit() {
  }

}
