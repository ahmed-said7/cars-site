import { IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsOptional()
    @IsNumber()
    postalCode:number;
    @IsOptional()
    @IsString()
    details:string;
    @IsOptional()
    @IsString()
    city:string;
    @IsOptional()
    @IsString()
    street:string;
    @IsOptional()
    @IsMobilePhone("ar-SA")
    mobile:string;
};