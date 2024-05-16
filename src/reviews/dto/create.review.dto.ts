import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { mongodbId } from "src/chat/chat.service";

export class CreateReviewDto {
    @IsOptional()
    @IsMongoId()
    user:mongodbId;
    @IsNotEmpty()
    @IsMongoId()
    review:mongodbId;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number;
};