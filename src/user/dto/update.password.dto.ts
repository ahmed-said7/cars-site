import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    passwordConfirm: string;
    @IsNotEmpty()
    @IsString()
    currentPassword: string;
};