import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export enum requestType {
    used="used",
    new="new",
    both="both"
};

export class CreateRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    carmodel : mongodbId;
    @IsNotEmpty()
    @IsMongoId()
    brand: mongodbId;
    @IsOptional()
    @IsMongoId()
    user: mongodbId;
    @IsOptional()
    @IsNumber()
    @Min(1990)
    @Max(new Date().getFullYear())
    year:number;
    @IsOptional()
    @IsString()
    image:string;
    @IsNotEmpty()
    @IsEnum(requestType)
    status:string;
    @IsOptional()
    @IsString()
    details:string;
    @IsNotEmpty()
    @IsString()
    name:string;
};