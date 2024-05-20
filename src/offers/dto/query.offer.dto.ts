import { IsMongoId, IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export class QueryOfferDto {
    @IsOptional()
    @IsMongoId()
    request : mongodbId;
    @IsOptional()
    price:string|ComparisonOptions;
    @IsOptional()
    status:string;
    @IsOptional()
    @IsMongoId()
    trader:mongodbId;
    @IsOptional()
    userAccepted:boolean;
    @IsOptional()
    userRejected:boolean;
    @IsOptional()
    traderAccepted:boolean;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
};