import { IsMongoId, IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export class QueryReviewDto {
    
    
    
    @IsOptional()
    page?:string;
    
    @IsOptional()
    sort?:string;
    
    @IsOptional()
    select?:string;
    
    @IsOptional()
    limit?:string;

};