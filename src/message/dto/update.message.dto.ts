import { IsOptional, IsString } from "class-validator";

export class UpdateMessageDto {
    @IsOptional()
    @IsString()
    content: string;
    @IsOptional()
    @IsString()
    image: string;
};