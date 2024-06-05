import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateContactDto {
    @IsOptional()
    @IsString()
    email:string;
    @IsOptional()
    @IsString()
    phone:string;
    @IsNotEmpty()
    @IsString()
    message:string;
};