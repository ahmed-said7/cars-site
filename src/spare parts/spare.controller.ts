import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { SpareService } from "./spare.service";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { userType } from "src/enums/user.type";
import { Roles } from "src/decorator/metadata";
import { UserDoc } from "src/schema.factory/user.schema";
import { AuthUser } from "src/decorator/current.user";
import { CreateSpareDto } from "./dto/create.spare.dto";
import { UpdateSpareDto } from "./dto/update.spare.dto";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { QuerySpareDto } from "./dto/query.spare.dto";
import { UserController } from "src/user/user.controller";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";



@Controller("spare")
export class SpareController {
    constructor(
        private spareService:SpareService
    ){};
    @Post()
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader)
    createSpare(
        @Body() body:CreateSpareDto,
        @AuthUser() user:UserDoc
    ){
        return this.spareService.createSpare(body,user);
    };
    @Patch(":spareId")
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader,userType.admin)
    updateSpare(
        @Body() body:UpdateSpareDto,
        @Param("spareId",ParseMongoId) spareId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.spareService.updateSpare(body,spareId,user);
    };
    @Delete(":spareId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader,userType.admin)
    deleteSpare(
        @Param("spareId",ParseMongoId) spareId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.spareService.deleteSpare(spareId,user);
    };
    @Get()
    getSpares(
        @Query() query:QuerySpareDto
    ){
        return this.spareService.getAllSpares(query);
    };
    @Get(":spareId")
    getSpare(
        @Param("spareId",ParseMongoId) spareId:mongodbId
    ){
        return this.spareService.getSpare(spareId);
    };
};