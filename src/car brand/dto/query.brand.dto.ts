import { IsOptional } from "class-validator";

export class QueryBrandDto {
    @IsOptional()
    name: string;
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