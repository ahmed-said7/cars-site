import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class CreateCarModelDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsMongoId()
    brand: mongodbId;
};