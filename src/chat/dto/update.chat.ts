import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateChatDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;
};