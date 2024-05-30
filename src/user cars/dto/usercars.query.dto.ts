import { IsOptional } from "class-validator";

export class UserCarsQueryDto {
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
    @IsOptional()
    letters?:string;
    @IsOptional()
    chNumber?:string;
    @IsOptional()
    plateNumber?:string;
    @IsOptional()
    year?:string;
};