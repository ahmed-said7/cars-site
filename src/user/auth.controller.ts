import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/signup.dto";
import { LoginUserDto } from "./dto/login.dto";
import { UserService } from "./user.service";
import { changePasswordDto, forgetPassowrdBody } from "./dto/update.password.dto";

@Controller("auth")
export class AuthController {
    constructor( private userService:UserService ){};
    @Post("login")
    login( @Body() body:LoginUserDto ){
        return this.userService.login(body);
    };
    @Post("signup")
    signup( @Body() body:CreateUserDto ){
        return this.userService.signup(body);
    };
    @Patch('forget-pass')
    forgetPassowrd(@Body() body: forgetPassowrdBody ){
        return this.userService.forgetPassword(body.email);
    };

    @Patch('update-pass')
    changePassword(@Body() body : changePasswordDto ){
        return this.userService.changePassword(body);
    };

    @Patch('code/:code')
    verifyResetCode(@Param('code') code:string){
        return this.userService.verifyResetCode(code);
    };

    @Patch("verify/:code")
    verifyUserEmail( @Param("code") code:string  ){
        return this.userService.verifyEmail(code);
    };
};