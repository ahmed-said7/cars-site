import { Body, Controller, Delete, Get, Param, 
    Patch, Post, Query, UseGuards } from "@nestjs/common";
import { allowedToGuard } from "src/guards/allowed.user";
import { Protected } from "src/guards/protect.user";
import { userType } from "src/enums/user.type";
import { Roles } from "src/decorator/metadata";
import { UserDoc } from "src/schema.factory/user.schema";
import { AuthUser } from "src/decorator/current.user";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { CreateOfferDto } from "./dto/create.offer.dto";
import { OfferService } from "./offer.service";
import { UpdateOfferDto } from "./dto/update.offer.dto";
import { QueryOfferDto } from "./dto/query.offer.dto";



@Controller("offer")
export class OfferController {
    constructor(private offerService:OfferService ){};
    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader)
    createOffer(
        @Body() body:CreateOfferDto,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.createOffer(body,user);
    };
    @Patch("trader-accept/:offerId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader)
    traderAcceptOffer(
        @Param("offerId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.traderAcceptOffer(offerId,user);
    };
    @Patch("user-accept/:offerId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    userAcceptOffer(
        @Param("offerId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.userAcceptOffer(offerId,user);
    };
    @Patch("user-reject/:offerId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    userRejectOffer(
        @Param("offerId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.userRejectedOffer(offerId,user);
    };
    @Patch(":offerId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader)
    updateOffer(
        @Body() body:UpdateOfferDto,
        @Param("offerId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.updateOffer(body,offerId,user);
    };
    @Delete(":offerId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader,userType.user,userType.admin)
    deleteOffer(
        @Param("offerId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.deleteOffer(offerId,user);
    };
    @Get("request/:reqId")
    @UseGuards(Protected)
    getRequestOffers(
        @Param("reqId",ParseMongoId) reqId:mongodbId,
        @Query() query:QueryOfferDto,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.getRequestOffers(reqId,query,user);
    };
    @Get(":offerId")
    @UseGuards(Protected)
    getReview(
        @Param("offerId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.offerService.getOneOffer(offerId,user);
    };
};