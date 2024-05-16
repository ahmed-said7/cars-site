import { IsMongoId, IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export class QueryReviewDto {
    
    @IsOptional()
    rating?: string | ComparisonOptions;
    
    @IsOptional()
    @IsMongoId()
    user?: mongodbId;
    
    @IsOptional()
    @IsMongoId()
    review?: mongodbId;
    
    @IsOptional()
    page?:string;
    
    @IsOptional()
    sort?:string;
    
    @IsOptional()
    select?:string;
    
    @IsOptional()
    limit?:string;

};