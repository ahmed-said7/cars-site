import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { UserDoc } from "src/schema.factory/user.schema";
import { mongodbId } from "src/chat/chat.service";
import { allowTradingDto, tradingType } from "./dto/trader.dto";
import { BrandDoc } from "src/schema.factory/car.brand.schema";
import { CrudService } from "src/filter/crud.service";
import { QueryUserDto } from "./dto/query.user.dto";
import * as crypto from "crypto";
import { mailerService } from "src/nodemailer/mailer.service";
import {  CreateUserDto } from "./dto/signup.dto";
import { userType } from "src/enums/user.type";
import { UpdateUserDto } from "./dto/update.user.dto";




interface LogIn {
    email: string;
    password: string;
};

interface ChangePassword {
    password: string;
    currentPassword: string;
    passwordConfirm: string;
};

@Injectable()
export class UserService {
    constructor
    (
        private config:ConfigService,
        @InjectModel(Models.User) private Usermodel: Model<UserDoc>,
        @InjectModel(Models.Brand) private brandModel: Model<BrandDoc>,
        private api : CrudService<UserDoc,QueryUserDto>,
        private mailerService:mailerService
    ) {};
    async signup( body : CreateUserDto ){
        let user=await this.validateEmail(body.email);
        if( body.password !== body.passwordConfirm ){
            throw new HttpException("password does not match password confirm",400);
        };
        if( body.role == userType.trader && !body.tradingType ){
            body.tradingType=tradingType.new;
        } else if ( body.role != userType.trader ){
            body.tradingType=null;
        };

        if( body.role == userType.trader && body.tradingBrand?.length > 0 ){
            body.tradingBrand=await this.validateBrands(body.tradingBrand);
        }else{
            body.tradingBrand = [];
        };
        user = await this.Usermodel.create(body);
        await this.emailVerification(user);
        const token=this.createtoken(user._id);
        return { token , user };
    };
    async login(body:LogIn){
        let user=await this.Usermodel.findOne({ email: body.email });
        if( ! user ){
            throw new HttpException("user not found",400);
        };
        const valid=await bcryptjs.compare(body.password,user.password);
        if( ! valid ){
            throw new HttpException("password or email is not correct",400);
        };
        const token=this.createtoken(user._id);
        return { token , user };
    };
    private createtoken(userId:string){
        const token=jwt.
            sign( {userId} , this.config.get<string>("secret") , {expiresIn:"12d"} );
        return "Bearer "+token;
    };
    async createUserByAdmin( body:CreateUserDto ){
        let user=await this.validateEmail(body.email);
        if( body.password !== body.passwordConfirm ){
            throw new HttpException("password does not match password confirm",400);
        };

        if( body.role == userType.trader && !body.tradingType ){
            body.tradingType=tradingType.new;
        } else if ( body.role != userType.trader ){
            body.tradingType=null;
        };

        if( body.role == userType.trader && body.tradingBrand?.length > 0 ){
            body.tradingBrand=await this.validateBrands(body.tradingBrand);
        }else{
            body.tradingBrand = [];
        };

        user = await this.Usermodel.create(body);
        await this.emailVerification(user);
        return { user };

    };
    async deleteUserByAdmin(userId:mongodbId){
        const user=await this.Usermodel.findByIdAndDelete(userId);
        if(!user){
            throw new HttpException("User not found",400);
        };
        return { status:"deleted" };
    };

    async updatepassword(body:ChangePassword,user:UserDoc){
        const valid=await bcryptjs.compare(body.currentPassword,user.password);
        if( ! valid ){
            throw new HttpException("current password is not correct",400);
        };
        if( body.password !== body.passwordConfirm ){
            throw new HttpException("password does not match password confirm",400);
        };
        user.password=body.password;
        user.passwordChangedAt=new Date();
        await user.save();
        return { user , status :"password has been updated" }
    };
    async deleteLoggedUser(user:UserDoc){
        await user.updateOne({ active: false });
        return { active: user.active };
    };
    async getLoggedUser(user:UserDoc){
        user.password=null;
        user.passwordChangedAt=null;
        return { user };
    };
    private async validateEmail(email:string){
        let user=await this.Usermodel.findOne({ email });
        if( user ){
            throw new HttpException("email already exists",400);
        };
        return user;
    };
    async updateUser(body:UpdateUserDto,user:UserDoc){
        if(body.email){
            await this.validateEmail(body.email);
        };
        if( user.role == userType.trader && body.tradingBrand?.length > 0 ){
            body.tradingBrand=await this.validateBrands(body.tradingBrand);
        }else if( user.role != userType.trader && body.tradingBrand?.length > 0 ){
            body.tradingBrand=[];
        };
        if( user.role != userType.trader && body.tradingType ){
            body.tradingType=null;
        };
        const updated= await this.Usermodel
            .findByIdAndUpdate(user._id,body,{new:true});
        return { status:"updated",user:updated };
    };
    private async emailVerification(user:UserDoc){
        const code=this.mailerService.resetCode();
        user.emailVerifiedCode=this.createHash(code);
        user.emailVerifiedExpired=new Date( Date.now() + 5 * 60 * 1000 );
        try{
            await this.mailerService.sendWelcome({email:user.email,resetCode:code});
        }catch(err){
            user.emailVerifiedCode=undefined;
            user.emailVerifiedExpired=undefined;
            await user.save();
            throw new HttpException("nodemailer error",400);
        };
        await user.save();
    };
    async createEmailVerificationCode( user:UserDoc ){
        if(user.emailVertified){
            throw new HttpException("your email has been verified already",400);
        };
        await this.emailVerification(user);
        return {status:"code sent"};
    };
    private createHash(code:string){
        return crypto.createHash('sha256').update(code).digest('hex');
    }

    async verifyEmail(code:string){
        const hash=this.createHash(code);
        const user=await this.Usermodel.findOne({
            emailVerifiedCode:hash,emailVerifiedExpired:{$gt:Date.now()}
        });
        if(!user){
            throw new HttpException('email Verified Code expired',400);
        };
        user.emailVerifiedCode=undefined;
        user.emailVerifiedExpired=undefined;
        user.emailVertified=true;
        await user.save();
        return {status:"verified"};
    };
    async forgetPassword(email:string){
        let user=await this.Usermodel.findOne({ email });
        if(! user ){
            throw new HttpException('user not found',400);
        };
        const resetCode=this.mailerService.resetCode();
        user.passwordResetCode=this.createHash(resetCode);
        user.passwordResetCodeExpires=new Date( Date.now() + 4*60*1000 );
        await user.save();
        try{
            await this.mailerService
                .sendChangeingPasswordCode({email:user.email,resetCode});
        }catch(e){
            console.log(e);
            user.passwordResetCode=undefined;
            user.passwordResetCodeExpires=undefined;
            await user.save();
            throw new HttpException('internal server error',400);
        };
        return {resetCode}
    };
    
    async verifyResetCode(resetCode:string){
        const hash=this.createHash(resetCode);
        let user=await this.Usermodel
            .findOne
            ({ 
                passwordResetCode:hash , 
                passwordResetCodeExpires:{ $gt: Date.now() } }
            );
        if(! user ){
            throw new HttpException('user not found',400);
        };
        user.passwordResetCode=undefined;
        user.passwordResetCodeExpires=undefined;
        user.passwordResetCodeVertified=true;
        await user.save();
        return {status:'verified'}
    };
    
    async changePassword(body:{email:string; password:string; passwordConfirm:string;}){
        let user=await this.Usermodel
            .findOne({ email:body.email });
        if(! user  ){
            throw new HttpException('user not found',400);
        };
        if(! user.passwordResetCodeVertified ){
            throw new HttpException('resetcode is not vertified',400);
        };
        if(body.password !== body.passwordConfirm){
            throw new HttpException('password mismatch',400);
        };
        user.passwordResetCodeVertified=null;
        user.password = body.password;
        user.passwordChangedAt=new Date();
        await user.save();
        return {user};
    };
    async getOneUser(userId:mongodbId){
        const user = await this.Usermodel.findOne({ _id:userId });
        if( !user ){
            throw new HttpException("User not found",400);
        };
        return { user };
    };
    async getAllUsers(query:QueryUserDto){
        return this.api.getAllDocs(this.Usermodel.find(),query);
    };
    async allowOrPreventTrading( id:mongodbId , body:allowTradingDto ){
        const user=await this.Usermodel.findOne({ _id: id });
        if( !user ){
            throw new HttpException("User not found",400);
        };
        if( user.role != userType.trader ){
            throw new HttpException("id is not belong to trader",400);
        };
        user.allowTrading=body.allowTrading;
        await user.save();
        return { trader : user };
    };
    private async validateBrands(ids:mongodbId[]){
        ids=[ ... new Set(ids) ]
        const brands=await this.brandModel.find({ _id : { $in : ids } });
        if( brands.length != ids.length ){
            throw new HttpException("brands not found",400);
        };
        return ids;
    };
};