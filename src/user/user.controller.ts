import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/login.dto";
import { SignupUserAdminDto } from "./dto/signup.dto";
import { Protected } from "src/guards/protect.user";
import { UpdatePasswordDto, changePasswordDto } from "./dto/update.password.dto";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { UpdateUserAdminDto, forgetPassowrdBody } from "./dto/update.user.dto";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { mongodbId } from "src/chat/chat.service";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";
import { QueryUserDto } from "./dto/query.user.dto";


@Controller()
export class UserController {
    constructor( private userService:UserService ){};
    @Post("auth/login")
    login( @Body() body:LoginUserDto ){
        return this.userService.login(body);
    };
    @Post("auth/signup")
    signup( @Body() body:SignupUserAdminDto ){
        return this.userService.signup(body);
    };
    @Patch("user/password")
    @UseGuards(Protected)
    updatePassword( @Body() body:UpdatePasswordDto , @AuthUser() user:UserDoc  ){
        return this.userService.updatepassword(body, user);
    };

    @Get("user/verify")
    @UseGuards(Protected)
    sendVerificationToEmail( @AuthUser() user:UserDoc  ){
        return this.userService.createEmailVerificationCode(user);
    };

    @Patch("auth/verify/:code")
    verifyUserEmail( @Param("code") code:string  ){
        return this.userService.verifyEmail(code);
    };

    @Patch('auth/forget-password')
    forgetPassowrd(@Body() body: forgetPassowrdBody ){
        return this.userService.forgetPassword(body.email);
    };

    @Patch('auth/change-password')
    changePassword(@Body() body:changePasswordDto ){
        return this.userService.changePassword(body);
    };

    @Patch('auth/reset-password/:code')
    verifyResetCode(@Param('code') code:string){
        return this.userService.vertfyResetCode(code);
    };

    @Delete("user")
    @UseGuards(Protected)
    deleteUser( @AuthUser() user:UserDoc  ){
        return this.userService.deleteUser(user);
    };
    @Get("user/get-me")
    @UseGuards(Protected)
    getUser( @AuthUser() user:UserDoc  ){
        return this.userService.getUser(user);
    };
    @Patch("user")
    @UseGuards(Protected)
    @Roles(userType.admin,userType.user)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    updateUser( @AuthUser() user:UserDoc,@Body() body:UpdateUserAdminDto  ){
        return this.userService.updateUser(body,user);
    };
    @Get("user")
    @UseGuards(Protected)
    getUsers( 
        @Query() query:QueryUserDto
    ){
        return this.userService.getAllUsers(query);
    };
    @Get("user/:id")
    @UseGuards(Protected)
    getOneUser( 
        @Param("id",ParseMongoId) userId:mongodbId  ){
        return this.userService.getOneUser(userId);
    };
};