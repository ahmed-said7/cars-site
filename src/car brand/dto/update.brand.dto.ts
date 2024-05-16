import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBrandDto {
    @IsOptional()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsOptional()
    image: string;
};