import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const AuthUser=createParamDecorator(function(data:unknown,ctx:ExecutionContext){
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});