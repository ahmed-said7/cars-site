import { Body, Controller, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Protected } from "src/guards/protect.user";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { mongodbId } from "src/chat/chat.service";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";
import { CreateTraderDto, UpdateTraderDto } from "./dto/trader.dto";
import { allowedToGuard } from "src/guards/allowed.user";


@Controller("trader")
export class TraderController {
    constructor( private userService:UserService ){};
    @Post("signup")
    signup( @Body() body:CreateTraderDto ){
        return this.userService.createTrader(body);
    };
    @Patch()
    @UseGuards(Protected,allowedToGuard)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    @Roles(userType.trader)
    updatePassword( @Body() body:UpdateTraderDto , @AuthUser() user:UserDoc  ){
        return this.userService.updateTrader(body, user);
    };
    @Patch("allow/:userId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    allowUserToTrading( @Param("userId",ParseMongoId) userId:mongodbId  ){
        return this.userService.allowMemberToTrading(userId);
    };
    @Patch("prevent/:userId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    preventUserFromTrading( @Param("userId",ParseMongoId) userId:mongodbId  ){
        return this.userService.preventMemberFromTrading(userId);
    };
};