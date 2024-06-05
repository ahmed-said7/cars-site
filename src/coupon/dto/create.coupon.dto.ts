import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsNumber()
    max: number;
    @IsNotEmpty()
    @IsNumber()
    discount: number;

};