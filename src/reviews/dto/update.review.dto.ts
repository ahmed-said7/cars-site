import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number;
};