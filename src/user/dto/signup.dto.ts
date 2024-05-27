import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { userType } from "src/enums/user.type";
import { tradingType } from "./trader.dto";


// enum userAdminEnum {
//     user="user",
//     admin="admin"
// };

// export class SignupUserAdminDto {
//     @IsNotEmpty()
//     @IsString()
//     @MinLength(4)
//     name: string;
//     @IsOptional()
//     @IsEnum(userAdminEnum)
//     role:string;
//     @IsNotEmpty()
//     @IsEmail({},{message:"provide valid email address"})
//     email: string;
//     @IsNotEmpty()
//     @IsString()
//     @MinLength(6)
//     password: string;
//     @IsNotEmpty()
//     @IsString()
//     @MinLength(6)
//     passwordConfirm: string;
// };


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;
    @IsOptional()
    @IsEnum(userType)
    role:string;
    @IsNotEmpty()
    @IsEmail({},{message:"provide valid email address"})
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    passwordConfirm: string;
    @IsOptional()
    @IsEnum(tradingType)
    tradingType: string;
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({each:true})
    tradingBrand:mongodbId[];
};