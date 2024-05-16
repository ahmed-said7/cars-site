import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { requestType } from "./create.request.dto";


export class UpdateRequestDto {
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
    @IsNumber()
    @Min(1990)
    @Max(new Date().getFullYear())
    year:number;
    @IsOptional()
    @IsString()
    image:string;
    @IsOptional()
    @IsEnum(requestType)
    status:string;
    @IsOptional()
    @IsString()
    details:string;
    @IsOptional()
    @IsString()
    name:string;
};