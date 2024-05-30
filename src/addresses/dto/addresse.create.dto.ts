import { IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddresseDto {
    @IsOptional()
    @IsNumber()
    code:number;
    @IsOptional()
    @IsString()
    quarter:string;
    @IsNotEmpty()
    @IsString()
    city:string;
    @IsNotEmpty()
    @IsString()
    country:string;
};