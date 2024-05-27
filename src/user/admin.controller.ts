import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { userType } from "src/enums/user.type";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { Roles } from "src/decorator/metadata";
import { allowTradingDto } from "./dto/trader.dto";
import { QueryUserDto } from "./dto/query.user.dto";
import { CreateUserDto } from "./dto/signup.dto";

@Controller("admin")
export class AdminController {
    constructor( private userService:UserService ){};
    
    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    createUserByAdmin( body:CreateUserDto ){
        return this.userService.createUserByAdmin( body );
    };

    @Patch("trader/:userId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    allowOrPreventTrading( 
        @Param("userId",ParseMongoId) userId:mongodbId ,
        @Body() body:allowTradingDto
    ){
        return this.userService.allowOrPreventTrading(userId,body);
    };

    @Get()
    @UseGuards(Protected)
    getUsers( 
        @Query() query:QueryUserDto
    ){
        return this.userService.getAllUsers(query);
    };

    @Get(":id")
    @UseGuards(Protected)
    getOneUser( 
        @Param("id",ParseMongoId) userId:mongodbId  ){
        return this.userService.getOneUser(userId);
    };
    
    @Delete(":id")
    @UseGuards(Protected)
    @Roles(userType.admin)
    deleteOneUser( 
        @Param("id",ParseMongoId) userId:mongodbId  ){
        return this.userService.deleteUserByAdmin(userId);
    };
};