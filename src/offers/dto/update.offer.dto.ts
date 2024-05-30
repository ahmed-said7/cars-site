import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
enum offerType {
    new="new",
    used="used"
};

export class UpdateOfferDto {
    @IsOptional()
    @IsNumber()
    price:number;
    @IsOptional()
    @IsEnum(offerType)
    status:string;
    @IsOptional()
    @IsString()
    image:string;
    @IsOptional()
    @IsString()
    guarantee:string;
    @IsOptional()
    @IsString()
    color:string;
};