import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class CreateMessageDto {
    @IsOptional()
    @IsString()
    content: string;
    @IsOptional()
    @IsString()
    image: string;
    @IsNotEmpty()
    @IsMongoId()
    chat: mongodbId;
    @IsOptional()
    @IsMongoId()
    user: mongodbId;
};