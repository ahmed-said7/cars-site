import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsEnum, IsMobilePhone, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { tradingType } from "./trader.dto";
import { mongodbId } from "src/chat/chat.service";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(4)
    name: string;
    @IsOptional()
    @IsEmail({},{message:"provide valid email address"})
    email: string;
    @IsOptional()
    @IsString()
    image: string;
    @IsOptional()
    @IsEnum(tradingType)
    tradingType: string;
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({each:true})
    tradingBrand:mongodbId[];
    @IsOptional()
    @IsBoolean()
    active:boolean;
    @IsOptional()
    @IsMobilePhone("ar-SA")
    mobile:string;
};

