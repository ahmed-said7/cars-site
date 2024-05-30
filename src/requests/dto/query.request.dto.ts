import { IsMongoId,  IsOptional } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";

export enum requestType {
    used="used",
    new="new",
    both="both"
};

export class QueryRequestDto {
    @IsOptional()
    @IsMongoId()
    carmodel : mongodbId;
    @IsOptional()
    @IsMongoId()
    brand: mongodbId;
    @IsOptional()
    @IsMongoId()
    user: mongodbId;
    @IsOptional()
    year : string | ComparisonOptions;
    @IsOptional()
    status:string;
    @IsOptional()
    details:string;
    @IsOptional()
    name:string;
    @IsOptional()
    completed:boolean;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
    @IsOptional()
    quantity:string;
};