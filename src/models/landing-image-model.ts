export class ILandingImage
{
    landingImageId: number;
    imageUrl: string;
    startPublishDate: Date;
    endPublishDate: Date;
    isActive: boolean;
}

export class ILandingImageCreateRequest
{
    imageUrl: string;
    startPublishDate: Date;
    endPublishDate: Date;
}
