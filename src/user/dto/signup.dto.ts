import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


enum userAdminEnum {
    user="user",
    admin="admin"
};

export class SignupUserAdminDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;
    @IsOptional()
    @IsEnum(userAdminEnum)
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
};