import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail({},{message:"provide valid email address"})
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
};