import { IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateOfferDto {
    @IsOptional()
    @IsNumber()
    price:number;
    @IsOptional()
    @IsString()
    image:string;
};