import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserAdminDto {
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