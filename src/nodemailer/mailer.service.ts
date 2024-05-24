import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class mailerService {
    transport:nodemailer.Transporter;
    from="market place";
    constructor(private config:ConfigService){
        this.transport=nodemailer.createTransport({
            host:this.config.get("host"),
            port:this.config.get("port"),
            secure:this.config.get("secure"),
            auth:{
                user:this.config.get("user"),
                pass:this.config.get("pass")
            }
        })
    };
    async sendWelcome( body : { email:string; resetCode:string; }){
        const to=body.email;
        const subject='welcome to our website maskeni';
        const text=
            `
                We're thrilled to have you join our community.
                To get started, 
                please verify your account using otp 
                code is ${body.resetCode}
            `;
        return this.sendMail({ from:this.from , to, subject,text});
    };
    // sendChangeingPasswordCode( body : { email:string; resetCode:string; }){
    //     const to=body.email;
    //     const subject='reset code to change your password';
    //     const text=`your reset code to change your passsword is ${body.resetCode}`;
    //     const from='e-shop';
    //     return this.send({from,to,subject,text});
    // };
    private sendMail( opts: { from:string; to:string; subject:string; text:string; }){
        return this.transport.sendMail(opts);
    };
    resetCode(){
        return String(Math.floor( 10000 + Math.random() * 90000));
    };
};