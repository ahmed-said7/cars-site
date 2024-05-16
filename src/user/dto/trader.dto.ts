import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";
import { mongodbId } from "src/chat/chat.service";

enum tradingType {
    used="used",
    new="new"
};


export class UpdateTraderDto {
    @IsOptional()
    @IsEnum(tradingType)
    tradingType: string;
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({each:true})
    tradingBrand:mongodbId[];
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
};
export class CreateTraderDto {
    @IsNotEmpty()
    @IsEnum(tradingType)
    tradingType: string;
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({each:true})
    tradingBrand:mongodbId[];
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;
    @IsOptional()
    @IsString()
    role:string;
    @IsNotEmpty()
    @IsEmail({},{message:"provide valid email address"})
    email: string;
    @IsOptional()
    @IsString()
    image: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    passwordConfirm: string;
};



