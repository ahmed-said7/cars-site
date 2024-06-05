import { IsOptional } from "class-validator";

export class QueryCouponDto {
    @IsOptional()
    name: string;
    @IsOptional()
    expire: Date;
    @IsOptional()
    discount:number;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
    @IsOptional()
    keyword?:string;
};