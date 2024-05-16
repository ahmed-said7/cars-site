import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/login.dto";
import { SignupUserAdminDto } from "./dto/signup.dto";
import { Protected } from "src/guards/protect.user";
import { UpdatePasswordDto } from "./dto/update.password.dto";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { UpdateUserAdminDto } from "./dto/update.user.dto";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { mongodbId } from "src/chat/chat.service";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";


@Controller("user")
export class UserController {
    constructor( private userService:UserService ){};
    @Post("login")
    login( @Body() body:LoginUserDto ){
        return this.userService.login(body);
    };
    @Post("signup")
    signup( @Body() body:SignupUserAdminDto ){
        return this.userService.signup(body);
    };
    @Patch("password")
    @UseGuards(Protected)
    updatePassword( @Body() body:UpdatePasswordDto , @AuthUser() user:UserDoc  ){
        return this.userService.updatepassword(body, user);
    };
    @Delete()
    @UseGuards(Protected)
    deleteUser( @AuthUser() user:UserDoc  ){
        return this.userService.deleteUser(user);
    };
    @Get("get-me")
    @UseGuards(Protected)
    getUser( @AuthUser() user:UserDoc  ){
        return this.userService.getUser(user);
    };
    @Patch()
    @UseGuards(Protected)
    @Roles(userType.admin,userType.user)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    updateUser( @AuthUser() user:UserDoc,@Body() body:UpdateUserAdminDto  ){
        return this.userService.updateUser(body,user);
    };
    @Get("search/:keyword")
    @UseGuards(Protected)
    getUsers( 
        @Param("keyword") keyword:string  ){
        return this.userService.getUsersBySearchName(keyword);
    };
    @Get("one/:id")
    @UseGuards(Protected)
    getOneUser( 
        @Param("id",ParseMongoId) userId:mongodbId  ){
        return this.userService.getOneUser(userId);
    };
};