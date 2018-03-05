export class ITimelinePost
{
	timelinePostId: number;
	title: string;
	subTitle: string;
	body: string;
	postType: string;
	imageUrl: string;
	imageNaturalWidth?: number;
	imageNaturalHeight?: number;
	videoUrl: string;
	embeddedCode: string;
	embeddedUrl: string;
	embeddedPostWidth: number;
	embeddedPostHeight: number;
	shareableUrl: string;
	consultantLevelFilter: number;
	consultantStatusFilter: string;
	actionUrl: string;
	isExternalUrl: boolean;
	likeCount: number;
	favoriteCount: number;
	createDate: Date;
	startPublishDate: Date;
	endPublishDate: Date;
	isActive: boolean;
	// Internal property
	isScheduled: boolean;	
}

export class ITimelinePostCreateRequest
{
	title: string;
	subTitle: string;
	body: string;
	postType: string;
	imageUrl: string;
	imageNaturalWidth?: number;
	imageNaturalHeight?: number;
	videoUrl: string;
	embeddedCode: string;
	embeddedUrl: string;
	embeddedPostWidth?: number;
	embeddedPostHeight?: number;
	shareableUrl: string;
	consultantLevelFilter: number;
	consultantStatusFilter: string;
	actionUrl: string;
	isExternalUrl: boolean;
	startPublishDate: Date;
	endPublishDate: Date;
}

export class ITimelinePostUpdateRequest
{
	timelinePostId: number;
	title: string;
	subTitle: string;
	body: string;
	imageUrl: string;
	consultantLevelFilter: number;
	consultantStatusFilter: string;
	embeddedCode: string;
	embeddedUrl: string;
	embeddedPostWidth?: number;
	embeddedPostHeight?: number;
	actionUrl: string;
	shareableUrl: string;
	isExternalUrl: boolean;
	startPublishDate: Date;
	endPublishDate: Date;
	isActive: boolean;
}

export class IConsultantTimelinePostRequest
{
	timelinePostId: number;
	userCode: string;
}