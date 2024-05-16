import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class CreateUserCarsDto {
    @IsNotEmpty()
    @IsMongoId()
    brand:mongodbId;
    @IsOptional()
    @IsMongoId()
    user:mongodbId;
    @IsNotEmpty()
    @IsMongoId()
    carmodel:mongodbId;
    @IsOptional()
    @IsString()
    image:string;
    @IsNotEmpty()
    @IsNumber()
    @Min(1990)
    @Max(new Date().getFullYear())
    year:number;
};