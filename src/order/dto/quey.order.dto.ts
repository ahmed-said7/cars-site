import { IsMongoId, IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export class QueryOrderDto {
    @IsOptional()
    name: string;
    @IsOptional()
    @IsMongoId()
    carmodel:mongodbId;
    @IsOptional()
    @IsMongoId()
    brand:mongodbId;
    @IsOptional()
    @IsMongoId()
    user:mongodbId;
    @IsOptional()
    @IsMongoId()
    trader:mongodbId;
    @IsOptional()
    year:string | ComparisonOptions;
    @IsOptional()
    status:string;
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