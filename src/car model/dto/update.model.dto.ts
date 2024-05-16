import {  IsMongoId, IsOptional, IsString } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class UpdateCarModelDto {
    @IsOptional()
    @IsString()
    name: string;
    @IsOptional()
    @IsMongoId()
    brand: mongodbId;
};