import { BadRequestException, CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import { Request } from "express";
import { UserDoc } from "src/schema.factory/user.schema";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { Model } from "mongoose";

interface Payload extends jwt.JwtPayload {
    userId:string;
};


declare global {
    namespace Express  {
        interface Request {
            user : UserDoc;
        }
    }
}

export class Protected implements CanActivate {
    constructor(
        private config:ConfigService
        ,@InjectModel(Models.User) private Usermodel:Model<UserDoc>
    ){};
    async canActivate(context: ExecutionContext) {
        const req=context.switchToHttp().getRequest<Request>();
        let token:string;
        if( 
            req.headers.authorization 
            && req.headers.authorization.startsWith("Bearer") 
        ){
            token=req.headers.authorization.split(" ")[1];
        };
        if( !token ){
            throw new BadRequestException("provide token");
        };
        let decoded:Payload|null=null;
        try{
            decoded=jwt.verify( token , this.config.get<string>("secret") ) as Payload;
        }catch(e){
            throw new HttpException("invalid token , please login again",400);
        };
        if(!decoded){
            throw new HttpException("token is not valid",400);
        };
        const user=await this.Usermodel.findById(decoded?.userId);
        if(!user){
            throw new HttpException("user not found",400);
        };
        if(user.passwordChangedAt){
            const stamps=new Date(user.passwordChangedAt).getTime() / 1000;
            if( stamps > decoded.iat ){
                throw new HttpException("password changed,please login again",400);
            };
        };
        if(user.role == "trader" && user.allowTrading == false ){
            throw new HttpException("please wait admin will verify your account",400);
        };
        req.user = user;
        return true;
    };
}