import {  IsOptional } from "class-validator";





export class QueryUserDto {
    @IsOptional()
    name:string;

    @IsOptional()
    email:string;

    @IsOptional()
    role:string;

    @IsOptional()
    tradingType:string;

    @IsOptional()
    allowTrading:boolean;
    
    @IsOptional()
    keyword:string;

    @IsOptional()
    page:string;
    
    @IsOptional()
    sort:string;
    
    @IsOptional()
    select:string;
    
    @IsOptional()
    limit:string;
};