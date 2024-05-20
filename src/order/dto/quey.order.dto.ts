import { IsMongoId, IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export class QueryOrderDto {
    @IsOptional()
    @IsMongoId()
    offer:mongodbId;
    @IsOptional()
    @IsMongoId()
    request:mongodbId;
    @IsOptional()
    @IsMongoId()
    user:mongodbId;
    @IsOptional()
    @IsMongoId()
    trader:mongodbId;
    @IsOptional()
    price:string | ComparisonOptions;
    @IsOptional()
    delivered:boolean;
    @IsOptional()
    deliveredAt:Date | ComparisonOptions;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
};