import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { mongodbId } from "../chat.service";


export class CreateChatDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsMongoId()
    user: mongodbId;
    
    @IsOptional()
    @IsMongoId()
    admin: mongodbId;
};