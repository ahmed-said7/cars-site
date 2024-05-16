import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { userType } from "src/enums/user.type";
import { Roles } from "src/decorator/metadata";
import { UserDoc } from "src/schema.factory/user.schema";
import { AuthUser } from "src/decorator/current.user";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { RequestService } from "./request.service.dto";
import { CreateRequestDto } from "./dto/create.request.dto";
import { UpdateRequestDto } from "./dto/update.request.dto";
import { QueryRequestDto } from "./dto/query.request.dto";



@Controller("request")
export class RequestController {
    constructor(
        private reqService:RequestService
    ){};
    @Post()
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    createRequest(
        @Body() body:CreateRequestDto,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.createRequest(body,user);
    };
    @Patch("activate/:reqId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user,userType.admin)
    activateRequest(
        @Param("reqId",ParseMongoId) reqId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.activateRequest(reqId,user);
    };
    @Patch(":reqId")
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user,userType.admin)
    updateRequest(
        @Body() body:UpdateRequestDto,
        @Param("reqId",ParseMongoId) reqId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.updateRequest(body,reqId,user);
    };
    @Delete(":reqId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user,userType.admin)
    deleteRequest(
        @Param("reqId",ParseMongoId) reqId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.deleteRequest(reqId,user);
    };
    @Get("trader")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.trader)
    getTraderReqs(
        @Query() query:QueryRequestDto,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.getAllTraderRequests(query,user);
    };
    @Get("user")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    getUserReqs(
        @Query() query:QueryRequestDto,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.getAllUserRequests(query,user);
    };
    @Get()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    getRequests(
        @Query() query:QueryRequestDto
    ){
        return this.reqService.getAllRequests(query);
    };
    @Get(":reqId")
    @UseGuards(Protected)
    getRequest(
        @Param("reqId",ParseMongoId) reqId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.reqService.getRequest(reqId,user);
    };
};