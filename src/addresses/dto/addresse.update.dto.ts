import { IsMobilePhone, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAddresseDto {
    @IsOptional()
    @IsNumber()
    code:number;
    @IsOptional()
    @IsString()
    country:string;
    @IsOptional()
    @IsString()
    city:string;
    @IsOptional()
    @IsString()
    quarter:string;
};