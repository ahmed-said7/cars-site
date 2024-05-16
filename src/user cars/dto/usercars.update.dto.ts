import { IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class UpdateUserCarsDto {
    @IsOptional()
    @IsMongoId()
    brand:mongodbId;
    @IsOptional()
    @IsMongoId()
    carmodel:mongodbId;
    @IsOptional()
    @IsString()
    image:string;
    @IsOptional()
    @IsNumber()
    @Min(1990)
    @Max(new Date().getFullYear())
    year:number;
};