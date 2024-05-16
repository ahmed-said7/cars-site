import { IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class QueryCarModelDto {
    @IsOptional()
    name?: string;
    @IsOptional()
    brand?: mongodbId;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
    @IsOptional()
    keyword?:string;
};