import { Body, Controller, Param,Post, Req, Res, UseGuards } from "@nestjs/common";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { userType } from "src/enums/user.type";
import { Roles } from "src/decorator/metadata";
import { UserDoc } from "src/schema.factory/user.schema";
import { AuthUser } from "src/decorator/current.user";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { PaytabService } from "./paytab.service";
import { CreatePaytabUrlDto } from "./dto/create.url.dto";
import { Request, Response } from "express";



@Controller("paytab")
export class PaytabController {
    constructor(
        private paytabService:PaytabService
    ){};
    @Post(":offerId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    createRequest(
        @Body() body:CreatePaytabUrlDto,
        @AuthUser() user:UserDoc,
        @Res() res:Response,
        @Param("offerId",ParseMongoId) offerId:mongodbId
    ){
        return this.paytabService.getPaytabUrl(res,body,offerId,user);
    };
    @Post()
    validateRequest(
        @Req() request:Request 
    ){
        console.log(request.query);
    };
};