import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCouponDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsNumber()
    max?: number;
    @IsOptional()
    @IsNumber()
    discount?: number;
};