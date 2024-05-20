import { IsMongoId, IsOptional, IsNumber,  Max, Min, IsString, IsEnum } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export enum spareType {
    used="used",
    new="new"
};

export class UpdateSpareDto {

    @IsOptional()
    @IsMongoId()
    carmodel:mongodbId;

    @IsOptional()
    @IsMongoId()
    brand:mongodbId;

    @IsOptional()
    @IsNumber()
    @Min(1990)
    @Max( new Date() .getFullYear() )
    from:number;

    @IsOptional()
    @IsNumber()
    @Min(1990)
    @Max( new Date() .getFullYear() )
    to:number;

    @IsOptional()
    @IsNumber()
    price:number;

    @IsOptional()
    @IsString()
    name:string;

    @IsOptional()
    @IsString()
    image:string;

    @IsOptional()
    @IsEnum(spareType)
    status:String;

};

