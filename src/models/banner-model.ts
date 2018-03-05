export class IBanner
{
    bannerId: number;
    defaultFullImageUrl: string;
    defaultHalfImageUrl: string;
    default2xFullImageUrl: string;
    default2xHalfImageUrl: string;
    default568h2xFullImageUrl: string;
    default568h2xHalfImageUrl: string;
    default667h2xFullImageUrl: string;
    default667h2xHalfImageUrl: string;
    default3xFullImageUrl: string;
    default3xHalfImageUrl: string;
    webAppFullImageUrl: string;
    webAppHalfImageUrl: string;
    actionUrl: string;
    title: string;
    text: string;
    type: string;
    startPublishDate: Date;
    endPublishDate: Date;
    isActive: boolean;
    isScheduled: boolean;
}

export class IBannerCreateRequest
{
    webAppFullImageUrl: string;
    webAppHalfImageUrl: string;
    actionUrl: string;
    title: string;
    text: string;
    type: string;
    startPublishDate: Date;
    endPublishDate: Date;
}
export class IBannerUpdateRequest
{
    bannerId: number;
    actionUrl: string;
    title: string;
    text: string;
    isActive: boolean;
    startPublishDate: Date;
    endPublishDate: Date;
}
