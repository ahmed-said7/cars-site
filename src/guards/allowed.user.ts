import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class allowedToGuard implements CanActivate {
    constructor( private reflector: Reflector ) {};
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<string[]>("roles", context.getHandler());
        if (!roles) {
            return false;
        }
        const request=context.switchToHttp().getRequest() as Request;
        if( ! roles.includes(request.user.role) ){
            throw new HttpException(`you are not allowed to access route only ${roles.join("&")}`,400)
        };
        return true;
    };
};