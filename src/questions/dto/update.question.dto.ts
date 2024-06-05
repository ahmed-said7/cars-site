import { IsOptional, IsString } from "class-validator";

export class UpdateQuestionDto {
    @IsOptional()
    @IsString()
    answer:string;
    @IsOptional()
    @IsString()
    question:string;
};