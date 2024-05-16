import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create.review.dto";
import { QueryReviewDto } from "./dto/query.review.dto";
import { UpdateReviewDto } from "./dto/update.review.dto";
import { allowedToGuard } from "src/guards/allowed.user";
import { Protected } from "src/guards/protect.user";
import { userType } from "src/enums/user.type";
import { Roles } from "src/decorator/metadata";
import { UserDoc } from "src/schema.factory/user.schema";
import { AuthUser } from "src/decorator/current.user";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";



@Controller("review")
export class ReviewController {
    constructor(private reviewService:ReviewService ){};
    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader,userType.user)
    createReview(
        @Body() body:CreateReviewDto,
        @AuthUser() user:UserDoc
    ){
        return this.reviewService.createReview(body,user);
    };
    @Patch(":reviewId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader,userType.user,userType.admin)
    updateReview(
        @Body() body:UpdateReviewDto,
        @Param("reviewId",ParseMongoId) reviewId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.reviewService.updateReview(body,reviewId,user);
    };
    @Delete(":reviewId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader,userType.user,userType.admin)
    deleteReview(
        @Param("reviewId",ParseMongoId) reviewId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.reviewService.deleteReview(reviewId,user);
    };
    @Get()
    @UseGuards(Protected)
    getReviews(
        @Query() query:QueryReviewDto
    ){
        return this.reviewService.getAllReviews(query);
    };
    @Get(":reviewId")
    @UseGuards(Protected)
    getReview(
        @Param("reviewId",ParseMongoId) reviewId:mongodbId
    ){
        return this.reviewService.getReview(reviewId);
    };
};