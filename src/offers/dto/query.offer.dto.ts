import { IsMongoId, IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export class QueryOfferDto {
    @IsOptional()
    request?: string;
    @IsOptional()
    price?:string|ComparisonOptions;
    @IsOptional()
    status?:string;
    @IsOptional()
    trader?:string;
    @IsOptional()
    userAccepted?:boolean;
    @IsOptional()
    userRejected?:boolean;
    @IsOptional()
    traderAccepted?:boolean;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
    @IsOptional()
    guarantee?:string;
    @IsOptional()
    color?:string;
    @IsOptional()
    isPaid?: boolean;
};

