import { IsEnum, IsMongoId, IsNegative, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { mongodbId } from "src/chat/chat.service"
enum offerType {
    new="new",
    used="used"
};


export class CreateOfferDto {
    @IsNotEmpty()
    @IsMongoId()
    request : mongodbId;
    @IsNotEmpty()
    @IsNumber()
    price:number;
    @IsOptional()
    @IsMongoId()
    trader:mongodbId;
    @IsOptional()
    @IsString()
    image:string;
    @IsNotEmpty()
    @IsEnum(offerType)
    status: offerType;
    @IsOptional()
    @IsString()
    guarantee:string;
};