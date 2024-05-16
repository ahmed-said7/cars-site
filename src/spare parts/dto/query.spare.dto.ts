import { IsMongoId, IsOptional, IsNumber, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
import { ComparisonOptions } from "src/enums/interfaces";




export class QuerySpareDto {
    @IsOptional()
    @IsMongoId()
    carmodel:mongodbId;

    @IsOptional()
    @IsMongoId()
    brand:mongodbId;
    
    @IsOptional()
    name:string;

    @IsOptional()
    from : string | ComparisonOptions;
    
    @IsOptional()
    to: string | ComparisonOptions;
    
    @IsOptional()
    price: string | ComparisonOptions;
    
    @IsOptional()
    page:string;
    
    @IsOptional()
    sort:string;
    
    @IsOptional()
    select:string;
    
    @IsOptional()
    limit:string;
};