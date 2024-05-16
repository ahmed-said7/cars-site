import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { spareType } from "./update.spare.dto";

export class CreateSpareDto {
    @IsNotEmpty()
    @IsMongoId()
    carmodel:mongodbId;
    @IsNotEmpty()
    @IsMongoId()
    brand:mongodbId;
    @IsNotEmpty()
    @IsNumber()
    @Min(1990)
    @Max( new Date() .getFullYear() )
    from:number;
    @IsNotEmpty()
    @IsNumber()
    @Min(1990)
    @Max( new Date() .getFullYear() )
    to:number;
    @IsNotEmpty()
    @IsNumber()
    price:number;
    @IsNotEmpty()
    @IsString()
    name:string;
    @IsOptional()
    @IsString()
    image:number;
    @IsNotEmpty()
    @IsEnum(spareType)
    status:string;
};