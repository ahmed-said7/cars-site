import { IsEnum, IsMongoId, IsNegative, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { mongodbId } from "src/chat/chat.service"
enum offerType {
    new="new",
    used="used"
};


export class UpdateOfferDto {
    @IsOptional()
    @IsMongoId()
    request : mongodbId;
    @IsOptional()
    @IsNumber()
    price:number;
    @IsOptional()
    @IsString()
    image:string;
    @IsOptional()
    @IsEnum(offerType)
    status: offerType;
};