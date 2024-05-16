import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class allowedToGuard implements CanActivate {
    constructor( private reflector: Reflector ) {};
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get("roles", context.getHandler());
        if (!roles) {
            return false;
        }
        
        const request=context.switchToHttp().getRequest() as Request;
        console.log(request.user.role,roles)
        return roles.includes(request.user.role);
    };
};