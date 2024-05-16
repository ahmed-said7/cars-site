import { IsMobilePhone, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { mongodbId } from "src/chat/chat.service";
export class CreatePaytabUrlDto {
    @IsNotEmpty()
    @IsMobilePhone()
    phone: string;
    @IsNotEmpty()
    @IsString()
    street: string;
    @IsNotEmpty()
    @IsString()
    city: string;
    @IsOptional()
    @IsString()
    state?: string;
    @IsOptional()
    @IsString()
    country?: string;
    @IsOptional()
    @IsString()
    zip?:string;
    @IsOptional()
    @IsString()
    ip?:string;
    requestId:mongodbId;
    price: number;
};