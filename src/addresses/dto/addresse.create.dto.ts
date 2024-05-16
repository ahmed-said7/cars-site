import { IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddresseDto {
    @IsOptional()
    @IsNumber()
    postalCode:number;
    @IsOptional()
    @IsString()
    details:string;
    @IsNotEmpty()
    @IsString()
    city:string;
    @IsNotEmpty()
    @IsString()
    street:string;
    @IsOptional()
    @IsMobilePhone("ar-SA")
    mobile:string;
};